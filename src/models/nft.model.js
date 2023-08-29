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
            this.incomePerHour = 100;
            break;
        case 'Trainee':
            this.incomePerHour = 200;
            break;
        case 'Junior':
            this.incomePerHour = 400;
            break;
        case 'Associate':
            this.incomePerHour = 600;
            break;
        case 'Specialist':
            this.incomePerHour = 800;
            break;
        case 'Manager':
            this.incomePerHour = 1000;
            break;
        case 'Senior Manager':
            this.incomePerHour = 1200;
            break;
        case 'Director':
            this.incomePerHour = 1400;
            break;
        case 'Vice President':
            this.incomePerHour = 1600;
            break;
        case 'CEO':
            this.incomePerHour = 2000;
            break;
        default:
            break;
    }
    next();
});

export const NFT = mongoose.model('NFT', nftSchema);
