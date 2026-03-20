import { connectDB } from './config/db.js';
import { Admin } from './models/Admin.js';

const run = async () => {
  await connectDB();

  const email = 'admin@sd-fitness.com';

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const admin = await Admin.create({
    name: 'Super Admin',
    email,
    password: 'Admin@123',
  });

  console.log('Created admin:', admin.email);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
