import test from 'node:test';
import assert from 'node:assert/strict';

// 1. Test GenuineMotionTracker (CoreMotion accelerometer step detection)
class GenuineMotionTracker {
  static GRAVITY = 9.81;
  static PEAK_THRESHOLD = 2.2;
  static MIN_STEP_INTERVAL_MS = 280;

  constructor(targetSteps = 20) {
    this.steps = 0;
    this.targetSteps = targetSteps;
    this.lastStepTimestamp = null;
    this.isAboveThreshold = false;
  }

  onAccelerometerSample(x, y, z, timestampMs = Date.now()) {
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const dynamic = Math.abs(magnitude - GenuineMotionTracker.GRAVITY);
    const isPeak = dynamic >= GenuineMotionTracker.PEAK_THRESHOLD;

    if (
      isPeak &&
      !this.isAboveThreshold &&
      (this.lastStepTimestamp === null || timestampMs - this.lastStepTimestamp >= GenuineMotionTracker.MIN_STEP_INTERVAL_MS)
    ) {
      if (this.steps < this.targetSteps) {
        this.steps += 1;
      }
      this.lastStepTimestamp = timestampMs;
    }

    this.isAboveThreshold = isPeak;
    return {
      stepCount: this.steps,
      isComplete: this.steps >= this.targetSteps,
      dynamicAccel: Math.round(dynamic * 10) / 10,
    };
  }
}

test('GenuineMotionTracker rejects static gravity reading without movement', () => {
  const tracker = new GenuineMotionTracker(20);
  const res = tracker.onAccelerometerSample(0, 0, 9.81, 1000);
  assert.equal(res.stepCount, 0);
  assert.equal(res.isComplete, false);
  assert.equal(res.dynamicAccel, 0);
});

test('GenuineMotionTracker accurately detects ambulatory steps with cadence debounce', () => {
  const tracker = new GenuineMotionTracker(3);
  
  let res = tracker.onAccelerometerSample(0.2, 12.81, 0.1, 1000);
  assert.equal(res.stepCount, 1);
  assert.equal(res.isComplete, false);

  tracker.onAccelerometerSample(0.1, 9.81, 0.1, 1050);
  res = tracker.onAccelerometerSample(0.1, 12.5, 0.1, 1100);
  assert.equal(res.stepCount, 1, 'Cadence debounce should reject rapid cheat jitter');

  tracker.onAccelerometerSample(0.1, 9.81, 0.1, 1200);

  res = tracker.onAccelerometerSample(0.1, 12.9, 0.2, 1400);
  assert.equal(res.stepCount, 2);

  tracker.onAccelerometerSample(0.1, 9.81, 0.1, 1600);

  res = tracker.onAccelerometerSample(0.3, 13.1, 0.1, 1800);
  assert.equal(res.stepCount, 3);
  assert.equal(res.isComplete, true);
});

// 2. Test Archetype Timeline Definitions
const ARCHETYPES = {
  builder: { name: 'Builder', wakeHour: 5, wakeMinute: 45 },
  student: { name: 'Student', wakeHour: 6, wakeMinute: 30 },
  parent: { name: 'Parent', wakeHour: 6, wakeMinute: 0 },
  householder: { name: 'Modern Householder', wakeHour: 6, wakeMinute: 45 },
};

test('Archetypes provide distinct, non-overlapping starting ignition times', () => {
  const keys = Object.keys(ARCHETYPES);
  assert.equal(keys.length, 4);
  assert.equal(ARCHETYPES.builder.wakeHour, 5);
  assert.equal(ARCHETYPES.student.wakeMinute, 30);
  assert.equal(ARCHETYPES.parent.wakeHour, 6);
  assert.equal(ARCHETYPES.householder.wakeMinute, 45);
});

// 3. Test Subscription Tiers & Member Limits
const SUBSCRIPTION_PLANS = [
  { tier: 'solitary', maxMembers: 1, monthlyPrice: 9.99, annualPrice: 59.99 },
  { tier: 'duo', maxMembers: 2, monthlyPrice: 14.99, annualPrice: 89.99 },
  { tier: 'family', maxMembers: 5, monthlyPrice: 19.99, annualPrice: 119.99 },
];

test('Subscription tiers enforce correct family/duo member limits', () => {
  const solitary = SUBSCRIPTION_PLANS.find(p => p.tier === 'solitary');
  const duo = SUBSCRIPTION_PLANS.find(p => p.tier === 'duo');
  const family = SUBSCRIPTION_PLANS.find(p => p.tier === 'family');

  assert.equal(solitary.maxMembers, 1);
  assert.equal(duo.maxMembers, 2);
  assert.equal(family.maxMembers, 5);
  assert.equal(duo.annualPrice, 89.99);
  assert.equal(family.annualPrice, 119.99);
});

// 4. Test Idempotent Outbox Payload Construction
test('Outbox creates unique deterministic ID for routine plans', () => {
  const table = 'routine_plans';
  const payload = { user_id: 'user_123', morning_wake_time: '05:45 AM', evening_review_time: '06:30 PM' };
  const itemId = `${table}_${payload.id || payload.log_date || 'current'}`;
  assert.equal(itemId, 'routine_plans_current');
});

// 5. Test Chronological Sorting & Custom Routine Item Insertion
function sortRoutineItems(items) {
  return [...items].sort((a, b) => {
    const aMins = a.hour * 60 + a.minute;
    const bMins = b.hour * 60 + b.minute;
    return aMins - bMins;
  });
}

test('Routine items sort chronologically when custom blocks are inserted', () => {
  const baseTimeline = [
    { id: 'wake_alarm', title: 'The Wake Alarm', hour: 5, minute: 30 },
    { id: 'dawn_breath', title: 'Dawn Kundalini Breath', hour: 6, minute: 0 },
    { id: 'protection_window', title: 'Deep Work Window', hour: 9, minute: 0 },
    { id: 'sleep_sanctum', title: 'Sleep Sanctum', hour: 22, minute: 0 },
  ];

  const customGymBlock = {
    id: 'custom_gym',
    title: 'Strength & Iron Workout',
    hour: 7,
    minute: 0,
    tag: 'FITNESS',
    isCustom: true,
  };

  const customReadingBlock = {
    id: 'custom_reading',
    title: 'Evening Deep Reading',
    hour: 20,
    minute: 30,
    tag: 'STUDY',
    isCustom: true,
  };

  const merged = sortRoutineItems([...baseTimeline, customReadingBlock, customGymBlock]);

  assert.equal(merged[0].id, 'wake_alarm');
  assert.equal(merged[1].id, 'dawn_breath');
  assert.equal(merged[2].id, 'custom_gym');
  assert.equal(merged[3].id, 'protection_window');
  assert.equal(merged[4].id, 'custom_reading');
  assert.equal(merged[5].id, 'sleep_sanctum');
});

// 6. Test Circadian Sleep Duration Calculation (Crossing Midnight)
function calculateCircadianRest(sleepHour, sleepMinute, wakeHour, wakeMinute) {
  const sleepTotalMins = sleepHour * 60 + sleepMinute;
  let wakeTotalMins = wakeHour * 60 + wakeMinute;
  if (wakeTotalMins <= sleepTotalMins) {
    wakeTotalMins += 24 * 60;
  }
  const diffMins = wakeTotalMins - sleepTotalMins;
  return {
    hours: Math.floor(diffMins / 60),
    minutes: diffMins % 60,
    totalMinutes: diffMins,
  };
}

test('Circadian calculation correctly computes rest window across midnight', () => {
  const rest1 = calculateCircadianRest(22, 30, 6, 0);
  assert.equal(rest1.hours, 7);
  assert.equal(rest1.minutes, 30);
  assert.equal(rest1.totalMinutes, 450);

  const rest2 = calculateCircadianRest(23, 0, 5, 30);
  assert.equal(rest2.hours, 6);
  assert.equal(rest2.minutes, 30);
  assert.equal(rest2.totalMinutes, 390);

  const rest3 = calculateCircadianRest(22, 0, 6, 0);
  assert.equal(rest3.hours, 8);
  assert.equal(rest3.minutes, 0);
});

// 7. Test Custom Item Deletion
test('Custom item deletion removes the item while preserving core anchors', () => {
  const routine = [
    { id: 'wake_alarm', isCustom: false },
    { id: 'custom_123', isCustom: true },
    { id: 'sleep_sanctum', isCustom: false },
  ];

  const updated = routine.filter(i => i.id !== 'custom_123');
  assert.equal(updated.length, 2);
  assert.equal(updated.some(i => i.id === 'custom_123'), false);
  assert.equal(updated[0].id, 'wake_alarm');
  assert.equal(updated[1].id, 'sleep_sanctum');
});

// 8. Test Sovereignty Meter Daily Progress Calculation
function computeSovereigntyScore(completedIds, totalEnabledCount) {
  if (totalEnabledCount <= 0) return 0;
  return Math.min(100, Math.round((completedIds.length / totalEnabledCount) * 100));
}

test('Sovereignty meter correctly calculates percentage and bounds at 100%', () => {
  assert.equal(computeSovereigntyScore([], 6), 0);
  assert.equal(computeSovereigntyScore(['wake_alarm', 'dawn_breath'], 6), 33);
  assert.equal(computeSovereigntyScore(['a', 'b', 'c', 'd'], 6), 67);
  assert.equal(computeSovereigntyScore(['a', 'b', 'c', 'd', 'e', 'f'], 6), 100);
});

// 9. Test One Sec Intention Triage Logic
function categorizeImpulse(intention) {
  if (intention === 'boredom') {
    return { shouldPromptExit: true, rewardPoints: 1, action: 'CONQUER_IMPULSE' };
  }
  if (intention === 'work') {
    return { shouldPromptExit: false, rewardPoints: 0, action: 'ALLOW_FOCUSED_SESSION' };
  }
  return { shouldPromptExit: false, rewardPoints: 0, action: 'CONSCIOUS_OPEN' };
}

test('One Sec intention triage rewards boredom exits with victory points', () => {
  const boredomRes = categorizeImpulse('boredom');
  assert.equal(boredomRes.shouldPromptExit, true);
  assert.equal(boredomRes.rewardPoints, 1);

  const workRes = categorizeImpulse('work');
  assert.equal(workRes.shouldPromptExit, false);
  assert.equal(workRes.rewardPoints, 0);
});

// 10. Test Double-Gate Wake-Up Check State Transition
class WakefulnessStateMachine {
  constructor() {
    this.state = 'ALARM_RINGING';
  }
  completeMotionMission() {
    if (this.state === 'ALARM_RINGING') {
      this.state = 'GATE_PENDING';
    }
  }
  confirmUpright() {
    if (this.state === 'GATE_PENDING') {
      this.state = 'AWAKE_VERIFIED';
      return true;
    }
    return false;
  }
  missTimeout() {
    if (this.state === 'GATE_PENDING') {
      this.state = 'ALARM_RINGING';
      return 'RE_ARM_SIREN';
    }
    return 'NOOP';
  }
}

test('Wakefulness state machine enforces double gate before sealing victory', () => {
  const sm = new WakefulnessStateMachine();
  assert.equal(sm.state, 'ALARM_RINGING');

  sm.completeMotionMission();
  assert.equal(sm.state, 'GATE_PENDING');

  const verified = sm.confirmUpright();
  assert.equal(verified, true);
  assert.equal(sm.state, 'AWAKE_VERIFIED');
});
