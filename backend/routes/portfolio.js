import express from 'express';
import { protect } from '../middleware/auth.js';
import { getHoldings, addHolding, editHolding, deleteHolding } from '../controllers/portfolioController.js';

const router = express.Router();

router.use(protect);

router.get('/', getHoldings);
router.post('/', addHolding);
router.put('/:symbol', editHolding);
router.delete('/:symbol', deleteHolding);

export default router;