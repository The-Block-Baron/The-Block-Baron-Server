import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const companyDetailsSchema = new Schema({
  type: String,
  buildCost: Number,
  upgradeCost: [Number],
  buildTime: [Number],
  upgradeTime: [Number],
  incomePerHour: [Number],
  buyingPrice: [Number],
  level: [Number],
  protectionPrices: [Schema.Types.Mixed],
  protectionLevel: [Number],
  protectionCost: [Schema.Types.Mixed],
  closeCost: Number
}, { _id: false });

const stateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  taxes: {
      type: Number,
      default: 10 
  },
  availableCompanies: [companyDetailsSchema],
  builtCompanies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }
  ],
  activeCrisis: {
    type: Boolean,
    default: false,
  },
  activeProsperity: {
    type: Boolean,
    default: false,
  },
  naturalDisasterOn: {
    type: Boolean,
    default: false,
  },
});

const State = mongoose.model('State', stateSchema);

export default State;
