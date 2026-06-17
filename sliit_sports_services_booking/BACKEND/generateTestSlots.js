const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const FacilityService = require('./models/FacilityService');
const Slot = require('./models/Slot');
const { format, addDays } = require('date-fns');

dotenv.config();

const generateSlots = async () => {
    try {
        await connectDB();
        await Slot.deleteMany(); // Clear old slots
        const facilities = await FacilityService.find({ active: true });
        
        const today = new Date();
        const slotsToCreate = [];

        for (let i = 0; i <= 30; i++) {
            const date = addDays(today, i);
            const dateStr = format(date, 'yyyy-MM-dd');

            for (const fac of facilities) {
                // If it's Dr provider, maybe only weekdays, but we will simplify and generate for all days for test data
                const openParts = fac.operatingHours.open.split(':');
                const closeParts = fac.operatingHours.close.split(':');
                
                let currentMinutes = parseInt(openParts[0]) * 60 + parseInt(openParts[1]);
                const closeMinutes = parseInt(closeParts[0]) * 60 + parseInt(closeParts[1]);

                while (currentMinutes + fac.slotDurationMinutes <= closeMinutes) {
                    const nextMinutes = currentMinutes + fac.slotDurationMinutes;
                    
                    const startH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
                    const startM = (currentMinutes % 60).toString().padStart(2, '0');
                    const endH = Math.floor(nextMinutes / 60).toString().padStart(2, '0');
                    const endM = (nextMinutes % 60).toString().padStart(2, '0');

                    slotsToCreate.push({
                        facilityServiceId: fac._id,
                        date: dateStr,
                        startTime: `${startH}:${startM}`,
                        endTime: `${endH}:${endM}`,
                        capacity: fac.capacity,
                        booked: 0,
                        status: 'available'
                    });

                    currentMinutes = nextMinutes; // Move to next slot
                }
            }
        }

        await Slot.insertMany(slotsToCreate);
        console.log(`Successfully generated ${slotsToCreate.length} test slots for the next 30 days!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
generateSlots();
