import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterEvent, Router } from "@angular/router";
import { StripeCheckoutService } from "src/services/stripeCheckout.service";

@Component({
  selector: "app-stripecheckout",
  templateUrl: "./stripecheckout.component.html",
  styleUrls: ["./stripecheckout.component.scss"],
})
export class StripecheckoutComponent implements OnInit {
  message: string = "Din order processeres. Vent venligst";
  //"Din ordre er gennemført. Tak fordi du handlede hos mig."; //"Din order processeres. Vent venligst";
  waiting: boolean = true;
  status: string;
  purchaseSessionId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkOutService: StripeCheckoutService
  ) {}

  ngOnInit(): void {
    const result = this.route.snapshot.queryParamMap.get("purchaseResult");
    if (result === "success") {
      debugger;

      const ongoingPurchaseSessionId = this.route.snapshot.queryParamMap.get(
        "ongoingPurchaseSessionId"
      );

      this.checkOutService
        .waitForPurchaseCompleted(ongoingPurchaseSessionId)
        .subscribe(() => {
          debugger;

          this.waiting = false;
          this.message =
            "Din ordre er gennemført. Tak fordi du handlede hos mig.";
          setTimeout(() => {
            this.router.navigateByUrl("/dashboard");
          }, 3000);
        });
    } else {
      this.waiting = false;
      this.message =
        "Der opstod problemer med at gennemføre ordren. Kontakt venligst Louise Rought Jewellery for en eventuel afklaring";
      setTimeout(() => {
        this.router.navigateByUrl("/");
      }, 3000);
    }

    this.route.queryParams.subscribe((queryParam) => {
      setTimeout(() => {
        this.status = queryParam.purchaseResult;
        this.purchaseSessionId = queryParam.onGoingPurchaseSessionId;
      }, 300);
    });
  }

  get isSucces(): boolean {
    return this.status.toLowerCase() === "success" ? true : false;
  }
}
