import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "./material/material.module";
import { ShellComponent } from "./shell/shell.component";
import { environment } from "../../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoadingComponent } from "./loading/loading.component";
import { MessagesComponent } from "./messages/messages.component";

@NgModule({
  declarations: [ShellComponent, LoadingComponent, MessagesComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  exports: [
    MaterialModule,
    ShellComponent,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    MessagesComponent,
  ],
})
export class SharedModule {}
