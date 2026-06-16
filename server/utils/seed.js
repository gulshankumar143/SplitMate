import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  await User.deleteMany();
  await Category.deleteMany();

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@splitmate.app',
    password: 'Admin1234',
    role: 'admin',
    emailVerified: true
  });

  await Category.create([
    { name: 'Food', icon: 'utensils' },
    { name: 'Rent', icon: 'home' },
    { name: 'Travel', icon: 'map' },
    { name: 'Shopping', icon: 'shopping-bag' },
    { name: 'Groceries', icon: 'shopping-cart' },
    { name: 'Bills', icon: 'credit-card' }
  ]);

  console.log('Seed complete:', admin.email);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
