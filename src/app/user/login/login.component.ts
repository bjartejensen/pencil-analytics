import { Component, OnInit, AfterViewInit } from "@angular/core";

import { UserprofileService } from "src/services/userprofile.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthStore } from "src/services/auth.store";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public auth: AuthStore,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ["bjartejensen@gmail.com", [Validators.required]],
      password: ["bmj150774", [Validators.required]],
    });
  }

  ngOnInit() {}

  signout() {}

  login() {
    const val = this.form.value;
    debugger;

    this.auth.login(val.email, val.password).subscribe(
      () => {
        debugger;
        this.router.navigateByUrl("/dashboard");
      },
      (err) => {
        debugger;
        alert("Login failed!");
      }
    );
  }
}
