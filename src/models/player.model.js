import mongoose from 'mongoose';

import Company from './company.model.js';

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    income: {
        type: Number,
        default: 200, 
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
});

playerSchema.index({ username: 1 });

const Player = mongoose.model('Player', playerSchema);
export default Player;
