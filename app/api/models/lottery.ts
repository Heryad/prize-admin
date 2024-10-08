import mongoose from 'mongoose';

const LotterySchema = new mongoose.Schema({
  itemName: String,
  itemPrice: String,
  itemDate: String,
  imagePath: String,
  drawRules: String,
  itemQuantity: String,
  itemSoldQuantity: String,
  itemCategory: String,
  lotteryStatus: String,
  lotteryWinner: String
});

export default mongoose.models.Lottery || mongoose.model('Lottery', LotterySchema);