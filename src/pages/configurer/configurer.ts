import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TimerProvider } from '../../providers/timer/timer';

@Component({
  selector: 'page-configurer',
  templateUrl: 'configurer.html',
})
export class ConfigurerPage {

  placeholder: string = '';
  timer: any;
  timer_key: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private timerProvider: TimerProvider
  ) {
  }

  saveEnabled() {
    return this.timerProvider.isValid(this.timer);
  }

  remove() {
    if (this.timer_key) {
        this.timerProvider.remove(this.timer_key)
          .then(response => {
            this.navCtrl.pop();
          })
          .catch(error => {
            console.log(error);
          })
    }
  }

  save() {
    if (this.timerProvider.isValid(this.timer)) {
      let timer = this.timerProvider.create(
        this.timer.name,
        Number(this.timer.work.minutes),
        Number(this.timer.work.seconds),
        Number(this.timer.rest.minutes),
        Number(this.timer.rest.seconds)
      );

      this.timerProvider.save(this.timer, this.timer_key)
        .then(response => {
          this.navCtrl.pop();
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  clear() {
    this.timer = this.timerProvider.create();
  }

  ionViewWillEnter() {
    this.hideTabs();
    this.timer = this.navParams.get('timer') || this.timerProvider.create();
    this.timer_key = this.navParams.get('timer_key');
  }

  ionViewDidLeave() {
    this.showTabs();
  }

  hideTabs() {
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.transform = 'translateY(56px)';
      });
    }
  }

  showTabs() {
    let tabs = document.querySelectorAll('.tabbar');
    if (tabs !== null) {
      Object.keys(tabs).map((key) => {
        tabs[key].style.transform = 'translateY(0)';
      });
    }
  }

}
