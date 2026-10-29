import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach((l) => {
  const [k, ...v] = l.trim().split('=');
  if (k) env[k.trim()] = v.join('=').trim();
});

const token = Buffer.from(env.JIRA_EMAIL + ':' + env.JIRA_API_TOKEN).toString('base64');
const auth = 'Basic ' + token;

const tickets = [
  {
    summary: '[DINCHARYA] Horizontal Solar Arc Engine & Planetary Rhythm UI (Purge Botanical Metaphor)',
    description: 'Steve Jobs Sparring Mandate: Purge all botanical tree/leaf gamification from Dincharya. Implement the 24-Hour Horizontal Solar Arc tracking planetary rhythm (Dawn Ignition, Solar Zenith, Golden Forge, Twilight, Sleep Sanctum) with kinetic completion seals and Tibetan resonant decay.'
  },
  {
    summary: '[SHIELD] The Witness Mirror: 7-Second Breath Pause, Sovereign Choice & 7-Minute Witness Bell',
    description: 'Steve Jobs Sparring Mandate: Replace punitive jailer app blocking with the Mirror of the Witness (Sakshi). 7-second breath pause with sparse koan ("You are entering the unconscious stream. Enter if you choose. But do not go in blind."), sovereign dual choice, subtle amber hairline, and resonant 7-minute Tibetan bell callback.'
  },
  {
    summary: '[SADHANA] The 33 Living Spine: Obsidian Liquid Light Architecture & Taptic Ascension',
    description: 'Steve Jobs Sparring Mandate: Transform Sadhana from medical diagram to pure obsidian column (#070807) with 33 warm amber vertebrae (#FF9500). 4 Energy Thresholds (Root 1-8, Solar 9-16, Heart 17-24, Witness 25-33) with ascending CoreHaptics pulses and permanent vertebra ignition.'
  },
  {
    summary: '[AI] Bodhidharma Telemetry Mirror: Objective Behavioral Signals & Three-Sentence Koan Engine',
    description: 'Steve Jobs Sparring Mandate: Purge conversational chatbot slop. Implement Bodhidharma telemetry mirror synthesizing real-time phone pickups and CoreMotion steps into sparse, penetrating 3-sentence koans anchored in timeless philosophical bedrock.'
  }
];

async function run() {
  for (const t of tickets) {
    const payload = {
      fields: {
        project: { key: 'DEV' },
        summary: t.summary,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: t.description }]
            }
          ]
        },
        issuetype: { name: 'Task' }
      }
    };

    const res = await fetch('https://shanivar.atlassian.net/rest/api/3/issue', {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log(`Created Jira ticket: ${data.key} (${res.status}) - ${t.summary}`);
  }
}

run().catch(console.error);
