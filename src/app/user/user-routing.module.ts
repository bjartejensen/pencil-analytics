import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SubscriptionComponent } from "./subscription/subscription.component";
import { StripecheckoutComponent } from "./stripecheckout/stripecheckout.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "subscription", component: SubscriptionComponent },
  {
    path: "stripe-checkout",
    component: StripecheckoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
