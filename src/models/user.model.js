import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    walletAddress: { 
        type: String, 
        unique: true, 
        required: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 8  // De nuevo, considera usar bcrypt para encriptar las contraseñas.
    },
    inGameTokens: {
        type: Number,
        default: 0
    },
    nfts: [{
        type: Schema.Types.ObjectId,
        ref: 'NFT'
    }],
    avatar: {
        type: Schema.Types.ObjectId,
        ref: 'NFT'  // Suponemos que el avatar es un tipo de NFT que el usuario posee.
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    transactions: [{
        type: Schema.Types.ObjectId, 
        ref: 'Transaction'
    }],
    economicActivities: [{
        type: Schema.Types.ObjectId,
        ref: 'EconomicActivity'
    }],
});

const User = mongoose.model('User', userSchema);
export default User;
