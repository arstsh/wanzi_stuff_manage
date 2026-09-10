import { Router } from 'express';
import { itemController } from '../controllers/itemController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
const router = Router();
router.get('/', itemController.list);
router.get('/:id', itemController.getById);
router.get('/:id/logs', itemController.getLogs);
router.post('/', authenticate, requireAdmin, itemController.create);
router.put('/:id', authenticate, requireAdmin, itemController.update);
router.delete('/:id', authenticate, requireAdmin, itemController.delete);
router.post('/:id/stock', authenticate, requireAdmin, itemController.adjustStock);
export default router;
//# sourceMappingURL=itemRoutes.js.map