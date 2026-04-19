const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const lostFoundItemRoutes = require('./routes/lostFoundItemRoutes');
const lostFoundClaimRoutes = require('./routes/lostFoundClaimRoutes');
const lostFoundMessageRoutes = require('./routes/lostFoundMessageRoutes');
const lostFoundAdminRoutes = require('./routes/lostFoundAdminRoutes');

const sportsFacilityRoutes = require('./routes/sportsFacilityRoutes');
const sportsSlotRoutes = require('./routes/sportsSlotRoutes');
const sportsBookingRoutes = require('./routes/sportsBookingRoutes');
const sportsNotificationRoutes = require('./routes/sportsNotificationRoutes');
const sportsReportRoutes = require('./routes/sportsReportRoutes');
const sportsRulesRoutes = require('./routes/sportsRulesRoutes');
const sportsSmartRoutes = require('./routes/sportsSmartRoutes');

const clubsRoutes = require('./routes/clubsRoutes');
const clubApplicationRoutes = require('./routes/clubApplicationRoutes');
const clubRecommendationRoutes = require('./routes/clubRecommendationRoutes');
const clubAdminRoutes = require('./routes/clubAdminRoutes');

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UniMate backend is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.use('/api/lost-found/items', lostFoundItemRoutes);
app.use('/api/lost-found/claims', lostFoundClaimRoutes);
app.use('/api/lost-found/conversations', lostFoundMessageRoutes);
app.use('/api/lost-found/admin', lostFoundAdminRoutes);

app.use('/api/sports/facilities', sportsFacilityRoutes);
app.use('/api/sports/slots', sportsSlotRoutes);
app.use('/api/sports/bookings', sportsBookingRoutes);
app.use('/api/sports/notifications', sportsNotificationRoutes);
app.use('/api/sports/reports', sportsReportRoutes);
app.use('/api/sports/rules', sportsRulesRoutes);
app.use('/api/sports/smart', sportsSmartRoutes);

app.use('/api/clubs', clubsRoutes);
app.use('/api/clubs/applications', clubApplicationRoutes);
app.use('/api/clubs/recommendations', clubRecommendationRoutes);
app.use('/api/clubs/admin', clubAdminRoutes);

module.exports = app;