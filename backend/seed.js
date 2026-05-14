const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Volunteer = require('./models/Volunteer');
const Event = require('./models/Event');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Volunteer.deleteMany();
    await Event.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Muhammadaziz Yakubov',
      email: 'muhammadazizyaqubov2@gmail.com',
      password: 'Azizbek0717',
    });
    console.log('Admin created');

    console.log('Seeding completed successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
