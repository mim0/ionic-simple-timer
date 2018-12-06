import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class StorerProvider {

  constructor(
    private storage: Storage
  ) {

  }

  generateKey() {
    return (new Date()).getTime();
  }

  save(timer, timer_key?) {
    if (!timer_key) {
      timer_key = this.generateKey();
    }
    timer.id = timer_key;
    return this.storage.set(timer_key, timer);
  }

  remove(timer_key) {
    return this.storage.remove(timer_key);
  }

  all(nofilter = false) {
    let listObs: BehaviorSubject<any> = new BehaviorSubject([]);

    let list = [];
    this.storage.forEach((value, key) => {
      if (key != 'temporal' || nofilter) {
        list.push({ timer_key: key, timer: value });
        listObs.next(list);
      }
    });

    return listObs;
  }

  get(timer_key) {
    return this.storage.get(timer_key);
  }

}
