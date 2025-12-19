import { Router } from 'express';
import { SendLink } from '../controller/email';

const router = Router();

router.post('/send/email', SendLink);

export default router;
