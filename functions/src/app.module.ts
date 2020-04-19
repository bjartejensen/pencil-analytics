import { Module, HttpModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { StripeModule } from "./stripe/stripe.module";

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    StripeModule,
    ConfigModule.forRoot({
      envFilePath: "development.env",
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
