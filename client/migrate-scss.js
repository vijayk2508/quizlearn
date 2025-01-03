const { exec } = require('child_process');
const glob = require('glob');
const path = require('path');

// Define the directory to search for SCSS files
const scssDirectory = path.join(__dirname, 'src', 'scss', './');

// Use glob to find all SCSS files in the directory
glob(`${scssDirectory}/**/*.scss`, (err, files) => {
  if (err) {
    console.error('Error finding SCSS files:', err);
    return;
  }

  // Loop through each file and run the sass-migrator command
  files.forEach(file => {
    const command = `sass-migrator module --migrate-deps ${file}`;
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error migrating ${file}:`, err);
        return;
      }
      console.log(`Migrated ${file} successfully.`);
      console.log(stdout);
      console.error(stderr);
    });
  });
});