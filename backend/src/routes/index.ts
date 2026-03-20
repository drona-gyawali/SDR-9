import { Router } from 'express';
import { SendLink } from '../controller/email';
import { health } from '../controller/health';
const router = Router();

router.post('/send/email', SendLink);
router.get('/health', health);

export default router;
