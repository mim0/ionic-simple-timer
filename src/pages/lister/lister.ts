import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigurerPage } from '../configurer/configurer';
import { ViewerPage } from '../viewer/viewer';

import { TimerProvider } from '../../providers/timer/timer';

@Component({
  selector: 'page-lister',
  templateUrl: 'lister.html',
})
export class ListerPage {
  asyncList: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public timerProvider: TimerProvider
  ) {
  }

  ionViewWillEnter() {
    this.refresh();
    if (this.timerProvider.oninit) {
      this.timerProvider.oninit = false;

      this.timerProvider.getRunning()
        .then(running_timers => {
          this.timerProvider.setRunningList(running_timers);

          if (running_timers && running_timers.length > 0) {
            let id = this.timerProvider.getTimerID(running_timers[0]);
            
            this.timerProvider.findActiveTimer(id)
              .then(timer => {
                this.timerProvider.activeTimer = { timer_key: id, timer };
                if (running_timers && running_timers.length > 0) {
                  this.navCtrl.parent.select(0);
                }
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    }
  }

  activate(item) {
    this.timerProvider.activate(item);
    this.navCtrl.parent.select(0);
  }

  refresh() {
    this.asyncList = this.timerProvider.getAll();
  }

  config(item?) {
    this.navCtrl.push(ConfigurerPage, item);
  }

  create() {
    this.navCtrl.push(ConfigurerPage);
  }

  remove(timer_key) {
    this.timerProvider.remove(timer_key)
      .then(response => {
        this.refresh();
      })
      .catch(error => console.log(error));
  }

}
