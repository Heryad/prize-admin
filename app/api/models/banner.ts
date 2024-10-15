import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  imagePath: String,
});

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);