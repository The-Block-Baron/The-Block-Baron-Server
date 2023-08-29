import mongoose from 'mongoose';

import { nftSchema } from './nft.model';

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
        match: [/.+@.+\..+/, 'Por favor ingrese una dirección de email válida']  // Validación simple de formato de email.
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
        ref: nftSchema
    }],
    avatar: {
        type: Schema.Types.ObjectId,
        ref: nftSchema  
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

playerSchemaSchema.index({ username: 1, walletAddress: 1, email: 1 });

const Player = mongoose.model('Player', playerSchema);
export default Player;


