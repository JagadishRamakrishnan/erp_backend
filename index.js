import dotenv from 'dotenv';

// Load environment variables FIRST before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import db from './src/db/index.js';
import routes from './src/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', routes);

// Health check
app.get('/', (_req, res) => {
  res.json({ message: 'CRM Backend API is running' });
});

// Load model associations
await import('./src/models/associations.js');

// Import User model for default user creation
import User from './src/user/models/user.model.js';

// Database sync and server start
db.sequelize.sync()
  .then(async () => {
    console.log('Database connected successfully');

    // Create default user if no users exist
    try {
      const userCount = await User.count();

      if (userCount === 0) {
        console.log('No users found. Creating default "Atelier" user...');

        // Password will be automatically hashed by User model's beforeCreate hook
        await User.create({
          name: 'Atelier',
          email: 'atelier@gmail.com',
          password: '12345678',
          phone: '9876543210',
          role: 'Admin',
          status: true
        });

        console.log('✅ Default user "Atelier" created successfully!');
        console.log('📧 Email: atelier@gmail.com');
        console.log('🔑 Password: 12345678');
      } else {
        console.log(`Users table already has ${userCount} user(s).`);
      }
    } catch (error) {
      console.error('Error creating default user:', error.message);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
  });
