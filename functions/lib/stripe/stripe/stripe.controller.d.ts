import { ConfigService } from "@nestjs/config";
import { StripeService } from "./stripe.service";
export declare class StripeController {
    private stripeService;
    private configService;
    constructor(stripeService: StripeService, configService: ConfigService);
    getHelloWorld(response: any): Promise<any>;
    createCheckoutSession(body: any, response: any): Promise<any>;
    stripeWebhooks(req: any, response: any): Promise<any>;
}
