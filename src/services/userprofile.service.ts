import { Injectable, Output, EventEmitter } from "@angular/core";
import { Observable, Subscription, BehaviorSubject, Subject, of } from "rxjs";
import { map, filter, switchMap } from "rxjs/operators";
import { User } from "../models/userprofile.model";
import { Router } from "@angular/router";

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class UserprofileService {
  user$: Observable<any>;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async emailSignin(email: string, password: string) {
    debugger;

    /*  const credentials = await this.afAuth.signInWithEmailAndPassword(
      email,
      password
    );

    return this.updateUserData(credentials.user); */
  }

  private updateUserData(user) {
    debugger;
    const userRef: AngularFirestoreDocument<User> = this.db.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      pictureUrl: user.photoURL,
    };

    return userRef.set(data, { merge: true });
  }

  async signout() {
    //await this.afAuth.signOut();
    return this.router.navigate(["/"]);
  }

  getCurrentUserProfile(): Observable<User> {
    const authObservable$ = this.afAuth.user;

    return authObservable$.pipe(
      switchMap((user) => {
        const doc = this.db.doc("users/" + user.uid);

        return doc.snapshotChanges().pipe(
          map((snap) => {
            let id = snap.payload.id;
            let aModel = snap.payload.data();
            return aModel as User;
          })
        );
      })
    );
  }

  createUserProfileInDb(
    uid: string,
    name: string,
    email: string
  ): Promise<any> {
    const role = "visitor";
    //let newUser = new UserProfile(uid, name, role, email);

    return new Promise((resolve, reject) => {
      const fields = this.db
        .collection("users")
        .doc(uid)
        .set({
          uid: uid,
          name: name,
          role: role,
          email: email,
        })
        .then((x) => {
          debugger;
          resolve({ x });
        })
        .catch((err) => {
          debugger;
          reject({ confirmId: JSON.stringify(err) });
        });
    });
  }
}
