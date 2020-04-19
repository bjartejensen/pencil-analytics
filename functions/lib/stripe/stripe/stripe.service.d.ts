import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";
import { FirestoreService } from "../../firestore/firestore.service";
export declare class StripeService {
    private readonly configService;
    private firestoreService;
    private readonly stripe;
    constructor(configService: ConfigService, firestoreService: FirestoreService);
    validateSignatureAndRetrieveEvent(requestBody: any, signature: string): Promise<any>;
    createCheckoutSession(uid: string, pricingPlan: string, callbackUrl: string): Promise<Stripe.checkouts.sessions.ICheckoutSession | "Fejl">;
    private onCheckoutSessionCompleted;
    private createNewSubscriptionInDb;
    private getCustomerEmail;
}
