export type MissionType = 'shake' | 'walk' | 'photo' | 'qr';

export interface AlarmMission {
  id: string;
  type: MissionType;
  title: string;
  difficulty: 'ignite' | 'rise' | 'command' | 'monk';
  targetCount: number; // e.g. 20 shakes, 20 steps
  targetVerificationPayload?: string; // QR code string or image anchor tag
  isCompleted: boolean;
}

export interface MonkBlock {
  id: string;
  name: string;
  startTime: string; // "06:00"
  endTime: string; // "08:00"
  blockedApps: string[];
  strictMode: boolean;
  isActive: boolean;
}

export interface SessionResult {
  sessionId: string;
  taskName: string;
  durationMinutes: number;
  treesGrown: number;
  interrupted: boolean;
  completionRate: number;
}

export type SpineChapter = 'root' | 'channel' | 'crown';

export interface SpineSection {
  id: number; // 1 to 33
  name: string;
  chapter: SpineChapter;
  description: string;
  breathPatternId: string;
  attentionExercise: string;
  isUnlocked: boolean;
  accuracyScore?: number;
}

export interface BreathPhase {
  name: 'Inhale' | 'Hold' | 'Exhale' | 'Hold After Exhale';
  seconds: number;
}

export interface BreathPattern {
  id: string;
  name: string;
  purpose: string;
  phases: BreathPhase[];
  totalCycles: number;
}

export interface DailyScore {
  date: string;
  overallScore: number; // 0-100
  routineCompletedBlocks: number;
  routineTotalBlocks: number;
  sadhnaMinutesTrained: number;
  currentSpineSection: number;
}

// ==========================================
// MANOVIGYAN (Self-Psychology & Neti-Neti)
// ==========================================

export type InquiryCategory = 'masks' | 'stress_lines' | 'locus_of_control' | 'shadow';

export interface InquiryOption {
  id: string;
  text: string;
  psychologicalLabel: string;
  isConditionedPersona: boolean; // true = "What You Are Not", false = "What You Truly Are"
  insight: string;
}

export interface InquiryDilemma {
  id: string;
  category: InquiryCategory;
  categoryTitle: string;
  scenario: string;
  question: string;
  options: [InquiryOption, InquiryOption];
}

export interface PsychologicalRadarProfile {
  authenticity: number; // 0 - 100
  emotionalWitnessing: number;
  internalAgency: number;
  shadowIntegration: number;
  stressGroundedness: number;
  nonAttachment: number;
}

export interface DeconstructionItem {
  id: string;
  title: string;
  nature: 'true_self' | 'conditioned_armor';
  description: string;
  origin: string; // e.g. "Childhood adaptation", "Innate temperament"
}

