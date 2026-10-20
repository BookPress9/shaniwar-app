import { AlarmMission, MissionType } from '../../types';

export class AlarmEngine {
  private activeAlarms: Map<string, { time: Date; mission: AlarmMission }> = new Map();

  /**
   * Schedules an embodied action-alarm.
   * On Android, triggers full-screen intent + Accessibility Lock hooks.
   */
  scheduleAlarm(id: string, time: Date, missionType: MissionType): AlarmMission {
    const mission: AlarmMission = {
      id: `mission_${id}`,
      type: missionType,
      title: this.getMissionTitle(missionType),
      difficulty: 'command',
      targetCount: missionType === 'shake' ? 25 : missionType === 'walk' ? 20 : 1,
      isCompleted: false,
    };

    this.activeAlarms.set(id, { time, mission });
    // TODO: Wire native Android AlarmManager / ExactAlarmPermission & UNUserNotificationCenter
    return mission;
  }

  cancelAlarm(id: string): boolean {
    return this.activeAlarms.delete(id);
  }

  getActiveMissions(): AlarmMission[] {
    return Array.from(this.activeAlarms.values()).map((item) => item.mission);
  }

  private getMissionTitle(type: MissionType): string {
    switch (type) {
      case 'shake':
        return 'Vigorous Shake Calibration';
      case 'walk':
        return '20-Step Spatial Displacement';
      case 'photo':
        return 'Target Object Computer Vision Match';
      case 'qr':
        return 'Bathroom / Kitchen QR Anchor Scan';
    }
  }
}

export const alarmEngine = new AlarmEngine();
