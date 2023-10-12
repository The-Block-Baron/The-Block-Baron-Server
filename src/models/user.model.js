import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        minlength: 42,
        maxlength: 42
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    }
});

userSchema.index({ username: 1, walletAddress: 1, email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
