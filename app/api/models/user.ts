import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    telegramID: String,
    userName: String,
    userEmail: String,
    userPhone: String,
    registerDate: String,
    userBalance: String,
    invitedBy: String
});

export default mongoose.models.User || mongoose.model('User', UserSchema);