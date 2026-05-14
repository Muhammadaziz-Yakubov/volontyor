const mongoose = require('mongoose');
const User = require('./models/User');
const Volunteer = require('./models/Volunteer');
const Event = require('./models/Event');

const seedData = async () => {
  try {
    // Check if admin already exists to avoid unnecessary clearing
    const adminExists = await User.findOne({ email: 'muhammadazizyaqubov2@gmail.com' });
    
    if (adminExists) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    console.log('Seeding data...');

    // Clear existing data (optional: you might want to keep this if you want a fresh start every time)
    // await User.deleteMany();
    // await Volunteer.deleteMany();
    // await Event.deleteMany();

    // Create Admin
    await User.create({
      name: 'Muhammadaziz Yakubov',
      email: 'muhammadazizyaqubov2@gmail.com',
      password: 'Azizbek0717',
    });
    console.log('Admin created');

    console.log('Seeding completed successfully');
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

module.exports = seedData;

