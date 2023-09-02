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

// Hash the password before saving it to the database
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
