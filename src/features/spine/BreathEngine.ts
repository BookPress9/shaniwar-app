import { BreathPattern, VBTTechnique } from '../../types';

/**
 * 90-Second Rule:
 * Any sitting or breathing practice under 90 seconds is saved in local history
 * for honesty, but is NOT counted toward spine advancement or daily consistency.
 * Prevents superficial click-through gamification.
 */
export const MIN_PRACTISED_SECONDS = 90;

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

/**
 * 12 Authentic Vigyan Bhairav Tantra (VBT) Dhāranā Techniques.
 * Translated from Sanskrit by Dr. Christopher Wallis (Oxford Sanskritist).
 */
export const VBT_TECHNIQUES: Record<string, VBTTechnique> = {
  'vbt-01': {
    id: 'vbt-01',
    title: 'Two Pauses of Breath',
    verse: 'VBT Verse 24–25',
    essence: 'Resting attention in the closing gap at the top of inhale and bottom of exhale — the two naturally occurring stillnesses that breath leaves behind.',
    duration: '3–5 minutes',
    script: 'Find a position where your spine is upright without effort. Breathe normally.\n\nBring your attention to the top of the inhale — that half-second after in-breath finishes and before out-breath begins. Rest there.\n\nBreathe out, and find the pause at the bottom of the exhale. Rest there.\n\nKeep going: breathe normally, letting attention settle into the pauses rather than rushing toward the next breath.',
    source: 'Vijñāna-bhairava-tantra, verses 24–25. Translation: Christopher Wallis.',
  },
  'vbt-02': {
    id: 'vbt-02',
    title: 'Tranquil Retention',
    verse: 'VBT Verse 27',
    essence: 'Extending the natural pause into a calm, unforced retention using a steady 4-4-4-4 scaffold to settle autonomic tone.',
    duration: '4–6 minutes',
    script: 'Sit comfortably. Breathe in a simple, even pattern: in for 4, hold gently for 4, out for 4, hold for 4.\n\nLet each hold be a place to rest, not a place to push through.\n\nNotice where the shoulders, jaw, and forehead soften in the stillness.',
    source: 'Vijñāna-bhairava-tantra, verse 27. Translation: Christopher Wallis.',
  },
  'vbt-03': {
    id: 'vbt-03',
    title: 'Silence After the Hum',
    verse: 'VBT Verse 39–40',
    essence: 'Using a slow exhaled vocal hum (Bhramari) to manufacture a clean, noticeable silence to land in once sound finishes.',
    duration: '3–4 minutes',
    script: 'Take a breath in. As you exhale, make a soft, low hum: mmm.\n\nWhen the hum ends and breath is empty, stay for a second or two in the silence left behind.\n\nBreathe in naturally, then repeat for 6 to 8 rounds.',
    source: 'Vijñāna-bhairava-tantra, verses 39–40. Translation: Christopher Wallis.',
  },
  'vbt-04': {
    id: 'vbt-04',
    title: 'The Fading Tone',
    verse: 'VBT Verse 41',
    essence: 'Redirecting auditory attention from loud stimulus to the long, quiet decay edge where sound and silence blur.',
    duration: '4–6 minutes',
    script: 'Close your eyes and listen to a bell or resonant tone.\n\nFollow the tone continuously as it decays: from bright, to softer, to thinner, down to the quietest threshold where sound and silence meet.\n\nStay at that edge for 30 seconds after it fades completely.',
    source: 'Vijñāna-bhairava-tantra, verse 41. Translation: Christopher Wallis.',
  },
  'vbt-05': {
    id: 'vbt-05',
    title: 'Sky Gazing',
    verse: 'VBT Verse 84',
    essence: 'An unbroken, soft gaze on the open, featureless sky, quieting the constant micro-saccades of the ocular system.',
    duration: '3–5 minutes',
    script: 'Find a spot where you can see open sky without straining.\n\nLet your gaze settle on the emptiest part of the sky. Do not stare hard; rest your gaze there.\n\nNotice whether your peripheral vision gently widens around the center.',
    source: 'Vijñāna-bhairava-tantra, verse 84. Translation: Christopher Wallis.',
  },
  'vbt-06': {
    id: 'vbt-06',
    title: 'Dappled Light',
    verse: 'VBT Verse 76',
    essence: 'Resting attention on a shifting, non-demanding pattern of light and shadow (leaves, water) with nothing to solve or track.',
    duration: '3–5 minutes',
    script: 'Look at a patch of broken, moving light — sunlight through leaves or ripples of water.\n\nSpread your attention across the whole moving texture without naming or analyzing it.\n\nLet the shifting contrast hold attention loosely.',
    source: 'Vijñāna-bhairava-tantra, verse 76. Translation: Christopher Wallis.',
  },
  'vbt-07': {
    id: 'vbt-07',
    title: 'The Gentle Swing',
    verse: 'VBT Verse 83',
    essence: 'Slow rhythmic swaying that engages the vestibular balance sense, placing awareness on the turning points between movements.',
    duration: '3–5 minutes',
    script: 'Sway gently side to side or back and forth in a slow, easy rhythm.\n\nBring attention specifically to the turning points at each end of the movement — the weightless pause where direction shifts.',
    source: 'Vijñāna-bhairava-tantra, verse 83. Translation: Christopher Wallis.',
  },
  'vbt-08': {
    id: 'vbt-08',
    title: 'Savoring Fully',
    verse: 'VBT Verse 72',
    essence: 'Directing full, unhurried sensory presence to the decay of taste in food or drink rather than habitual mindless consumption.',
    duration: '3–4 minutes',
    script: 'Take a small sip of tea or water. Do not swallow immediately.\n\nTrack the first wave of flavor, then swallow and notice the aftertaste that lingers.\n\nTreat each sip as the only thing happening right now.',
    source: 'Vijñāna-bhairava-tantra, verse 72. Translation: Christopher Wallis.',
  },
  'vbt-09': {
    id: 'vbt-09',
    title: 'The Gap Between Two',
    verse: 'VBT Verse 61–62',
    essence: 'Catching the brief, spacious interval between one thought ending and the next thought arising.',
    duration: '4–6 minutes',
    script: 'Sit quietly and notice thoughts arising and passing.\n\nShift your aim: instead of watching the thoughts, look for the moment between one thought finishing and the next beginning.\n\nWhen you catch that window, let awareness rest in the open center.',
    source: 'Vijñāna-bhairava-tantra, verses 61–62. Translation: Christopher Wallis.',
  },
  'vbt-10': {
    id: 'vbt-10',
    title: 'Threshold of Sleep',
    verse: 'VBT Verse 75',
    essence: 'Sustaining witness presence in the liminal hypnagogic state between wakefulness and sleep onset.',
    duration: '3–5 minutes (bedtime)',
    script: 'Lying in bed at night as sleep approaches.\n\nNotice when thinking in full sentences begins to dissolve.\n\nAcknowledge: this is that in-between place. Rest in observation until sleep naturally arrives.',
    source: 'Vijñāna-bhairava-tantra, verse 75. Translation: Christopher Wallis.',
  },
  'vbt-11': {
    id: 'vbt-11',
    title: 'Open Horizon',
    verse: 'VBT Verse 60',
    essence: 'Widening spatial awareness to match a distant, open horizon, letting the mind take on the spaciousness of what it sees.',
    duration: '3–5 minutes',
    script: 'Look as far and as wide as possible into the distance.\n\nLet the width of your attention expand to match the panoramic view.\n\nWhen mental churning arises, widen attention back out to the full horizon.',
    source: 'Vijñāna-bhairava-tantra, verse 60. Translation: Christopher Wallis.',
  },
  'vbt-12': {
    id: 'vbt-12',
    title: 'Steady in the Storm',
    verse: 'VBT Verse 101, 103',
    essence: 'Resting awareness directly inside emotional turbulence by softening physical musculature around the activation.',
    duration: '3–4 minutes',
    script: 'In the middle of strong emotion, locate where it sits in the body (chest, jaw, stomach).\n\nSoften the muscles around that area by ten percent. Do not force it to disappear.\n\nStay present while the wave crests and shifts.',
    source: 'Vijñāna-bhairava-tantra, verses 101 & 103. Translation: Christopher Wallis.',
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

  getVBTTechnique(id: string): VBTTechnique | undefined {
    return VBT_TECHNIQUES[id];
  }

  getAllVBTTechniques(): VBTTechnique[] {
    return Object.values(VBT_TECHNIQUES);
  }

  isQualifiedPractice(activeSeconds: number): boolean {
    return activeSeconds >= MIN_PRACTISED_SECONDS;
  }

  calculateAccuracyScore(targetDuration: number, actualDuration: number): number {
    const error = Math.abs(targetDuration - actualDuration);
    const score = Math.max(0, Math.min(100, Math.round((1 - error / targetDuration) * 100)));
    return score;
  }
}

export const breathEngine = new BreathEngine();
