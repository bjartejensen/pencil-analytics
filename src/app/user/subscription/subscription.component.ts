import { Component, OnInit } from "@angular/core";
import { StripeCheckoutService } from "src/services/stripeCheckout.service";

@Component({
  selector: "app-subscription",
  templateUrl: "./subscription.component.html",
  styleUrls: ["./subscription.component.scss"],
})
export class SubscriptionComponent implements OnInit {
  purchaseStarted: boolean;

  constructor(private stripeCheckoutService: StripeCheckoutService) {}

  ngOnInit(): void {}

  subscribeToPlan() {
    this.stripeCheckoutService
      .startSubscriptionCheckoutSession("plan_H7Td6f8hOE5R9F")
      .subscribe((session) => {
        this.stripeCheckoutService.redirectToCheckout(session),
          (err) => {
            console.log("Error creating checkout session", err);
            this.purchaseStarted = false;
          };
      });
  }

  purchaseJewellery() {
    this.purchaseStarted = true;

    /*  this.stripeCheckoutService
      .startCheckoutSession(itemId, this.selectedRingSize)
      .subscribe(
        (session) => {
          this.stripeCheckoutService.redirectToCheckout(session);
        },
        (err) => {
          console.log("Error in the checkout flow", err);
          this.purchaseStarted = false;
        }
      ); */
  }
}
