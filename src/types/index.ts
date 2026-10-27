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
export type SpineRegion = 'COCCYGEAL' | 'SACRAL' | 'LUMBAR' | 'THORACIC' | 'CERVICAL';

export interface VBTTechnique {
  id: string;
  title: string;
  verse: string;
  essence: string;
  duration: string;
  script: string;
  source: string;
}

export interface SpineSection {
  id: number; // 1 to 33
  name: string;
  chapter: SpineChapter;
  region: SpineRegion;
  regionCode: string; // Co1..Co4, S1..S5, L1..L5, T1..T12, C1..C7
  chakraAnchor?: string; // e.g. "Mūlādhāra (Base)", "Anāhata (Heart)"
  description: string;
  breathPatternId: string;
  vbtTechniqueId?: string;
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

// ==========================================
// SUBSCRIPTION & BILLING (Single, Duo, Family)
// ==========================================

export type SubscriptionTier = 'free' | 'single' | 'duo' | 'family';
export type BillingPeriod = 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  maxMembers: number;
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  badge?: string;
  targetAudience: string;
  features: string[];
}

export interface UserSubscriptionState {
  tier: SubscriptionTier;
  period: BillingPeriod;
  isActive: boolean;
  isTrial: boolean;
  trialEndTimestamp?: number;
  expiresAtTimestamp?: number;
  memberSlots: number;
  inviteCode?: string;
}


