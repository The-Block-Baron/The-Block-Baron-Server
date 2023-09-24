import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sabotageSchema = new Schema({
  level: {
    type: Number,
    enum: [1, 2, 3, 4, 5], 
    required: true,
  },
  saboteur: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  targetCompany: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  sabotageCost: {
    type: [100, 200, 400, 800, 1600], // An array of sabotage costs indexed by sabotage level
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 8 * 60 * 60 * 1000, // 8 hours from creation
  }
});

const Sabotage = mongoose.model('Sabotage', sabotageSchema);

export default Sabotage;
