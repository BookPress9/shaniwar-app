export class WakeUpCheck {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private isAwaitingConfirmation = false;
  private secondsRemaining = 60;

  /**
   * Fires a secondary check 5 minutes after alarm mission completion
   * to guarantee the practitioner did not crawl back into bed.
   */
  scheduleCheck(delayMinutes = 5, onTrigger?: () => void): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.isAwaitingConfirmation = true;
      this.secondsRemaining = 60;
      onTrigger?.();
    }, delayMinutes * 60 * 1000);
  }

  confirmAwake(): boolean {
    if (!this.isAwaitingConfirmation) return false;
    this.isAwaitingConfirmation = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    return true;
  }

  handleMissedCheck(onReAlarm: () => void): void {
    if (this.isAwaitingConfirmation && this.secondsRemaining <= 0) {
      onReAlarm();
    }
  }

  getIsAwaitingConfirmation(): boolean {
    return this.isAwaitingConfirmation;
  }
}

export const wakeUpCheck = new WakeUpCheck();
