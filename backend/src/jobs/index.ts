import { EmailWorker } from './email';

class WorkService {
  private emailWorker;
  constructor() {
    this.emailWorker = new EmailWorker();
  }

  public startAll() {
    this.emailWorker.sendMail();
  }

  public getQueues() {
    return {
      emailQueue: this.emailWorker.emailQueue,
    };
  }
}

export { WorkService };
