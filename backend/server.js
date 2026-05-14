const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB().then(() => {
  // Run seed data
  const seedData = require('./seed');
  seedData();
});

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    'https://volontyor-seven.vercel.app', 
    'https://buloqboshi-volontyor.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Route files
const auth = require('./routes/auth');
const volunteers = require('./routes/volunteers');
const events = require('./routes/events');
const attendance = require('./routes/attendance');
const statistics = require('./routes/statistics');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/volunteers', volunteers);
app.use('/api/events', events);
app.use('/api/attendance', attendance);
app.use('/api/statistics', statistics);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
