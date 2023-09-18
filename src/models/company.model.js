import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const companySchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  type: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 1
  },
  incomePerHour: {
    type: Number,
    required: true
  },
  buildCost: {
    type: Number,
    required: true
  },
  upgradeCost: {
    type: Array,
    required: true
  },
  buyingPrice: {
    type: Number, 
    required: true
  },
  buildTime: {
    type: Number, // Tiempo en minutos
    required: true
  },
  upgradeTime: {
    type: Array, // Tiempo en minutos
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  state: {  
    type: Schema.Types.ObjectId,
    ref: 'State'
  }
});

const Company = mongoose.model('Company', companySchema);

export default Company;
