/**
 * One-time migration script: imports existing students.json into MongoDB Atlas
 * Run ONCE locally after setting your .env file:
 *   node migrate-to-mongo.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Student = require('./models/Student');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas');

  const studentsPath = path.join(__dirname, 'data', 'students.json');
  const students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

  console.log(`\nMigrating ${students.length} students...\n`);

  for (const s of students) {
    try {
      const exists = await Student.findOne({ usn: s.usn.toUpperCase() });
      if (exists) {
        console.log(`⚠️  Skipped (already exists): ${s.name} — ${s.usn}`);
        continue;
      }

      // NOTE: Images were stored as local filenames. After migration, 
      // re-upload images through the admin panel — old filenames won't work on Cloudinary.
      await Student.create({
        name: s.name,
        usn: s.usn,
        department: s.department,
        year: s.year,
        email: s.email,
        password: s.password || s.usn,
        images: [], // Images need to be re-uploaded via admin panel
      });

      console.log(`✅ Migrated: ${s.name} — ${s.usn}`);
    } catch (err) {
      console.error(`❌ Failed: ${s.name} — ${err.message}`);
    }
  }

  console.log('\n✨ Migration complete!');
  console.log('👉 Now re-upload face images for each student via the admin panel.');
  console.log('👉 Then run encode_faces.py to regenerate encodings.pkl');
  await mongoose.disconnect();
}

migrate().catch(console.error);
