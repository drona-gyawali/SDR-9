import redis from '../config/redis-connection';
import { Response, Request } from 'express';

export const health = async (req: Request, res: Response) => {
  try {
    const isRedisUp = (await redis?.ping()) === 'PONG';

    return res.status(200).json({
      success: true,
      status: {
        redis: isRedisUp ? 'up' : 'down',
        system: 'up',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      status: {
        redis: 'error',
        system: 'down',
      },
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};
