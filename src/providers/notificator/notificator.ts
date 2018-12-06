import { LocalNotifications } from '@ionic-native/local-notifications';
import { Injectable } from '@angular/core';

@Injectable()
export class NotificatorProvider {

  constructor(
    private notificator: LocalNotifications
  ) {

  }

  all() {
    return this.notificator.getAll();
  }

  destroy() {
    // Info: this clears the triggered notifications
    // this.notificator.clearAll();

    return this.notificator.cancelAll();
  }

  create(activeTimer, start_at_round = 0, running_timer?) {
    let notifications = this.calculate(activeTimer.timer, start_at_round);

    if (running_timer) {
      let running = this.calculateRunning(running_timer, activeTimer.timer, start_at_round);

      running.forEach((rnoti, index) => {
        notifications.splice(index, 1, rnoti);
      });
    }

    console.log(notifications);
    this.notificator.schedule(notifications);
  }

  private calculateRunning(running_timer, timer, start_at_round) {
    let notifications = [];

    let start = this.getTime((new Date()).getTime(), running_timer);
    notifications.push(this.build(timer, start_at_round + 1, start));

    if (!running_timer.isRest) {
        start = this.getTime(start, timer.rest);
        notifications.push(this.build(timer, start_at_round + 1, start));
    }

    console.log('calculate running');
    console.log(notifications);

    return notifications;
  }

  private build(timer, round, trigger_time_millis) {
    return {
      title: `Round ${round}: ${timer.name}`,
      text: `Round ${round}: ${timer.name}`,
      trigger: { at: new Date(trigger_time_millis) },
      data: { timer_id: timer.id }
    }
  }

  private calculate(timer, start_at_round) {
    let notifs = [];
    let start = (new Date()).getTime();

    for (let round = start_at_round + 1; round < timer.rounds + 1; round++) {
      let working_time = this.getTime(start, timer.work);
      notifs.push(this.build(timer, round, working_time));

      let resting_time = this.getTime(start, timer.rest);
      notifs.push(this.build(timer, round, resting_time));

      start = resting_time;
    }

    return notifs;
  }

  private getTime(start, increment) {
    return start + ((increment.minutes * 60 + increment.seconds) * 1000);
  }

}
