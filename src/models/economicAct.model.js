import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const economicActSchema = new Schema({
  type: {
    type: String,
    enum: ['create', 'improve'],
    required: true
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  improvementType: {
    type: String,
    enum: ['Type1', 'Type2', 'Type3', 'Type4'],
  },
  state: {  
    type: Schema.Types.ObjectId,
    ref: 'State',
    required: function() { return this.type === 'create'; } 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const EconomicAct = mongoose.model('EconomicAct', economicActSchema);

export default EconomicAct;