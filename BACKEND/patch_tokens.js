const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const Booking = require('./models/Booking');
  const bookings = await Booking.find({ qrCodeToken: { $exists: false } });
  let count = 0;
  for (let b of bookings) {
    b.qrCodeToken = crypto.randomBytes(16).toString('hex');
    await b.save();
    count++;
  }
  console.log(`Updated ${count} bookings with new QR tokens`);
  process.exit();
}).catch(console.error);
