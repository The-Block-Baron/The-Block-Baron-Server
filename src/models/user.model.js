import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const nftSchema = new Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    rarity: {
        type: String,
        enum: ['Intern', 'Trainee', 'Junior', 'Associate', 'Specialist', 'Manager', 'Senior Manager', 'Director', 'Vice President', 'CEO'],
        required: true
    },
    incomePerHour: {
        type: Number,
        required: true
    }
});

nftSchema.pre('save', function (next) {
    switch (this.rarity) {
        case 'Intern':
            this.incomePerHour = 500;
            break;
        case 'Trainee':
            this.incomePerHour = 1000;
            break;
        case 'Junior':
            this.incomePerHour = 1500;
            break;
        case 'Associate':
            this.incomePerHour = 2000;
            break;
        case 'Specialist':
            this.incomePerHour = 2500;
            break;
        case 'Manager':
            this.incomePerHour = 3000;
            break;
        case 'Senior Manager':
            this.incomePerHour = 3500;
            break;
        case 'Director':
            this.incomePerHour = 4000;
            break;
        case 'Vice President':
            this.incomePerHour = 4500;
            break;
        case 'CEO':
            this.incomePerHour = 5000;
            break;
        default:
            break;
    }
    next();
});

const NFT = mongoose.model('NFT', nftSchema);



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

userSchema.index({ username: 1, walletAddress: 1, email: 1 });

const User = mongoose.model('User', userSchema);
export default User;


