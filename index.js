const axios = require('axios');
const notifier = require('node-notifier');
const play = require('play-sound')(opts = {});
const path = require('path');

// Function to check connectivity to both Google and Globo
async function checkConnectivity() {
  const dateLog = new Date()
  try {
    await axios.get('https://www.google.com');
    console.log(`${dateLog} - Connected to Google`);
  } catch (googleError) {
    console.error(`${dateLog} - Cannot connect to Google:`, googleError.message);

    // If Google fails, try Globo
    try {
      await axios.get('https://www.globo.com');
      console.log(`${dateLog} - Connected to Globo`);
    } catch (globoError) {
      console.error(`${dateLog} - Cannot connect to Globo:`, globoError.message);

      // If both Google and Globo fail, emit an alert
      emitAlert();
    }
  }
}

// Emit sound and notification function
function emitAlert() {
  // Play a sound alert
  const alertSound = path.join(__dirname, 'aviso.wav'); // Ensure you have an mp3 sound file
  play.play(alertSound, function(err) {
    if (err) {
      console.error('Error playing sound:', err);
    }
  });

  // Display a desktop notification
  notifier.notify({
    title: 'Connection Error',
    message: 'Cannot connect to both Google and Globo!',
    sound: true, // Optional, depending on OS settings
  });
}


// Set an interval to check every 3 minutes
setInterval(checkConnectivity, 3 * 60 * 1000);

// Initial check
checkConnectivity();
