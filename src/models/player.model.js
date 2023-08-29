import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';


import { NFT } from './nft.model';

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
        unique: true, 
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {
                return isEmail(value);
            },
            message: 'Por favor ingrese una dirección de email válida'
        }
    }
    ,
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
        ref: "NFT"
    }],
    avatar: {
        type: Schema.Types.ObjectId,
        ref: "NFT"  
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

playerSchema.index({ username: 1, walletAddress: 1, email: 1 });

const Player = mongoose.model('Player', playerSchema);
export default Player;


