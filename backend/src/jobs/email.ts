import { Worker, Queue } from 'bullmq';
import redis from '../config/redis-connection';
import type * as IORedis from 'ioredis';
import { sendEmail } from '../service/emailService';

class EmailWorker {
  private connection: IORedis.Redis | undefined | any;
  private queueName;
  public emailQueue;

  constructor() {
    this.connection = redis;
    this.queueName = 'email-process';
    this.emailQueue = new Queue(this.queueName, {
      connection: this.connection,
    });
  }

  public sendMail() {
    const emailWorker = new Worker(
      this.queueName,
      async (job) =>
        await sendEmail(job.data.senderName, job.data.link, job.data.email),
      { connection: this.connection }
    );

    emailWorker.on('completed', (job) => {
      console.log(`Email has been sent to the user for  ${job?.id}`);
    });

    emailWorker.on('failed', (job, error) => {
      console.log(job);
      console.log(
        `Error occured while sending email for ${job?.id} | error=${error}`
      );
    });
  }
}

export { EmailWorker };
