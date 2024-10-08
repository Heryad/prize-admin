import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  nameEN: String,
  nameTR: String,
  imagePath: String,
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);