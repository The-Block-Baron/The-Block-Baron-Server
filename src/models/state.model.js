import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const stateSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  taxes: {
    incomeTax: {
      type: Number,
      default: 10 
    },
  },
  companies: [{
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }],

});

const State = mongoose.model('State', stateSchema);

export default State;
