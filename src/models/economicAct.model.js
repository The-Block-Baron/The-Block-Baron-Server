import mongoose from 'mongoose';

import Company from './company.model.js';

const Schema = mongoose.Schema;

const economicActSchema = new Schema({
  type: {
    type: String,
    enum: ['create', 'improve', 'delete'],
    required: true
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company', // Referencia al nuevo modelo Company
    required: true
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
