const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Smart Attendance System...\n');

// Create required directories
const directories = [
  'data',
  'uploads',
  'uploads/group',
  'known_faces',
  'group_photos'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`✓ Directory exists: ${dir}`);
  }
});

// Create required data files
const dataFiles = [
  { path: 'data/students.json', content: '[]' },
  { path: 'data/attendance.json', content: '[]' }
];

dataFiles.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file.content);
    console.log(`✅ Created file: ${file.path}`);
  } else {
    console.log(`✓ File exists: ${file.path}`);
  }
});

console.log('\n✨ Setup complete! You can now start the server with: npm start');
