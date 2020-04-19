import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { FirestoreService } from "../../firestore/firestore.service";
//import { DBProduct } from "../../interfaces/product.interface";

@Injectable()
export class StripeService {
  private readonly stripe = new Stripe(
    this.configService.get<string>("STRIPE_SECRET_KEY")
  );

  constructor(
    private readonly configService: ConfigService,
    private firestoreService: FirestoreService
  ) {}

  //Obsolete
  /*  async createIntent(amount: number, currency: string, email: string) {
    return await this.stripe.paymentIntents.create({
      amount,
      currency: currency,
      payment_method_types: ["card"],
      metadata: { uid: "some_userID" },
      receipt_email: email,
    });
  } */

  public async validateSignatureAndRetrieveEvent(
    requestBody: any,
    signature: string
  ): Promise<any> {
    const wh_secret = this.configService.get<string>("STRIPE_WEBHOOK_SECRET");

    console.log("Web hook er kaldt og secret er : " + wh_secret);

    const event = await this.stripe.webhooks.constructEvent(
      requestBody,
      signature,
      wh_secret
    );

    if (event.type === "checkout.session.completed") {
      console.log("Checkout session complete : " + wh_secret);

      const session = event.data.object;
      await this.onCheckoutSessionCompleted(session);
      return session;
    } else {
      return null;
    }
  }

  public async createCheckoutSession(
    uid: string,
    pricingPlan: string,
    callbackUrl: string
  ) {
    try {
      const sessionId = await this.createNewSubscriptionInDb(uid, pricingPlan);

      let sessionConfig: any;

      /*  const config: any = {
        payment_method_types: ['card'],
        success_url: `${info.callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${sessionId}`,
        cancel_url: `${info.callbackUrl}/?purchaseResult=failed`,
        client_reference_id: sessionId
    };
 */
      if (pricingPlan) {
        //Start of calling stripe

        /*  sessionConfig = this.setupSubscriptionSession(
          sessionId,
          pricingPlan,
          callbackUrl
        ); */

        sessionConfig = {
          payment_method_types: ["card"],
          success_url: `${callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${sessionId}`,
          cancel_url: `${callbackUrl}/?purchaseResult=failed`,
          client_reference_id: sessionId,
          subscription_data: { items: [{ plan: pricingPlan }] },
        };
      }

      return await this.stripe.checkout.sessions.create(sessionConfig);
    } catch (error) {
      console.log("Unexpected error occured while purchasing", error);
      return await "Fejl";
    }
  }

  private async onCheckoutSessionCompleted(session: any) {
    //"client_reference_id": "LqpARIMVlfHxxudYFDB8" this is purchase session
    const purchaseSessionId = session.client_reference_id;
    console.log("purchaseSessionId: " + purchaseSessionId);

    //This is the stripe customerId (to reuse client info at Stripe)
    const stripeCustomerId = session.customer;
    const email = await this.getCustomerEmail(stripeCustomerId);
    console.log("Email: " + email);

    //The Pencil UID
    const uid = session.uid;
    console.log("uid: " + uid);

    //The stripe pricing planID
    const pricingPlanId = session.plan;
    console.log("PricingPlanId: " + pricingPlanId);

    const purchaseCollection = this.configService.get<string>(
      "FIRESTORE_PURCHASESESSION_COLLECTION"
    );

    const batch = this.firestoreService.db.batch();

    //1. Write to Purchase session
    const purchaseSessionRef = this.firestoreService.db.doc(
      `${purchaseCollection}/${purchaseSessionId}`
    );

    batch.update(purchaseSessionRef, {
      status: "completed",
    });

    //2. Write to user profile
    const userRef = this.firestoreService.db.doc(`users/${uid}`);

    batch.set(
      userRef,
      {
        pricingplan: pricingPlanId,
        stripecustomerid: stripeCustomerId,
      },
      { merge: true }
    );

    return batch.commit();
  }

  private async createNewSubscriptionInDb(uid: string, pricingPlanId: string) {
    const purchaseCollection = this.configService.get<string>(
      "FIRESTORE_PURCHASESESSION_COLLECTION"
    );

    const purchaseSession = await this.firestoreService.db
      .collection(`${purchaseCollection}`)
      .doc();

    await purchaseSession.set(
      {
        pricingplan: pricingPlanId,
        uid: uid,
        createdAt: new Date(),
        status: "pending",
      },
      { merge: true }
    );

    return purchaseSession.id;
  }

  private async getCustomerEmail(customerId: string) {
    const customerInfo = await this.stripe.customers.retrieve(customerId);
    const email = (await customerInfo).email;

    return email;
  }

  /*  private setupSubscriptionSession(
    sessionId: string,
    pricingPlanId: string,
    callbackUrl: string
  ) {
    const config = this.setupBaseSessionConfig(callbackUrl, sessionId);

    config.subscription_data = {
      items: [{ plan: pricingPlanId }],
    };

    return config;
  } */

  /* private setupBaseSessionConfig(sessionId: string, callbackUrl: string) {
    const config: any = {
      payment_method_types: ["card"],
      success_url: `${callbackUrl}/?purchaseResult=success&ongoingPurchaseSessionId=${sessionId}`,
      cancel_url: `${callbackUrl}/?purchaseResult=failed`,
      client_reference_id: sessionId,
    };

    return config;
  } */
}
