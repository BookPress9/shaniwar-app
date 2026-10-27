const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../shanivar/site/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// Update title and meta
html = html.replace(
  '<title>SHANIVAR — The art of returning</title>',
  '<title>SHANIWAR — The art of returning | By The Hybrid Monk</title>'
);

// Add Pricing section right before <section id="faq">
if (!html.includes('id="pricing"')) {
  const pricingSection = `
<section class="practice divider" id="pricing"><div class="wrap"><div class="section-head"><div class="eyebrow">04 / THE MONK PASS</div><h2 class="serif" style="font-size:clamp(44px,6vw,74px);line-height:1.05;margin:14px 0">Conscious discipline,<br>unlocked.</h2><p style="color:#9ca395;max-width:580px">Choose how you walk the path. Individual mastery, couple accountability, or protecting the whole household.</p></div><div class="path" style="margin-top:40px"><div class="path-card" style="background:#131812;border:1px solid #333d31;color:#f0ede4"><b style="color:#b89860">SOLITARY MONK</b><h3 style="color:#f0ede4;margin:15px 0 5px">$9.99 <span style="font-size:14px;color:#878e81">/ mo</span></h3><div style="font-size:11px;color:#d4e5b3;margin-bottom:15px">Or $59.99 / year ($4.99/mo · 50% savings)</div><p style="color:#b2b7ac;font-size:13px">• Uncompromising Wake Alarm with Walk Verification<br>• Obsidian Focus Shield & Instagram Intercept<br>• Sacred Naam Japa Heartbeat Haptics<br>• Calibrated Living Dincharya Arc</p><a class="btn solid" href="#early-access" style="margin-top:20px;width:100%;text-align:center">Start 7-Day Free Trial</a></div><div class="path-card" style="background:#1a2118;border:2px solid #b89860;color:#f0ede4;position:relative"><div style="position:absolute;top:-12px;right:20px;background:#b89860;color:#0b0e0b;font-size:9px;font-weight:800;letter-spacing:.1em;padding:4px 8px;border-radius:4px">MOST POPULAR</div><b style="color:#b89860">DUO MONKS (COUPLES)</b><h3 style="color:#f0ede4;margin:15px 0 5px">$14.99 <span style="font-size:14px;color:#878e81">/ mo</span></h3><div style="font-size:11px;color:#d4e5b3;margin-bottom:15px">Or $89.99 / year ($3.75/mo per person)</div><p style="color:#b2b7ac;font-size:13px">• Everything in Solitary Monk for 2 accounts<br>• Mutual Bedtime Lockout (no late-night phones in bed)<br>• Partner Wake Notification & Shared Morning Flame<br>• Joint Sacred Practice Check-in</p><a class="btn solid" href="#early-access" style="margin-top:20px;width:100%;text-align:center">Start 7-Day Free Trial</a></div><div class="path-card" style="background:#131812;border:1px solid #333d31;color:#f0ede4"><b style="color:#b89860">HOUSEHOLD MONASTERY</b><h3 style="color:#f0ede4;margin:15px 0 5px">$19.99 <span style="font-size:14px;color:#878e81">/ mo</span></h3><div style="font-size:11px;color:#d4e5b3;margin-bottom:15px">Or $119.99 / year ($2.00/mo per person)</div><p style="color:#b2b7ac;font-size:13px">• Up to 5 Family / Household Member Accounts<br>• Dinner Table Sanctuary (synchronized focus mode)<br>• Teen Study Shield & Mindful Screen Windows<br>• Family Sovereignty Leaderboard & Milestones</p><a class="btn solid" href="#early-access" style="margin-top:20px;width:100%;text-align:center">Start 7-Day Free Trial</a></div></div></div></section>
`;

  html = html.replace('<section id="faq">', pricingSection + '<section id="faq">');
}

// Update FAQ question 05
html = html.replace(
  '<details><summary>Which devices are planned?</summary><p>The responsive web app supports current desktop and mobile browsers. Android is the first native app; iOS remains in development.</p></details>',
  '<details><summary>Which devices are supported?</summary><p>Shaniwar is built natively for iOS and Android using React Native & Expo. The web app serves as the sovereign companion dashboard.</p></details>'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Site successfully updated with Monk Pass pricing and multi-platform support!');
