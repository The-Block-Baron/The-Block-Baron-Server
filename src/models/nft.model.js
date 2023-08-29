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

export const NFT = mongoose.model('NFT', nftSchema);
