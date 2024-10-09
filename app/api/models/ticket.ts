import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  itemID: String,
  itemName: String,
  itemImage: String,
  itemPrice: String,
  ticketQty: String,
  ticketStatus: String,
  ticketResult: String,
  purchaseDate: String,
  lotteryDate: String,
  userName: String,
  userID: String
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);