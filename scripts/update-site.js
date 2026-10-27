const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../shanivar/site/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Replace Naam Japa in pricing card
html = html.replace(
  '• Sacred Naam Japa Heartbeat Haptics<br>',
  '• Conscious Focus Shield & Mindful Breath Intercept<br>'
);

// Replace Naam Japa in FAQ
html = html.replace(
  'Mindless tapping is halted immediately with the Sacred Heartbeat haptic and Naam Japa inquiry.',
  'Mindless tapping is halted immediately with a conscious breath pause and focus inquiry.'
);

// Replace Naam Japa in hero whisper
html = html.replace(
  '<div class="whisper">Wake Alarm • Focus Shield • Sacred Haptic Anchor</div>',
  '<div class="whisper">Wake Alarm • Focus Shield • Living Dincharya Arc</div>'
);

// Replace in meta description
html = html.replace(
  'Sacred Haptic Anchor, and daily routine.',
  'and Living Dincharya daily routine.'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Site updated: Naam Japa decoupled from V1 web landing page!');
