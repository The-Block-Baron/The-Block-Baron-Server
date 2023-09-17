import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const playerSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
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

playerSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

playerSchema.index({ username: 1, email: 1 });

const Player = mongoose.model('Player', playerSchema);

export default Player;
