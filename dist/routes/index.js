import { Router } from 'express';
import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import itemRoutes from './itemRoutes.js';
const router = Router();
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/items', itemRoutes);
export { router as apiRoutes };
//# sourceMappingURL=index.js.map