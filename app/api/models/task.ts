import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  taskName: String,
  taskReward: String,
  taskType: String,
  imagePath: String,
  taskURL: String
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);