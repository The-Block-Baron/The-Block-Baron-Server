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
    enum: ['Agriculture', 'Mining', 'Manufacturing', 'Entertainment', 'Technology', 'Services', 'Finance', 'Retail', 'RealEstate', 'HealthCare'],
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  incomePerHour: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const Company = mongoose.model('Company', companySchema);

export default Company;
