import { BreathPattern } from '../../types';

export const BREATH_PATTERNS: Record<string, BreathPattern> = {
  box: {
    id: 'box',
    name: 'Box Breath (Sama Vritti)',
    purpose: 'Nervous system reset & autonomic balance',
    phases: [
      { name: 'Inhale', seconds: 4 },
      { name: 'Hold', seconds: 4 },
      { name: 'Exhale', seconds: 4 },
      { name: 'Hold After Exhale', seconds: 4 },
    ],
    totalCycles: 12,
  },
  '478': {
    id: '478',
    name: '4-7-8 Parasympathetic Lock',
    purpose: 'Vagal nerve downshift & deep recovery',
    phases: [
      { name: 'Inhale', seconds: 4 },
      { name: 'Hold', seconds: 7 },
      { name: 'Exhale', seconds: 8 },
    ],
    totalCycles: 8,
  },
  coherence: {
    id: 'coherence',
    name: 'Heart Coherence (5.5s)',
    purpose: '0.1 Hz resonance for deep focus and HRV maximization',
    phases: [
      { name: 'Inhale', seconds: 5.5 },
      { name: 'Exhale', seconds: 5.5 },
    ],
    totalCycles: 15,
  },
  wimhof: {
    id: 'wimhof',
    name: 'Hyper-Resilience Cyclic Breath',
    purpose: 'Cellular oxygenation & morning sympathetic ignition',
    phases: [
      { name: 'Inhale', seconds: 2 },
      { name: 'Exhale', seconds: 2 },
    ],
    totalCycles: 30,
  },
  alternate: {
    id: 'alternate',
    name: 'Nadi Shodhana (Alternate Flow)',
    purpose: 'Hemispheric brain synchronization & mental clarity',
    phases: [
      { name: 'Inhale', seconds: 4 },
      { name: 'Hold', seconds: 4 },
      { name: 'Exhale', seconds: 4 },
    ],
    totalCycles: 10,
  },
};

export class BreathEngine {
  private activePattern: BreathPattern = BREATH_PATTERNS.box;
  private currentCycle = 0;
  private currentPhaseIndex = 0;

  setPattern(patternId: string): BreathPattern {
    const pattern = BREATH_PATTERNS[patternId] || BREATH_PATTERNS.box;
    this.activePattern = pattern;
    this.currentCycle = 0;
    this.currentPhaseIndex = 0;
    return pattern;
  }

  getActivePattern(): BreathPattern {
    return this.activePattern;
  }

  calculateAccuracyScore(targetDuration: number, actualDuration: number): number {
    const error = Math.abs(targetDuration - actualDuration);
    const score = Math.max(0, Math.min(100, Math.round((1 - error / targetDuration) * 100)));
    return score;
  }
}

export const breathEngine = new BreathEngine();
