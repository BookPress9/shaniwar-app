import { MissionType } from '../../types';

export interface MissionProgress {
  currentCount: number;
  targetCount: number;
  progressPercent: number;
  isVerified: boolean;
  motionSatisfied?: boolean;
  photoCaptured?: boolean;
}

/**
 * Genuine Motion Tracker:
 * Eliminates cheat flicks and single pickup jolts.
 * Calculates dynamic acceleration by removing gravity's 9.81 m/s² baseline.
 * Requires separated gait peaks (>= 280ms cadence) or sustained ambulatory motion (>= 1500ms).
 */
export class GenuineMotionTracker {
  static readonly GRAVITY_M_S2 = 9.81;
  static readonly PEAK_THRESHOLD_M_S2 = 2.2;
  static readonly SUSTAINED_THRESHOLD_M_S2 = 2.5;
  static readonly MIN_STEP_INTERVAL_MS = 280;
  static readonly REQUIRED_SUSTAINED_MS = 1500;

  private steps = 0;
  private targetSteps: number;
  private lastStepTimestamp: number | null = null;
  private sustainedStartTimestamp: number | null = null;
  private isAboveThreshold = false;
  private isSustainedSatisfied = false;

  constructor(targetSteps = 20) {
    this.targetSteps = targetSteps;
  }

  reset(targetSteps = 20): void {
    this.steps = 0;
    this.targetSteps = targetSteps;
    this.lastStepTimestamp = null;
    this.sustainedStartTimestamp = null;
    this.isAboveThreshold = false;
    this.isSustainedSatisfied = false;
  }

  /**
   * Process raw 3-axis accelerometer readings in m/s².
   */
  onAccelerometerSample(x: Float32Array | number, y: number, z: number, timestampMs: number = Date.now()): {
    stepCount: number;
    isComplete: boolean;
    dynamicAccel: number;
  } {
    const numX = typeof x === 'number' ? x : x[0];
    const magnitude = Math.sqrt(numX * numX + y * y + z * z);
    const dynamic = Math.abs(magnitude - GenuineMotionTracker.GRAVITY_M_S2);

    // 1. Ambulatory step peak detection with cadence debounce
    const isPeak = dynamic >= GenuineMotionTracker.PEAK_THRESHOLD_M_S2;
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

    // 2. Sustained ambulatory continuous check
    if (dynamic >= GenuineMotionTracker.SUSTAINED_THRESHOLD_M_S2) {
      if (this.sustainedStartTimestamp === null) {
        this.sustainedStartTimestamp = timestampMs;
      } else if (timestampMs - this.sustainedStartTimestamp >= GenuineMotionTracker.REQUIRED_SUSTAINED_MS) {
        this.isSustainedSatisfied = true;
      }
    } else {
      this.sustainedStartTimestamp = null;
    }

    return {
      stepCount: this.steps,
      isComplete: this.isComplete(),
      dynamicAccel: Math.round(dynamic * 100) / 100,
    };
  }

  isComplete(): boolean {
    return this.steps >= this.targetSteps || this.isSustainedSatisfied;
  }

  getStepCount(): number {
    return this.steps;
  }
}

export class MissionRunner {
  private currentProgress: MissionProgress = {
    currentCount: 0,
    targetCount: 20,
    progressPercent: 0,
    isVerified: false,
    motionSatisfied: false,
    photoCaptured: false,
  };

  private motionTracker = new GenuineMotionTracker(20);

  startMission(type: MissionType, targetCount = 20): void {
    this.motionTracker.reset(targetCount);
    this.currentProgress = {
      currentCount: 0,
      targetCount,
      progressPercent: 0,
      isVerified: false,
      motionSatisfied: false,
      photoCaptured: false,
    };
  }

  /**
   * Feed raw sensor data from phone hardware.
   */
  processMotionSample(x: number, y: number, z: number, timestampMs: number = Date.now()): MissionProgress {
    if (this.currentProgress.isVerified) return this.currentProgress;

    const res = this.motionTracker.onAccelerometerSample(x, y, z, timestampMs);
    this.currentProgress.currentCount = res.stepCount;
    this.currentProgress.progressPercent = Math.min(
      100,
      Math.round((res.stepCount / this.currentProgress.targetCount) * 100)
    );

    if (res.isComplete) {
      this.currentProgress.motionSatisfied = true;
      // If pure walk/shake mission, completing motion satisfies verification
      this.currentProgress.isVerified = true;
      this.currentProgress.progressPercent = 100;
    }

    return { ...this.currentProgress };
  }

  /**
   * For Photo + Motion hybrid mission:
   * Photo button only unlocks once genuine ambulatory movement is satisfied.
   */
  recordPhotoCapture(): MissionProgress {
    this.currentProgress.photoCaptured = true;
    if (this.currentProgress.motionSatisfied || this.currentProgress.currentCount >= 10) {
      this.currentProgress.isVerified = true;
      this.currentProgress.progressPercent = 100;
    }
    return { ...this.currentProgress };
  }

  recordIncrement(): MissionProgress {
    if (this.currentProgress.isVerified) return this.currentProgress;

    this.currentProgress.currentCount += 1;
    this.currentProgress.progressPercent = Math.min(
      100,
      Math.round((this.currentProgress.currentCount / this.currentProgress.targetCount) * 100)
    );

    if (this.currentProgress.currentCount >= this.currentProgress.targetCount) {
      this.currentProgress.isVerified = true;
      this.currentProgress.motionSatisfied = true;
    }

    return { ...this.currentProgress };
  }

  verifyQrCode(scannedPayload: string, expectedPayload: string): boolean {
    const matched = scannedPayload.trim() === expectedPayload.trim();
    if (matched) {
      this.currentProgress.isVerified = true;
      this.currentProgress.progressPercent = 100;
    }
    return matched;
  }

  getProgress(): MissionProgress {
    return { ...this.currentProgress };
  }
}

export const missionRunner = new MissionRunner();
