import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const economicActSchema = new Schema({
  type: {
    type: String,
    enum: ['create', 'improve', 'sabotage', 'deal'],
    required: true
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  targetCompany: {
    type: Schema.Types.ObjectId,
    ref: 'Company', // referencia al modelo de empresa
    required: true
  },
  sabotageTarget: {
    type: Schema.Types.ObjectId,
    ref: 'Player', // Este es el objetivo del sabotaje, sólo necesario si el tipo es 'sabotage'
  },
  improvementType: {
    type: String,
    enum: ['Type1', 'Type2', 'Type3', 'Type4', 'Type5'],
  },
  dealEffect: {
    type: Number, // un número entre -50 y 100
  },
  sabotageEffect: {
    type: Number, // un número entre 0 y -60
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const EconomicAct = mongoose.model('EconomicAct', economicActSchema);

export default EconomicAct;
