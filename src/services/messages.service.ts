import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class MessagesService {
  //Usual pattern
  private subject = new BehaviorSubject<string[]>([]);

  //Filter operator in order to avoid initial emit of []
  errors$: Observable<string[]> = this.subject
    .asObservable()
    .pipe(filter((messages) => messages && messages.length > 0));

  constructor() {}

  showErrors(...errors: string[]) {
    debugger;
    this.subject.next(errors);
  }
}
