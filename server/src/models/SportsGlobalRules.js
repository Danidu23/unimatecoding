const mongoose = require('mongoose');

const globalRulesSchema = new mongoose.Schema({
    maxBookingsPerDay: { type: Number, default: 3 },
    sportsCancelHoursBefore: { type: Number, default: 2 },
    serviceCancelHoursBefore: { type: Number, default: 4 }
}, { timestamps: true });

module.exports =
    mongoose.models.SportsGlobalRules ||
    mongoose.model('SportsGlobalRules', globalRulesSchema);