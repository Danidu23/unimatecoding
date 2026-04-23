const mongoose = require('mongoose');
const dotenv = require('dotenv');
const SportsBooking = require('../src/models/SportsBooking');

const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const updateToCompleted = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Find the most recent approved booking and mark it completed for testing
        const booking = await SportsBooking.findOne({ status: 'approved' }).sort({ createdAt: -1 });
        
        if (booking) {
            booking.status = 'completed';
            booking.attendanceStatus = 'completed';
            await booking.save();
            console.log(`Updated booking ${booking._id} to completed.`);
        } else {
            console.log('No approved bookings found to update.');
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

updateToCompleted();
