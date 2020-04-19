import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable, throwError } from "rxjs";
import { AuthStore } from "./auth.store";
import { take, map, tap } from "rxjs/operators";
import { MessagesService } from "./messages.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthStore,
    private messagesService: MessagesService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.isLoggedIn$.pipe(
      take(1),
      tap((loggedIn) => {
        if (!loggedIn) {
          const err = "Access denied";
          this.messagesService.showErrors(err);
          this.router.navigateByUrl("/login");
          return throwError(err);
        }
      })
    );
  }
}
