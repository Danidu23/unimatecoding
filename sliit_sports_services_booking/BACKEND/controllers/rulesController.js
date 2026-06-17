const GlobalRules = require('../models/GlobalRules');

// @desc    Get global config rules
// @route   GET /api/rules
// @access  Admin/Staff
const getRules = async (req, res) => {
    try {
        let rules = await GlobalRules.findOne();
        if (!rules) {
            rules = await GlobalRules.create({});
        }
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update global config rules
// @route   PUT /api/rules
// @access  Admin
const updateRules = async (req, res) => {
    try {
        let rules = await GlobalRules.findOne();
        if (!rules) {
            rules = new GlobalRules();
        }

        const { maxBookingsPerDay, sportsCancelHoursBefore, serviceCancelHoursBefore } = req.body;
        
        if (maxBookingsPerDay !== undefined) rules.maxBookingsPerDay = maxBookingsPerDay;
        if (sportsCancelHoursBefore !== undefined) rules.sportsCancelHoursBefore = sportsCancelHoursBefore;
        if (serviceCancelHoursBefore !== undefined) rules.serviceCancelHoursBefore = serviceCancelHoursBefore;

        const updatedRules = await rules.save();
        res.json(updatedRules);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getRules,
    updateRules
};
