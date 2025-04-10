/***
 *  Implement an analytics sdk that exposes log events, it takes
 *  in events and queues them, and then starting sending events
 *
 * **** should adhere the following properties ***
 *
 *   ** Send each event after a delay of 1 second and this logging fails
 *      every n%5 times
 *   ** send the next event only after the previous one resolves
 *   **  when the failure occur attempt a retry
 *
 */

class SDK {
  constructor() {
    //holds the queue
    this.queue = [];

    // track count
    this.count = 1;
  }

  logEvent(ev) {
    this.queue.push(ev);
  }

  wait() {
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.count % 5 === 0) {
          reject();
        } else {
          resolve();
        }
      }, 1000);
    });
  }

  async sendAnalytics() {
    //if there is no events in queue stop sending
    if (this.queue.length === 0) {
      return;
    }

    const current = this.queue.unshift();
    try {
      await this.wait();

      console.log("Analytics sent" + current);
      this.count++;
    } catch (e) {
      console.log("_ _ _ _ _ _ _ ");
      console.log("Failed to send" + current);
      console.log("Retrying sending" + current);

      this.count = 1;
      this.queue.unshift(current);
    } finally {
      this.sendAnalytics();
    }
  }

  send = async function () {
    this.sendAnalytics();
  };
}
