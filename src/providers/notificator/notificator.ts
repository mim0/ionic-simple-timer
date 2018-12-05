import { LocalNotifications } from '@ionic-native/local-notifications';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificatorProvider {

  constructor(
    private notificator: LocalNotifications
  ) {

  }

  destroy() {
    // Info: this clears the triggered notifications
    // this.notificator.clearAll();

    return this.notificator.cancelAll();
  }

  create(timer, start_at_round = 0, running_timer?) {
    let notifications = this.calculate(timer, start_at_round);

    if (running_timer) {
      let running = this.calculateRunning(running_timer, timer, start_at_round);

      running.forEach((rnoti, index) => {
        notifications.splice(index, 1, rnoti);
      });
    }

    this.notificator.schedule(notifications);
  }

  private calculateRunning(running_timer, timer, start_at_round) {
    let notifications = [];

    let start = this.getTime((new Date()).getTime(), running_timer);
    notifications.push(this.getBody(timer.name, start_at_round + 1, start));

    if (!running_timer.isRest) {
        start = this.getTime(start, timer.rest);
        notifications.push(this.getBody(timer.name, start_at_round + 1, start));
    }

    return notifications;
  }

  private getBody(name, round, trigger_time_millis) {
    return {
      title: `Round ${round}: ${name}`,
      text: `Round ${round}: ${name}`,
      trigger: { at: new Date(trigger_time_millis) }
    }
  }

  private calculate(timer, start_at_round) {
    let notifs = [];
    let start = (new Date()).getTime();

    for (let round = start_at_round + 1; round < timer.rounds + 1; round++) {
      let working_time = this.getTime(start, timer.work);
      notifs.push(this.getBody(timer.name, round, working_time));

      let resting_time = this.getTime(start, timer.rest);
      notifs.push(this.getBody(timer.name, round, resting_time));

      start = resting_time;
    }

    return notifs;
  }

  private getTime(start, increment) {
    return start + ((increment.minutes * 60 + increment.seconds) * 1000);
  }

}
