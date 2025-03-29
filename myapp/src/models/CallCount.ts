import mongoose from "mongoose";

const CallCountSchema = new mongoose.Schema({
  count: { type: Number, required: true, default: 14 },
});

export default mongoose.models.CallCount || mongoose.model("callCount", CallCountSchema);
