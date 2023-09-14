import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const companyDetailsSchema = new Schema({
  type: String,
  buildCost: Number,
  upgradeCost: [Number],
  buildTime: Number,
  upgradeTime: [Number],
  incomePerHour: [Number],
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
    incomeTax: {
      type: Number,
      default: 10 
    },
  },
  availableCompanies: [companyDetailsSchema],
  builtCompanies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }
  ],
  activeCrisis: {
    type: String,
    required: false,
  },
  activeProsperity: {
    type: String,
    required: false,
  },
  naturalDisasterOn: {
    type: Boolean,
    default: false,
  },
});

const State = mongoose.model('State', stateSchema);

export default State;
