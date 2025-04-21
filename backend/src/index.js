
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectMongo, testPrismaConnection } = require('./config/db');


dotenv.config();


connectMongo();
testPrismaConnection();

const app = express();

app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(cors());


const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


app.get('/', (req, res) => {
  res.send('Digital Diner API is running');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});