import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { CheckoutSession } from "../app/shared/models/checkout-session.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { filter, first, tap, switchMap } from "rxjs/operators";
import { AuthStore } from "./auth.store";

declare const Stripe;

@Injectable({
  providedIn: "root",
})
export class StripeCheckoutService {
  constructor(
    private http: HttpClient,
    private afs: AngularFirestore,
    private auth: AuthStore
  ) {}

  testStripe(): Observable<string> {
    let url = environment.baseServerUrl + "stripe/test";
    return this.http.get<string>(url, {});
  }

  startSubscriptionCheckoutSession(
    pricingPlan: string
  ): Observable<CheckoutSession> {
    //Todo: Handling of only signed in users
    const jwtAuth = "mytoken";
    const headers = new HttpHeaders().set("Authorization", jwtAuth);
    //

    debugger;
    let url = environment.baseServerUrl + "stripe/checkout";
    const callbackUrl: string = this.buildCallbackUrl();

    return this.auth.user$.pipe(
      tap((user) => {
        debugger;
        console.log("UID:" + user.uid);
      }),
      switchMap((user) =>
        this.http.post<CheckoutSession>(url, {
          pricingPlan: pricingPlan,
          uid: user.uid,
          callbackUrl: callbackUrl,
        })
      )
    );

    /* return this.http.post<CheckoutSession>(url, {
      pricingPlan: pricingPlan,
      uid: uid,
      callbackUrl: callbackUrl,
    }); */
  }

  startCheckoutSession(
    itemId: string,
    ringSize: number = 0
  ): Observable<CheckoutSession> {
    let url = environment.baseServerUrl + "stripe/checkout";

    const callbackUrl: string = this.buildCallbackUrl();

    debugger;

    return this.http.post<CheckoutSession>(url, {
      productId: itemId,
      callbackUrl: callbackUrl,
      ringSize: ringSize,
    });
  }

  buildCallbackUrl() {
    const protocol = window.location.protocol,
      hostName = window.location.hostname,
      port = window.location.port;

    let callbackUrl = `${protocol}//${hostName}`;
    if (port) {
      callbackUrl += ":" + port;
    }

    callbackUrl += "/subscription/stripe-checkout";
    return callbackUrl;
  }

  redirectToCheckout(session: CheckoutSession) {
    debugger;

    var stripe = Stripe(session.stripePublicKey);

    stripe.redirectToCheckout({
      sessionId: session.stripeCheckoutSession.id,
    });
  }

  waitForPurchaseCompleted(ongoingPurchasesessionId: string): Observable<any> {
    debugger;

    return this.afs
      .doc<any>(
        `${environment.firestorePurchaseSessionsCollection}/${ongoingPurchasesessionId}`
      )
      .valueChanges()
      .pipe(
        filter((purchase) => purchase.status === "completed"),
        first() //complete when the first value has been emitted
      );
  }
}
