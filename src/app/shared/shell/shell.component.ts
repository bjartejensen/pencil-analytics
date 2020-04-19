import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable, of, from } from "rxjs";
import { map, shareReplay, filter } from "rxjs/operators";
import { AuthStore } from "src/services/auth.store";
import { Router } from "@angular/router";

@Component({
  selector: "app-shell",
  templateUrl: "./shell.component.html",
  styleUrls: ["./shell.component.scss"],
})
export class ShellComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Web])
    .pipe(
      map((result) => !result.matches),
      shareReplay()
    );
  isDesktop$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Web])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public auth: AuthStore
  ) {}

  ngOnInit(): void {}

  gotoLogin() {
    this.router.navigateByUrl("/login");
  }

  logout() {
    this.auth.logout();
  }
}
