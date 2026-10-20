import { MissionType } from '../../types';

export interface MissionProgress {
  currentCount: number;
  targetCount: number;
  progressPercent: number;
  isVerified: boolean;
}

export class MissionRunner {
  private currentProgress: MissionProgress = {
    currentCount: 0,
    targetCount: 20,
    progressPercent: 0,
    isVerified: false,
  };

  startMission(type: MissionType, targetCount = 20): void {
    this.currentProgress = {
      currentCount: 0,
      targetCount,
      progressPercent: 0,
      isVerified: false,
    };
    // TODO: Connect accelerometer / step sensor / camera AI based on type
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
