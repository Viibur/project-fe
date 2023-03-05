import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LugerService {

  constructor() { }

  private _kokku$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private _oige$: BehaviorSubject<number> = new BehaviorSubject<number>(0);


  get kokku$(): BehaviorSubject<number> {
    return this._kokku$;
  }

  get oige$(): BehaviorSubject<number> {
    return this._oige$;
  }
}
