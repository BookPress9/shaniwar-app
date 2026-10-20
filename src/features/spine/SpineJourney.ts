import { SpineChapter, SpineSection } from '../../types';

export const SPINE_SECTIONS_DATA: SpineSection[] = [
  // CHAPTER 1: THE ROOT (Sections 1-11) - Foundational Breath & Stillness
  { id: 1, name: 'Witness Breath', chapter: 'root', description: 'Observe the spontaneous breath without modulation or control.', breathPatternId: 'coherence', attentionExercise: 'Dot Focus', isUnlocked: true },
  { id: 2, name: 'Box Breath Initiation', chapter: 'root', description: '4-4-4-4 nervous system stabilization rhythm.', breathPatternId: 'box', attentionExercise: 'The Void', isUnlocked: false },
  { id: 3, name: 'Sushumna Anchor', chapter: 'root', description: 'Centering awareness on the spinal channel axis.', breathPatternId: 'coherence', attentionExercise: 'Sound Anchor', isUnlocked: false },
  { id: 4, name: 'Diaphragmatic Depth', chapter: 'root', description: 'Activating low-frequency vagal tone through 3D belly expansion.', breathPatternId: '478', attentionExercise: 'Breath Archer', isUnlocked: false },
  { id: 5, name: 'Rhythm Consistency', chapter: 'root', description: 'Sustaining uninterrupted rhythm across 20 continuous cycles.', breathPatternId: 'box', attentionExercise: 'Dot Focus', isUnlocked: false },
  { id: 6, name: 'Nadi Purification I', chapter: 'root', description: 'Alternate nostril balance between sympathetic and parasympathetic.', breathPatternId: 'alternate', attentionExercise: 'Sound Anchor', isUnlocked: false },
  { id: 7, name: 'Solar Activation', chapter: 'root', description: 'Right nostril hyper-oxygenation for morning wakefulness.', breathPatternId: 'wimhof', attentionExercise: 'Dot Focus', isUnlocked: false },
  { id: 8, name: 'Lunar Calming', chapter: 'root', description: 'Left nostril heart-rate de-escalation for evening grounding.', breathPatternId: '478', attentionExercise: 'The Void', isUnlocked: false },
  { id: 9, name: 'Breath Retention (Kumbhaka)', chapter: 'root', description: 'Internal retention holding steady stillness without panic.', breathPatternId: 'box', attentionExercise: 'The Void', isUnlocked: false },
  { id: 10, name: 'The Silent Threshold', chapter: 'root', description: 'Sensing the subtle pause between inhalation and exhalation.', breathPatternId: 'coherence', attentionExercise: 'Thought Catcher', isUnlocked: false },
  { id: 11, name: 'Root Gate Consolidation', chapter: 'root', description: 'Mastery check of the 11 foundational vertebrae.', breathPatternId: 'coherence', attentionExercise: 'Breath Archer', isUnlocked: false },

  // CHAPTER 2: THE CHANNEL (Sections 12-22) - Attention Training
  { id: 12, name: 'Candle Flame Lock', chapter: 'channel', description: 'Unwavering visual beam concentration on a single locus.', breathPatternId: 'coherence', attentionExercise: 'Dot Focus', isUnlocked: false },
  { id: 13, name: 'Auditory Horizon', chapter: 'channel', description: 'Dissecting micro-sounds within the ambient soundfield.', breathPatternId: 'coherence', attentionExercise: 'Sound Anchor', isUnlocked: false },
  { id: 14, name: 'Thought Labeling', chapter: 'channel', description: 'Tagging thoughts without emotional entanglement (planning, memory).', breathPatternId: 'box', attentionExercise: 'Thought Catcher', isUnlocked: false },
  { id: 15, name: 'Somatic Body Scan', chapter: 'channel', description: 'Sweeping high-resolution awareness from coccyx to crown.', breathPatternId: 'coherence', attentionExercise: 'The Void', isUnlocked: false },
  { id: 16, name: 'Peripheral Vigilance', chapter: 'channel', description: 'Expanding visual awareness to 180 degrees while locked centered.', breathPatternId: 'box', attentionExercise: 'Dot Focus', isUnlocked: false },
  { id: 17, name: 'Hyper-Resilience Wave', chapter: 'channel', description: 'Wim Hof style multi-round cyclic hyperventilation + retention.', breathPatternId: 'wimhof', attentionExercise: 'The Void', isUnlocked: false },
  { id: 18, name: 'Heart-Brain Entrainment', chapter: 'channel', description: '0.1 Hz breathing resonance synchronizing HRV and attention.', breathPatternId: 'coherence', attentionExercise: 'Breath Archer', isUnlocked: false },
  { id: 19, name: 'Distraction Immunity', chapter: 'channel', description: 'Resisting sudden auditory cues without breaking breath rhythm.', breathPatternId: 'box', attentionExercise: 'Sound Anchor', isUnlocked: false },
  { id: 20, name: 'Micro-Stillness (Zero Twitch)', chapter: 'channel', description: 'Complete biomechanical stillness detected via phone sensors.', breathPatternId: '478', attentionExercise: 'The Void', isUnlocked: false },
  { id: 21, name: 'Dual Anchor Training', chapter: 'channel', description: 'Splitting conscious attention between breath cadence and an external point.', breathPatternId: 'coherence', attentionExercise: 'Dot Focus', isUnlocked: false },
  { id: 22, name: 'Channel Gate Mastery', chapter: 'channel', description: 'Full unbroken 15-minute channel endurance protocol.', breathPatternId: 'coherence', attentionExercise: 'Breath Archer', isUnlocked: false },

  // CHAPTER 3: THE CROWN (Sections 23-33) - Transcendent Discipline
  { id: 23, name: 'Pure Witness Consciousness', chapter: 'crown', description: 'Observing the observer: non-dual attentional absorption.', breathPatternId: 'coherence', attentionExercise: 'The Void', isUnlocked: false },
  { id: 24, name: 'Subtle Spine Illumination', chapter: 'crown', description: 'Moving focused energy mentally through all 33 vertebrae.', breathPatternId: 'alternate', attentionExercise: 'Dot Focus', isUnlocked: false },
  { id: 25, name: 'Vagal Brake Command', chapter: 'crown', description: 'Voluntary heart-rate downshifting in under 45 seconds.', breathPatternId: '478', attentionExercise: 'Breath Archer', isUnlocked: false },
  { id: 26, name: 'Sensory Deprivation State', chapter: 'crown', description: 'Retracting sensory awareness into the central core.', breathPatternId: 'box', attentionExercise: 'The Void', isUnlocked: false },
  { id: 27, name: 'Equanimity in Turbulence', chapter: 'crown', description: 'Maintaining smooth breath flow during intense physical hold.', breathPatternId: 'wimhof', attentionExercise: 'Dot Focus', isUnlocked: false },
  { id: 28, name: 'Spontaneous Flow State', chapter: 'crown', description: 'Effortless attention lock without exertion or strain.', breathPatternId: 'coherence', attentionExercise: 'Breath Archer', isUnlocked: false },
  { id: 29, name: 'Meta-Cognitive Vigilance', chapter: 'crown', description: 'Instant detection and release of micro-distractions within 100ms.', breathPatternId: 'box', attentionExercise: 'Thought Catcher', isUnlocked: false },
  { id: 30, name: 'Golden Sushumna Pillar', chapter: 'crown', description: 'Visualizing and sustaining the unified pillar of inner light.', breathPatternId: 'alternate', attentionExercise: 'The Void', isUnlocked: false },
  { id: 31, name: 'Samadhi Threshold', chapter: 'crown', description: 'Complete absorption where object and subject merge.', breathPatternId: 'coherence', attentionExercise: 'Dot Focus', isUnlocked: false },
  { id: 32, name: 'Indestructible Routine Armor', chapter: 'crown', description: 'Fusing meditative stillness with immediate routine action.', breathPatternId: 'box', attentionExercise: 'Breath Archer', isUnlocked: false },
  { id: 33, name: 'The Living Spine Sovereign', chapter: 'crown', description: 'All 33 vertebrae illuminated. Total sovereignty over attention.', breathPatternId: 'coherence', attentionExercise: 'The Void', isUnlocked: false },
];

export class SpineJourney {
  private sections: SpineSection[] = [...SPINE_SECTIONS_DATA];

  getSections(): SpineSection[] {
    return this.sections;
  }

  getSection(id: number): SpineSection | undefined {
    return this.sections.find((s) => s.id === id);
  }

  unlockNext(completedId: number, score: number): SpineSection | null {
    const current = this.sections.find((s) => s.id === completedId);
    if (current) {
      current.accuracyScore = score;
    }

    const next = this.sections.find((s) => s.id === completedId + 1);
    if (next) {
      next.isUnlocked = true;
      return next;
    }
    return null;
  }

  getUnlockedCount(): number {
    return this.sections.filter((s) => s.isUnlocked).length;
  }

  getProgressPercentage(): number {
    return Math.round((this.getUnlockedCount() / 33) * 100);
  }
}

export const spineJourney = new SpineJourney();
