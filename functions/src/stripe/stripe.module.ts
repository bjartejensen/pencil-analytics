import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FirestoreService } from "../firestore/firestore.service";
import { StripeController } from "./stripe/stripe.controller";
import { StripeService } from "./stripe/stripe.service";

@Module({
  controllers: [StripeController],
  providers: [StripeService, ConfigService, FirestoreService],
})
export class StripeModule {}
