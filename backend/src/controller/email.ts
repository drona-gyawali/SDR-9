import type { Response, Request } from 'express';
import { WorkService } from '../jobs';

export const SendLink = async (req: Request, res: Response) => {
  try {
    const { senderName, link, email } = req.body;
    const { emailQueue } = new WorkService().getQueues();
    await emailQueue.add('email-process', {
      senderName,
      link,
      email,
    });
    return res.status(200).json({
      sucess: '200',
      message: 'Email queued sucessfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: String(error),
    });
  }
};
