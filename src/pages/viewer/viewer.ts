import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TimerProvider } from '../../providers/timer/timer';

@Component({
  selector: 'page-viewer',
  templateUrl: 'viewer.html',
})
export class ViewerPage {

  paused = false;

  round = 0;
  rounds = [];

  active: any;
  running: any;

  ongoing: boolean;

  interval: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private timerProvider: TimerProvider
  ) {
    this.ongoing = false;
  }

  getViewRounds(rounds) {
    return Array(Number(rounds)).fill(rounds);
  }

  ionViewWillEnter() {
    this.getViewerData();
  }

  ionViewWillLeave() {
    this.timerProvider.getActiveTimer();
    this.stopClock();
  }

  getViewerData() {
    this.stopClock();
    this.setStartTimer();

    let running_timers = this.timerProvider.running_timer_list;

    if (running_timers && running_timers.length > 0) {
      this.getViewerDataFromRunning(running_timers);
    } else {
      this.getViewerDataFromTemporal();
    }
  }

  getViewerDataFromRunning(running_timers) {
    this.active = this.timerProvider.activeTimer;

    this.getViewRounds(running_timers.length);
    this.ongoing = true;

    let now = Number((new Date()).getTime());

    let closest: any = { trigger: { at: null } };
    let diff_time = 0;

    for (let i = 0; i < running_timers.length; i++) {
      let rtm = Number(running_timers[i].trigger.at);

      if (!closest.trigger.at) {
        closest = running_timers[i];
        diff_time = rtm - now;

      } else {
        if (rtm >= now) {
          if (Number(closest.trigger.at) > rtm || Number(closest.trigger.at) < now) {
            diff_time = rtm - now;
            closest = running_timers[i];
          }
        }
      }
    }

    if (diff_time > 0 && closest.data) {
      this.paused = false;
      this.setRunningTimer(diff_time, JSON.parse(closest.data).rest_or_work);

    } else {
      this.reset();
    }
  }

  getViewerDataFromTemporal() {
    this.timerProvider.getTemporalTimer()
      .then(temporal_timer => {
        if (temporal_timer && temporal_timer.length > 0) {
          let diff_time = 0;
          let rest_or_work = '';

          for (let i = 0; i < temporal_timer.length; i++) {
            let inc = temporal_timer[i].increment;
            diff_time = (diff_time === 0 || diff_time > inc) ? inc : diff_time;
            rest_or_work = JSON.parse(temporal_timer[i].data).rest_or_work;
          }

          let seconds = diff_time / 1000;
          let minutes = Math.floor(seconds / 60);

          setTimeout(() => {
            this.running = {
              minutes: minutes,
              seconds: Math.floor(seconds - (minutes * 60)),
              rest_or_work: rest_or_work
            };
          }, 0);
        } else {
          this.reset();
        }
      })
      .catch(err => {
        console.log(err);
        this.reset();
      });
  }

  reset() {
    this.timerProvider.stop();
    this.stopClock();

    setTimeout(() => {
      this.ongoing = false;
      this.paused = true;
      this.round = 0;

      this.setStartTimer();

      if (this.active && this.active.timer) {
        this.running = this.active.timer.work;
        this.getViewRounds(this.active.timer.rounds);
      }
    }, 0);
  }

  setStartTimer() {
    if (this.timerProvider.activeTimer) {
      this.active = JSON.parse(JSON.stringify(this.timerProvider.activeTimer));
    }
  }

  setRunningTimer(diff_time?, rest_or_work?) {
    console.log('setRunningTimer', { diff_time, rest_or_work })
    if (!diff_time) {
      this.reset();

    } else {
      this.paused = false;

      let segundos = diff_time / 1000;
      let minutos = Math.floor(segundos / 60);

      setTimeout(() => {
        this.running = {
          minutes: minutos,
          seconds: Math.floor(segundos - (minutos * 60)),
          rest_or_work: rest_or_work
        };
        this.startClock();
      }, 0);
    }
  }

  percentLeft() {
    return 100;
  }

  pause() {
    this.paused = !this.paused;

    if (this.paused) {
      this.saveRunningTimer();
      this.stopClock();

    } else {
      this.play();
    }
  }

  play() {
    this.paused = false;

    if (this.ongoing) {
      // TODO: Activar temporal timer
      this.timerProvider.continue();

    } else {
      this.ongoing = true;
      this.timerProvider.play();
    }

    this.startClock();
  }

  startClock() {
    this.interval = setInterval(() => {
      this.running.seconds -= 1;
      if (this.running.seconds < 0) {
        this.running.seconds = 59;
        this.running.minutes -= 1;

        if (this.running.minutes < 0) {
          this.running.seconds = 0;
          this.running.minutes = 0;

          this.round += 1;

          this.getViewerData();
        }
      }
    }, 1000);
  }

  stopClock() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  stop() {
    this.timerProvider.stop();
    this.reset();
  }

  saveRunningTimer() {
    this.timerProvider.pause();
  }

  seeList() {
    this.navCtrl.parent.select(1);
  }

}
