import {
  Controller,
  Body,
  Get,
  Post,
  Res,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { StripeService } from "./stripe.service";

@Controller("stripe")
export class StripeController {
  constructor(
    private stripeService: StripeService,
    private configService: ConfigService
  ) {}

  @Get("test")
  async getHelloWorld(@Res() response: any) {
    return response.status(200).send("Hello world");
  }

  @Post("checkout")
  async createCheckoutSession(@Body() body: any, @Res() response: any) {
    try {
      const pricingPlan = body.pricingPlan;
      const uid = body.uid;
      const callbackUrl = body.callbackUrl;

      //Using functionality on the server
      const session = await this.stripeService.createCheckoutSession(
        uid,
        pricingPlan,
        callbackUrl
      );

      return response.status(HttpStatus.OK).json({
        stripeCheckoutSession: session,
        stripePublicKey: this.configService.get<string>("STRIPE_PUBLIC_KEY"),
      });
    } catch (err) {
      console.log("Error in checkout, res: ", err);
      return response.status(400).send(`Checkout error: ${err.message}`);
    }
  }

  @Post("webhooks")
  async stripeWebhooks(@Req() req: any, @Res() response: any) {
    try {
      console.log("Wuhu!");
      const signature = req.headers["stripe-signature"];
      const event = await this.stripeService.validateSignatureAndRetrieveEvent(
        req.rawBody,
        signature
      );

      console.log("Wuhu!");

      if (event) {
        response.json({ received: true });
      }
    } catch (err) {
      console.log("Error processing webhook event, res: ", err);
      return response.status(400).send(`Webhook error:   ${err.message}`);
    }
  }
}
