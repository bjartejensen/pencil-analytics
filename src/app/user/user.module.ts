import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserRoutingModule } from "./user-routing.module";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "../shared/shared.module";
import { SubscriptionComponent } from './subscription/subscription.component';
import { StripecheckoutComponent } from './stripecheckout/stripecheckout.component';

@NgModule({
  declarations: [LoginComponent, SubscriptionComponent, StripecheckoutComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
