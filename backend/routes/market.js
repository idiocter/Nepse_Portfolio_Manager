import express from 'express';
import { 
  getMarketStatus, 
  getTopGainers, 
  getTopLosers, 
  getStockDetails,
  getStockHistory,
  getAllStocks
} from '../controllers/marketController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/status', getMarketStatus);
router.get('/gainers', getTopGainers);
router.get('/losers', getTopLosers);
router.get('/stocks', getAllStocks);
router.get('/stock/:symbol', protect, getStockDetails);
router.get('/history/:symbol', protect, getStockHistory);

export default router;