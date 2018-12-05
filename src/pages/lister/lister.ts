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
  }

  activate(item) {
    console.log(item);
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

  // TODO: Delete this function
  mock() {
    return {
      list: [
        this.timerProvider.create("Estudiar", 10, 25, 0, 5, 0),
        this.timerProvider.create("Hacer Workout", 28, 0, 40, 0, 20),
        this.timerProvider.create("Trabajar de Lunes a Viernes", 8, 25, 0, 5, 0),
        this.timerProvider.create("Practicar piano", 2, 15, 0, 5, 0)
      ]
    }
  }

}
