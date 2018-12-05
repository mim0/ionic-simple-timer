import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TimerProvider } from '../../providers/timer/timer';

@Component({
  selector: 'page-viewer',
  templateUrl: 'viewer.html',
})
export class ViewerPage {

  paused = false;

  rounds = [];

  active: any;
  running: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private timerProvider: TimerProvider
  ) {
  }

  /**

    Hay tres tipos de timer en esta vista:
      1. Activo: original almacenado.
      2. Temporal: información de los rounds restantes
      3. Running: round en marcha si hay alguno

    Hasta ahora hemos trabajado con los timers almacenados en memoria.

    Ahora tenemos que trabajar con los timers activados, por lo tanto cada timer
    es en realidad una lista de notificaciones que se crean cuando el timer se
    activa y se borran cuando el timer se para.

    El timer temporal necesita almacenar información sobre los rounds restantes
    y sobre el round inicial, ya que este podría estar definido por una cantidad
    distinta de tiempo.

  **/

  getViewRounds(rounds) {
    return Array(Number(rounds)).fill(rounds);
  }

  ionViewWillEnter() {
    this.active = this.timerProvider.activeTimer;
    this.setRunningTimer();
    if (this.active && this.active.timer) {
      this.rounds = this.getViewRounds(this.active.timer.rounds);
    }
  }

  setRunningTimer() {
    console.log(this.active);
    // TODO: Get running timer from the first expring notification
    if (this.timerProvider.temporalTimer) {
      this.running = this.timerProvider.temporalTimer.timer.work;
    }
  }

  percentLeft() {
    return 100;
  }

  pause() {
    this.paused = !this.paused;
  }

  play() {
    this.paused = false;

    // TODO: Starts timer
  }

  stop() {
    this.paused = false;
  }

  seeList() {
    this.navCtrl.parent.select(1);
  }

}
