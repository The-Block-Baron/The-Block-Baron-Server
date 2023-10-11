import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        minlength: 42,
        maxlength: 42
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
    isActive: {
        type: Boolean,
        default: true
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

playerSchema.index({ username: 1, walletAddress: 1 });

const Player = mongoose.model('Player', playerSchema);

export default Player;
