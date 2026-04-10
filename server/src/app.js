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

module.exports = app;