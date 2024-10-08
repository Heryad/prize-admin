import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  methodName: String,
  paymentAmount: String,
  userID: String,
  paymentDate: String,
  userName: String,
  paymentStatus: String
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);