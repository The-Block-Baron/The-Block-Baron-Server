// import mongoose from 'mongoose';

// const Schema = mongoose.Schema;

// const ActivityTypes = ['create', 'improve', 'sabotage', 'deal'];
// const CompanyTypes = ['Agriculture', 'Livestock', 'Retail', 'Restaurants', 'Bars', 'ClothingBrands', 'Hotels', 'HealthCare', 'Mining', 'Nightclubs', 'Automobiles', 'Technology', 'Finance', 'RealEstate'];

// const economicActivitySchema = new Schema({
//     type: {
//         type: String,
//         enum: ActivityTypes,
//         required: true
//     },
//     companyType: {
//         type: String,
//         enum: CompanyTypes,
//         required: function() {
//             return this.type === 'create';  // Solo necesario si la actividad es de tipo 'create'
//         }
//     },
//     level: {
//         type: Number,
//         min: 1,
//         max: 5,
//         required: function() {
//             return this.type === 'improve';  // Solo necesario si la actividad es de tipo 'improve'
//         }
//     },
//     sabotageDetail: {
//         type: String,
//         required: function() {
//             return this.type === 'sabotage';  // Solo necesario si la actividad es de tipo 'sabotage'
//         }
//     },
//     dealDetail: {
//         type: String,
//         required: function() {
//             return this.type === 'deal';  // Solo necesario si la actividad es de tipo 'deal'
//         }
//     },
//     player: {
//         type: Schema.Types.ObjectId,
//         ref: 'Player',
//         required: true
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// });

// export const EconomicActivity = mongoose.model('EconomicActivity', economicActivitySchema);
