import { SessionResult } from '../../types';

export class PomodoroSession {
  private currentTask = '';
  private durationMinutes = 25;
  private secondsRemaining = 25 * 60;
  private isRunning = false;
  private treeHealthPercent = 100;

  startSession(taskName: string, durationMinutes = 25): void {
    this.currentTask = taskName;
    this.durationMinutes = durationMinutes;
    this.secondsRemaining = durationMinutes * 60;
    this.isRunning = true;
    this.treeHealthPercent = 100;
  }

  tick(): { secondsRemaining: number; isComplete: boolean; treeHealthPercent: number } {
    if (!this.isRunning) {
      return { secondsRemaining: this.secondsRemaining, isComplete: false, treeHealthPercent: this.treeHealthPercent };
    }

    if (this.secondsRemaining > 0) {
      this.secondsRemaining -= 1;
    }

    const isComplete = this.secondsRemaining === 0;
    if (isComplete) {
      this.isRunning = false;
    }

    return {
      secondsRemaining: this.secondsRemaining,
      isComplete,
      treeHealthPercent: this.treeHealthPercent,
    };
  }

  penalizeAppSwitch(): number {
    // Forest-style loss aversion: Leaving the app damages tree health
    this.treeHealthPercent = Math.max(0, this.treeHealthPercent - 25);
    return this.treeHealthPercent;
  }

  finishSession(): SessionResult {
    this.isRunning = false;
    const completed = this.secondsRemaining === 0;
    return {
      sessionId: `sess_${Date.now()}`,
      taskName: this.currentTask,
      durationMinutes: this.durationMinutes,
      treesGrown: completed && this.treeHealthPercent > 50 ? 1 : 0,
      interrupted: this.treeHealthPercent <= 50,
      completionRate: Math.round(((this.durationMinutes * 60 - this.secondsRemaining) / (this.durationMinutes * 60)) * 100),
    };
  }
}

export const pomodoroSession = new PomodoroSession();
