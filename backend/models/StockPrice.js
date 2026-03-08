import mongoose from "mongoose";

const stockPriceSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: String,
  lastPrice: Number,
  open: Number,
  high: Number,
  low: Number,
  previousClose: Number,
  change: Number,
  changePercent: Number,
  sector: String,
  volume: Number,
  indexId: Number,
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("StockPrice", stockPriceSchema);
