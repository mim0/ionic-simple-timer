import { Injectable } from '@angular/core';

import { StorerProvider } from '../storer/storer';
import { NotificatorProvider } from '../notificator/notificator';

@Injectable()
export class TimerProvider {

  activeTimer: any;
  temporalTimer: any;

  constructor(
    private storer: StorerProvider,
    private notificator: NotificatorProvider
  ) {
  }

  activate(timerinfo) {
    this.activeTimer = timerinfo;
    this.temporalTimer = timerinfo;

    // TODO: Destroy all active notifications
    this.notificator.destroy();
  }

  play() {
    
  }

  isValid(timer) {
    return timer
      && timer.rounds > 0
      && timer.work.minutes + timer.work.seconds > 0;
  }

  create(name?, rounds?, w_minutes?, w_seconds?, r_minutes?, r_seconds?) {
    return {
      name: name || '',
      rounds: rounds || 1,
      work: {
        minutes: w_minutes || 0,
        seconds: w_seconds || 0
      },
      rest: {
        minutes: r_minutes || 0,
        seconds: r_seconds || 0
      }
    }
  }

  save(timer, timer_key?) {
    return this.storer.save(timer, timer_key);
  }

  remove(timer_key) {
    return this.storer.remove(timer_key);
  }

  getAll() {
    console.log(this.storer.all());
    return this.storer.all();
  }

}
