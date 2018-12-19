import { Injectable } from '@angular/core';

import { StorerProvider } from '../storer/storer';
import { NotificatorProvider } from '../notificator/notificator';

@Injectable()
export class TimerProvider {

  activeTimer: any;

  running_timer_list: any[];
  oninit: boolean;

  constructor(
    private storer: StorerProvider,
    private notificator: NotificatorProvider
  ) {
    this.getActiveTimer();
  }

  getActiveTimer() {
    this.running_timer_list = [];

    this.notificator.all()
      .then(running_timers => {
        this.setRunningList(running_timers);

        if (running_timers && running_timers.length > 0) {
          let id = this.getTimerID(running_timers[0]);
          this.findActiveTimer(id)
            .then(timer => {
              this.activeTimer = { timer_key: id, timer };
            })
            .catch(err => console.log(err));
        }

      })
      .catch(err => console.log(err));
  }

  findActiveTimer(id) {
    return this.storer.get(id);
  }

  setRunningList(running_timers) {
    this.running_timer_list = running_timers;
  }

  getTimerID(running_timer) {
    return JSON.parse(running_timer.data).id.toString();
  }

  activate(timerinfo) {
    this.activeTimer = timerinfo;

    this.notificator.destroy();
  }

  play(running_timer = null, round = 0) {
    this.notificator.create(this.activeTimer, round, running_timer);
  }

  continue() {
    this.storer.get('temporal')
      .then(temporal_timer => {
        this.notificator.continue(temporal_timer);
        this.notificator.destroy();
        this.storer.remove('temporal');
      })
      .catch(err => console.log(err));
  }

  pause() {
    this.notificator.all()
      .then(running_timers => {
        this.notificator.destroy();
        
        let now = Number((new Date()).getTime());
        let temporal_timer = [];

        running_timers.forEach(running_time => {
          let increment = Number(running_time.trigger.at) - now;

          if (increment > 0) {
            temporal_timer.push({
              increment: increment,
              data: running_time.data,
              text: running_time.text,
              title: running_time.title
            });
          }
        });

        this.storer.save(temporal_timer, 'temporal');
      })
      .catch(err => console.log(err));
  }

  stop() {
    this.notificator.destroy();
    this.storer.remove('temporal');
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
        seconds: w_seconds || 0,
        rest_or_work: 'work'
      },
      rest: {
        minutes: r_minutes || 0,
        seconds: r_seconds || 0,
        rest_or_work: 'rest'
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

  getRunning() {
    return this.notificator.all();
  }

  getTemporalTimer() {
    return this.storer.get('temporal');
  }

}
