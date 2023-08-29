import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const stateSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  president: {
    npcName: {
      type: String,
      required: true
    },
    personality: {
      type: String,
      enum: ['Aggressive', 'Passive', 'Neutral', 'Charismatic', 'Manipulative'],
      required: true
    }
  },
  taxRate: {
    type: Number,
    required: true,
    default: 0.1
  },
  companies: [{
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }],
  playerCompanies: [{
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player'
    },
    companies: [{
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }]
  }],
});

const State = mongoose.model('State', stateSchema);

export default State;
