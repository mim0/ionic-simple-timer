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
    this.notificator.clearAll();
    return this.notificator.cancelAll();
  }

  continue(temporal_timer) {
    let now = Number((new Date()).getTime());

    for (let i = 0; i < temporal_timer.length; i++) {
      let time = temporal_timer[i].increment + now;

      temporal_timer[i].id = time;
      temporal_timer[i].trigger = { at: (new Date(time)).getTime() };
    }

    return this.notificator.schedule(temporal_timer);
  }

  create(activeTimer, start_at_round = 0, running_timer?) {
    let notifications = this.calculate(activeTimer.timer, start_at_round);

    if (running_timer) {
      let running = this.calculateRunning(running_timer, activeTimer.timer, start_at_round);

      running.forEach((rnoti, index) => {
        notifications.splice(index, 1, rnoti);
      });
    }

    this.notificator.schedule(notifications);
  }

  private calculateRunning(running_timer, activeTimer, start_at_round) {
    let notifications = [];

    let trigger_time = this.getTime((new Date()).getTime(), running_timer);
    if (activeTimer.rounds < start_at_round + 1) {
      notifications.push(this.buildNotification(activeTimer, start_at_round + 1, trigger_time, running_timer.rest_or_work));
    }

    if (!running_timer.isRest) {
      trigger_time = this.getTime(trigger_time, activeTimer.rest);
      notifications.push(this.buildNotification(activeTimer, start_at_round + 1, trigger_time, 'rest'));
    }

    console.log('calculate running');
    console.log(notifications);

    return notifications;
  }

  /**
  *
  * Ejemplo: "Rest 2: Mi primer timer"
  *
  */
  private buildNotification(timer, round, trigger_time_millis, rest_or_work) {
    let time = `${timer.work.minutes}:${timer.work.seconds}`;
    let text = 'Work';

    if (rest_or_work === 'rest') {
      time = `${timer.rest.minutes}:${timer.rest.seconds}`;
      text = 'Rest';
    }

    return {
      id: trigger_time_millis,
      title: `${time}`,
      text: `${time}`,
      // title: `${text} ${loop}: ${timer.name}`,
      // text: `${text} ${loop}: ${timer.name}`,
      trigger: { at: new Date(trigger_time_millis) },
      data: {
        id: timer.id,
        time: time,
        round: round,
        rest_or_work: rest_or_work
      }
    }
  }

  private calculate(timer, start_at_round) {
    let notifs = [];
    let start = (new Date()).getTime();

    for (let round = start_at_round + 1; round < timer.rounds + 1; round++) {
      let working_time = this.getTime(start, timer.work);
      notifs.push(this.buildNotification(timer, round, working_time, 'work'));

      let resting_time = this.getTime(working_time, timer.rest);
      notifs.push(this.buildNotification(timer, round, resting_time, 'rest'));

      start = resting_time;
    }

    return notifs;
  }

  private getTime(start, increment) {
    return start + ((increment.minutes * 60 + increment.seconds) * 1000);
  }

}
