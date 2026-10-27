#!/usr/bin/env node
/**
 * Shaniwar by The Hybrid Monk - Jira Cloud Synchronizer
 * Connects to https://shanivar.atlassian.net (Project: DEV)
 * 
 * Usage:
 *   node scripts/jira-sync.mjs audit
 *   node scripts/jira-sync.mjs create-ticket "Title" "Description"
 *   node scripts/jira-sync.mjs sprint-plan
 * 
 * Environment variables:
 *   JIRA_HOST (default: https://shanivar.atlassian.net)
 *   JIRA_EMAIL (your Atlassian email)
 *   JIRA_API_TOKEN (generated at https://id.atlassian.com/manage-profile/security/api-tokens)
 *   JIRA_PROJECT_KEY (default: DEV)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading .env if present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  });
}

const JIRA_HOST = process.env.JIRA_HOST || 'https://shanivar.atlassian.net';
const JIRA_EMAIL = process.env.JIRA_EMAIL || '';
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN || '';
const JIRA_PROJECT_KEY = process.env.JIRA_PROJECT_KEY || 'DEV';

function getAuthHeader() {
  if (!JIRA_EMAIL || !JIRA_API_TOKEN) {
    return null;
  }
  const token = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  return `Basic ${token}`;
}

// Offline / Local Sprint & Roadmap Cache based on repo analysis & founder direction
const LOCAL_ROADMAP = {
  sprint1_v1_mvp: [
    {
      id: 'DEV-V1-01',
      title: 'Wake Ignition & Walk Verification',
      status: 'READY_IN_CODE',
      scope: 'CoreMotion step verification, zero-snooze alarm engine, ambulatory confirmation before dismissal.',
      component: 'Dincharya / Alarm',
    },
    {
      id: 'DEV-V1-02',
      title: 'Obsidian Focus Shield & iOS Shortcuts Intercept',
      status: 'READY_IN_CODE',
      scope: 'Intercept mindless app opens (Instagram/TikTok), redirect to shaniwar://shield with conscious 10s breathing gate.',
      component: 'Dincharya / Shield',
    },
    {
      id: 'DEV-V1-03',
      title: 'Living Dincharya Arc & 4 Life Archetypes',
      status: 'READY_IN_CODE',
      scope: 'Dynamic 24h timeline adapting to Builder, Student, Parent, and Modern Householder rhythms with live clock detection.',
      component: 'Dincharya / Timeline',
    },
    {
      id: 'DEV-V1-04',
      title: 'Sacred Naam Japa Anchor & Double-Thump Haptics',
      status: 'READY_IN_CODE',
      scope: 'Customizable sacred chant, 108 Mala counter, and distinct tactile heartbeat haptics on every notification.',
      component: 'Anchor / Haptics',
    },
    {
      id: 'DEV-V1-05',
      title: 'Monk Pass Billing Engine (Solitary, Duo, Family)',
      status: 'READY_IN_CODE',
      scope: 'Comprehensive tier selector, annual/monthly toggle, 7-day trial trigger, and offline subscription cache.',
      component: 'Billing / Subscriptions',
    },
    {
      id: 'DEV-V1-06',
      title: 'Local-First Persistence & Supabase Outbox Queue',
      status: 'READY_IN_CODE',
      scope: 'AsyncStorage local cache with idempotent replay queue to ensure zero data loss on spotty network.',
      component: 'Database / Sync',
    },
  ],
  sprint2_post_launch: [
    {
      id: 'DEV-SPRINT2-01',
      title: 'Dynamic Lock Screen Wallpaper Generator for Living Dincharya',
      status: 'SCHEDULED',
      scope: 'Export current day’s active Dincharya timeline + daily quote + Naam Japa anchor into high-res lock screen wallpaper.',
      component: 'Growth / Retention',
    },
    {
      id: 'DEV-SPRINT2-02',
      title: 'Duo Monks Real-Time Partner Sync',
      status: 'SCHEDULED',
      scope: 'Mutual bedtime lockout alerting partner when late night scrolling occurs; shared morning ignition notification.',
      component: 'Social / Duo Tier',
    },
    {
      id: 'DEV-SPRINT2-03',
      title: 'Household Monastery Sanctuary (Family Table Blackout)',
      status: 'SCHEDULED',
      scope: 'Family head can initiate dinner table focus blackout for all enrolled family devices simultaneously.',
      component: 'Family Pack',
    },
    {
      id: 'DEV-SPRINT2-04',
      title: 'Live Global Monks In Presence Counter',
      status: 'SCHEDULED',
      scope: 'Real-time WebSocket / Supabase channel broadcasting synchronized monks currently holding focus or doing Japa.',
      component: 'Community / Egregores',
    },
  ],
  legacy_archive: [
    {
      id: 'DEV-LEGACY-01',
      title: '33-Vertebra Medical Spine Journey UI',
      action: 'ARCHIVE_PARK',
      reason: 'V1 is strictly focused on Dincharya (Routine, Wake Alarm, Focus Block). Medical spine visual adds unnecessary friction.',
    },
    {
      id: 'DEV-LEGACY-02',
      title: 'Standalone AST / Astro-chart Engine',
      action: 'ARCHIVE_PARK',
      reason: 'Astrological engine parked for post-V1 reflection scroller update.',
    },
  ],
};

async function fetchJiraIssues() {
  const auth = getAuthHeader();
  if (!auth) {
    console.log('\n⚠️  Jira credentials not detected in environment.');
    console.log('    To fetch live tickets directly from Jira, provide:');
    console.log('    - JIRA_EMAIL=your-email@example.com');
    console.log('    - JIRA_API_TOKEN=your-atlassian-api-token');
    console.log('    - JIRA_HOST=https://shanivar.atlassian.net (default)');
    console.log('\nDisplaying local V1 MVP Sprint Lock & Backlog Plan:\n');
    displaySprintPlan();
    return;
  }

  try {
    const url = `${JIRA_HOST}/rest/api/3/search?jql=project=${JIRA_PROJECT_KEY}&maxResults=100`;
    console.log(`Connecting to ${JIRA_HOST} (Project: ${JIRA_PROJECT_KEY})...`);
    const res = await fetch(url, {
      headers: {
        Authorization: auth,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Jira API returned HTTP ${res.status}: ${errText}`);
      displaySprintPlan();
      return;
    }

    const data = await res.json();
    console.log(`\n✅ Connected to Jira! Found ${data.total} tickets in project ${JIRA_PROJECT_KEY}:\n`);

    data.issues.forEach((issue) => {
      const key = issue.key;
      const summary = issue.fields?.summary || 'No summary';
      const status = issue.fields?.status?.name || 'Unknown';
      console.log(`  [${key}] [${status}] ${summary}`);
    });
  } catch (err) {
    console.error('Failed to connect to Jira:', err.message);
    displaySprintPlan();
  }
}

async function createJiraIssue(summary, description) {
  const auth = getAuthHeader();
  if (!auth) {
    console.log('⚠️  Please set JIRA_EMAIL and JIRA_API_TOKEN to create tickets.');
    return;
  }

  const payload = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: description }],
          },
        ],
      },
      issuetype: { name: 'Task' },
    },
  };

  try {
    const res = await fetch(`${JIRA_HOST}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const issue = await res.json();
      console.log(`✅ Jira ticket created: ${issue.key} (${JIRA_HOST}/browse/${issue.key})`);
    } else {
      const err = await res.text();
      console.error(`Failed to create ticket: ${err}`);
    }
  } catch (err) {
    console.error('Error creating Jira issue:', err.message);
  }
}

function displaySprintPlan() {
  console.log('======================================================================');
  console.log('🔥 SHANIWAR BY THE HYBRID MONK — SPRINT 1: V1 MVP (LOCK-IN BEFORE GO LIVE)');
  console.log('======================================================================');
  LOCAL_ROADMAP.sprint1_v1_mvp.forEach((t) => {
    console.log(` • [${t.id}] ${t.title}`);
    console.log(`    Status: ${t.status} | Scope: ${t.scope}`);
  });

  console.log('\n======================================================================');
  console.log('🚀 SPRINT 2: IMMEDIATE POST-LAUNCH ROADMAP (GROWTH & RETENTION)');
  console.log('======================================================================');
  LOCAL_ROADMAP.sprint2_post_launch.forEach((t) => {
    console.log(` • [${t.id}] ${t.title}`);
    console.log(`    Status: ${t.status} | Scope: ${t.scope}`);
  });

  console.log('\n======================================================================');
  console.log('📦 PRUNED / ARCHIVED BACKLOG (DE-COMPLICATED FOR V1 FOCUS)');
  console.log('======================================================================');
  LOCAL_ROADMAP.legacy_archive.forEach((t) => {
    console.log(` • [${t.id}] ${t.title} -> ${t.action} (${t.reason})`);
  });
  console.log('======================================================================\n');
}

const command = process.argv[2] || 'audit';

if (command === 'audit') {
  fetchJiraIssues();
} else if (command === 'sprint-plan') {
  displaySprintPlan();
} else if (command === 'create-ticket') {
  const summary = process.argv[3] || '[FEAT] Dynamic Lock Screen Wallpaper Generator';
  const desc = process.argv[4] || 'Render Living Dincharya Arc to lock screen.';
  createJiraIssue(summary, desc);
} else {
  console.log(`Unknown command: ${command}`);
}
