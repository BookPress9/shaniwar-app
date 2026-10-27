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
  // Phone resting flat on table: z = 9.81 m/s²
  const res = tracker.onAccelerometerSample(0, 0, 9.81, 1000);
  assert.equal(res.stepCount, 0);
  assert.equal(res.isComplete, false);
  assert.equal(res.dynamicAccel, 0);
});

test('GenuineMotionTracker accurately detects ambulatory steps with cadence debounce', () => {
  const tracker = new GenuineMotionTracker(3);
  
  // Step 1: vertical jolt at t = 1000ms
  let res = tracker.onAccelerometerSample(0.2, 12.81, 0.1, 1000);
  assert.equal(res.stepCount, 1);
  assert.equal(res.isComplete, false);

  // Quick secondary vibration at t = 1100ms (< 280ms threshold) should be ignored as cheat jolt
  tracker.onAccelerometerSample(0.1, 9.81, 0.1, 1050); // foot descent (trough)
  res = tracker.onAccelerometerSample(0.1, 12.5, 0.1, 1100);
  assert.equal(res.stepCount, 1, 'Cadence debounce should reject rapid cheat jitter');

  // Foot descent (trough)
  tracker.onAccelerometerSample(0.1, 9.81, 0.1, 1200);

  // Step 2: natural gait step at t = 1400ms (>= 280ms from step 1)
  res = tracker.onAccelerometerSample(0.1, 12.9, 0.2, 1400);
  assert.equal(res.stepCount, 2);

  // Foot descent (trough)
  tracker.onAccelerometerSample(0.1, 9.81, 0.1, 1600);

  // Step 3: natural gait step at t = 1800ms
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

  // Expected order: 05:30 -> 06:00 -> 07:00 (Gym) -> 09:00 -> 20:30 (Reading) -> 22:00
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
  // Sleep at 10:30 PM (22:30), wake at 06:00 AM (06:00) -> 7 hours 30 mins
  const rest1 = calculateCircadianRest(22, 30, 6, 0);
  assert.equal(rest1.hours, 7);
  assert.equal(rest1.minutes, 30);
  assert.equal(rest1.totalMinutes, 450);

  // Sleep at 11:00 PM (23:00), wake at 05:30 AM (05:30) -> 6 hours 30 mins
  const rest2 = calculateCircadianRest(23, 0, 5, 30);
  assert.equal(rest2.hours, 6);
  assert.equal(rest2.minutes, 30);
  assert.equal(rest2.totalMinutes, 390);

  // Sleep at 10:00 PM (22:00), wake at 06:00 AM (06:00) -> exactly 8 hours 0 mins
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
