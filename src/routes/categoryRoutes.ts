import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', categoryController.list);
router.get('/:id', categoryController.getById);
router.post('/', authenticate, requireAdmin, categoryController.create);
router.put('/:id', authenticate, requireAdmin, categoryController.update);
router.delete('/:id', authenticate, requireAdmin, categoryController.delete);

export default router;
