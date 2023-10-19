import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    baseIncome: {
        type: Number,
        default: 200, 
        min: 0
    },
    companyIncome: {
        type: Number,
        default: 0,
        min: 0
    },
    inGameTokens: {
        type: Number,
        default: 0
    },
    Companies: [{
        type: Schema.Types.ObjectId,
        ref: 'Company'
    }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

playerSchema.virtual('totalIncome').get(function() {
    return this.baseIncome + this.companyIncome;
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
