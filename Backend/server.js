const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');  // <-- import cors
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('🌟 Starting app...');

connectDB().then(() => {
  console.log('✅ DB Connected, starting server...');

  const app = express();

  // CORS configuration
  const corsOptions = {
    origin: 'http://localhost:5173', // your React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // if you use cookies/auth headers
  };

  app.use(cors(corsOptions)); // <-- Enable CORS with options here

  app.use(express.json());

  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.get('/', (req, res) => {
    res.send('🛍️ Welcome to Cratly');
  });

  app.use(notFound);
  app.use(errorHandler);

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  });

  // Socket.io connection
  io.on('connection', (socket) => {
    console.log('🔌 New client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  // Make io accessible in routes/controllers
  app.set('io', io);

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });

}).catch((err) => {
  console.error('❌ DB connection failed:', err);
  process.exit(1);
});
