import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, of, from } from "rxjs";
import { User } from "src/models/userprofile.model";
import { map, shareReplay, tap, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { LoadingService } from "./loading.service";

const AUTH_DATA = "auth_data";

@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject<User>(null);

  user$: Observable<User> = this.subject.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggin) => !loggin));

    const user = localStorage.getItem(AUTH_DATA);

    if (user) {
      this.subject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User> {
    debugger;
    const authUserCredentials$ = this.loadingService.showLoaderUntilCompleted(
      from(this.afAuth.signInWithEmailAndPassword(email, password))
    );

    return authUserCredentials$
      .pipe(
        tap((cred) => {
          debugger;
          let user: User = {
            email: cred.user.email,
            name: cred.user.displayName,
            uid: cred.user.uid,
            pictureUrl: cred.user.photoURL,
          };
          this.subject.next(user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user));
          this.router.navigateByUrl("/dashboard");
        }),
        map((cred) => {
          debugger;
          let u: User = {
            email: cred.user.email,
            name: cred.user.displayName,
            uid: cred.user.uid,
            pictureUrl: cred.user.photoURL,
          };

          return u;
        })
      )
      .pipe(shareReplay());
  }

  async logout() {
    await this.afAuth.signOut();
    this.subject.next(null);
    localStorage.removeItem(AUTH_DATA);
    this.router.navigate(["/"]);
  }
}
