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

  interval: any;

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

  ionViewWillLeave() {
    this.stopClock();
  }

  setRunningTimer() {
    if (this.timerProvider.temporalTimer) {
      this.running = this.timerProvider.temporalTimer.timer.work;
      this.paused = true;
    }

    this.timerProvider.getRunning()
      .then(lista => {
        console.log('LISTA ACTIVES', lista);

        this.round = 0;
        if (lista && lista.length > 0) {
          // TODO: Get running timer from the first expring notification
          this.round = this.timerProvider.activeTimer.rounds - lista.length;
        }
      })
      .catch(err => console.error(err));
  }

  percentLeft() {
    return 100;
  }

  pause() {
    this.paused = !this.paused;

    if (this.paused) {
      this.timerProvider.stop();
      this.saveRunningTimer();
      this.stopClock();

    } else {
      this.play();
    }
  }

  play() {
    this.paused = false;

    // TODO: Obtener estos valores a partir de la ejecución
    this.timerProvider.play(this.running, this.round);

    this.startClock();
  }

  startClock() {
    console.log(this.running);
    console.log(this.round);
    console.log(this.active);

    this.interval = setInterval(() => {
      this.running.seconds -= 1;
      if (this.running.seconds < 0) {
        this.running.seconds = 59;
        this.running.minutes -= 1;

        if (this.running.minutes < 0) {
          this.running.seconds = 0;
          this.running.minutes = 0;

          this.round += 1;

          // TODO: Cambiar a la siguiente ronda
          // this.stop();
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
    this.paused = true;
    this.stopClock();
    this.timerProvider.stop();
    this.setRunningTimer();
  }

  saveRunningTimer() {
    // TODO: Get round number
    // TODO: Get current round time left
    // TODO: Save active timer info
  }

  seeList() {
    this.navCtrl.parent.select(1);
  }

}
