const fs = require('fs');
const path = require('path');

console.log('🔄 Resetting Smart Attendance System Data...\n');

// Reset JSON files
const dataFiles = [
  { path: 'data/students.json', content: '[]' },
  { path: 'data/attendance.json', content: '[]' }
];

dataFiles.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  fs.writeFileSync(filePath, file.content);
  console.log(`✅ Reset: ${file.path}`);
});

// Delete encodings file
const encodingsPath = path.join(__dirname, 'python/encodings.pkl');
if (fs.existsSync(encodingsPath)) {
  fs.unlinkSync(encodingsPath);
  console.log('✅ Deleted: python/encodings.pkl');
}

// Clear uploads folder (keep the folder structure)
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  const files = fs.readdirSync(uploadsDir);
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile()) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: uploads/${file}`);
    }
  });
}

// Clear group photos folder
const groupDir = path.join(__dirname, 'uploads/group');
if (fs.existsSync(groupDir)) {
  const files = fs.readdirSync(groupDir);
  files.forEach(file => {
    const filePath = path.join(groupDir, file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: uploads/group/${file}`);
    }
  });
}

console.log('\n✨ Data reset complete!');
console.log('📝 You can now add fresh student data through the admin panel.');
