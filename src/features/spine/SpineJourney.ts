import { SpineChapter, SpineRegion, SpineSection } from '../../types';

/**
 * 33-Vertebra Anatomical Mapping:
 * - Coccygeal (Co4): Stages 1–4
 * - Sacral (S5): Stages 5–9
 * - Lumbar (L5): Stages 10–14
 * - Thoracic (T12): Stages 15–26
 * - Cervical (C7): Stages 27–33
 * Total: 4 + 5 + 5 + 12 + 7 = 33 vertebrae.
 *
 * Traditional waypoints (thresholds):
 * Stage 1: Mūlādhāra (Base)
 * Stage 5: Svādhiṣṭhāna (Lower abdomen)
 * Stage 11: Maṇipūra (Solar plexus)
 * Stage 17: Anāhata (Heart)
 * Stage 24: Viśuddha (Throat)
 * Stage 29: Ājñā (Third eye)
 * Stage 33: Sahasrāra (Crown)
 */
export const SPINE_SECTIONS_DATA: SpineSection[] = [
  // COCCYGEAL REGION (Co4: Stages 1-4)
  {
    id: 1,
    name: 'Mūlādhāra Anchor (Co1)',
    chapter: 'root',
    region: 'COCCYGEAL',
    regionCode: 'Co1',
    chakraAnchor: 'Mūlādhāra (Base)',
    description: 'Grounding awareness at the base of the spine. Natural spontaneous breath without alteration.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-01',
    attentionExercise: 'Dot Focus',
    isUnlocked: true,
  },
  {
    id: 2,
    name: 'Perineal Stillness (Co2)',
    chapter: 'root',
    region: 'COCCYGEAL',
    regionCode: 'Co2',
    description: 'Noticing the natural pauses at the apex and base of breathing.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-01',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 3,
    name: 'Sushumna Root (Co3)',
    chapter: 'root',
    region: 'COCCYGEAL',
    regionCode: 'Co3',
    description: 'Centering subtle attention directly on the vertical spinal axis.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-02',
    attentionExercise: 'Sound Anchor',
    isUnlocked: false,
  },
  {
    id: 4,
    name: 'Coccyx Grounding (Co4)',
    chapter: 'root',
    region: 'COCCYGEAL',
    regionCode: 'Co4',
    description: 'Consolidating the four coccygeal vertebrae into an unwavering physical posture.',
    breathPatternId: '478',
    vbtTechniqueId: 'vbt-02',
    attentionExercise: 'Breath Archer',
    isUnlocked: false,
  },

  // SACRAL REGION (S5: Stages 5-9)
  {
    id: 5,
    name: 'Svādhiṣṭhāna Gateway (S1)',
    chapter: 'root',
    region: 'SACRAL',
    regionCode: 'S1',
    chakraAnchor: 'Svādhiṣṭhāna (Lower Abdomen)',
    description: 'Lower pelvic breath expansion. Releasing autonomic tension.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-03',
    attentionExercise: 'Dot Focus',
    isUnlocked: false,
  },
  {
    id: 6,
    name: 'Fluid Pelvic Ease (S2)',
    chapter: 'root',
    region: 'SACRAL',
    regionCode: 'S2',
    description: 'Nadi purification balancing sympathetic and parasympathetic currents.',
    breathPatternId: 'alternate',
    vbtTechniqueId: 'vbt-03',
    attentionExercise: 'Sound Anchor',
    isUnlocked: false,
  },
  {
    id: 7,
    name: 'Sacral Plate Stability (S3)',
    chapter: 'root',
    region: 'SACRAL',
    regionCode: 'S3',
    description: 'Savoring the decay of sound and inner silence after vocal hum.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-03',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 8,
    name: 'Pelvic Floor Release (S4)',
    chapter: 'root',
    region: 'SACRAL',
    regionCode: 'S4',
    description: 'Slow rhythmic vestibular swaying to calm the nervous system.',
    breathPatternId: '478',
    vbtTechniqueId: 'vbt-07',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 9,
    name: 'Sacral Arch Lock (S5)',
    chapter: 'root',
    region: 'SACRAL',
    regionCode: 'S5',
    description: 'Consolidation of the sacral segment. Holding inner stillness comfortably.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-02',
    attentionExercise: 'Thought Catcher',
    isUnlocked: false,
  },

  // LUMBAR REGION (L5: Stages 10-14)
  {
    id: 10,
    name: 'Lower Lumbar Axis (L5)',
    chapter: 'root',
    region: 'LUMBAR',
    regionCode: 'L5',
    description: 'Deep diaphragmatic breath expanding the lower back and lumbar vertebrae.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-04',
    attentionExercise: 'Sound Anchor',
    isUnlocked: false,
  },
  {
    id: 11,
    name: 'Maṇipūra Radiance (L4)',
    chapter: 'channel',
    region: 'LUMBAR',
    regionCode: 'L4',
    chakraAnchor: 'Maṇipūra (Solar Plexus)',
    description: 'Awakening metabolic and willful focus at the navel center.',
    breathPatternId: 'wimhof',
    vbtTechniqueId: 'vbt-04',
    attentionExercise: 'Dot Focus',
    isUnlocked: false,
  },
  {
    id: 12,
    name: 'Solar Vitality (L3)',
    chapter: 'channel',
    region: 'LUMBAR',
    regionCode: 'L3',
    description: 'Cyclic rhythmic breathing building internal heat and nervous system capacity.',
    breathPatternId: 'wimhof',
    vbtTechniqueId: 'vbt-04',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 13,
    name: 'Core Equilibrium (L2)',
    chapter: 'channel',
    region: 'LUMBAR',
    regionCode: 'L2',
    description: 'Resting attention on dappled light and non-demanding visual textures.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-06',
    attentionExercise: 'Breath Archer',
    isUnlocked: false,
  },
  {
    id: 14,
    name: 'Thoracolumbar Fulcrum (L1)',
    chapter: 'channel',
    region: 'LUMBAR',
    regionCode: 'L1',
    description: 'Tagging thoughts without emotional hook; witnessing the mind.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-09',
    attentionExercise: 'Thought Catcher',
    isUnlocked: false,
  },

  // THORACIC REGION (T12: Stages 15-26)
  {
    id: 15,
    name: 'Diaphragmatic Dome (T12)',
    chapter: 'channel',
    region: 'THORACIC',
    regionCode: 'T12',
    description: 'Somatic sweep of awareness through the lower ribcage and spine.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-09',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 16,
    name: 'Mid-Spine Extension (T11)',
    chapter: 'channel',
    region: 'THORACIC',
    regionCode: 'T11',
    description: 'Expanding awareness across 180 degrees while remaining centered.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-11',
    attentionExercise: 'Dot Focus',
    isUnlocked: false,
  },
  {
    id: 17,
    name: 'Anāhata Portal (T10)',
    chapter: 'channel',
    region: 'THORACIC',
    regionCode: 'T10',
    chakraAnchor: 'Anāhata (Heart)',
    description: 'Heart coherence resonance (0.1 Hz) synchronizing heart-rate variability.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-08',
    attentionExercise: 'Breath Archer',
    isUnlocked: false,
  },
  {
    id: 18,
    name: 'Cardiac Center (T9)',
    chapter: 'channel',
    region: 'THORACIC',
    regionCode: 'T9',
    description: 'Sustained presence within emotional intensity without reaction.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-12',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 19,
    name: 'Intercostal Spaciousness (T8)',
    chapter: 'channel',
    region: 'THORACIC',
    regionCode: 'T8',
    description: 'Immunity to auditory distractions; maintaining rhythm through noise.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-12',
    attentionExercise: 'Sound Anchor',
    isUnlocked: false,
  },
  {
    id: 20,
    name: 'Mid-Thoracic Axis (T7)',
    chapter: 'channel',
    region: 'THORACIC',
    regionCode: 'T7',
    description: 'Complete physical stillness detected through phone gyroscopic sensors.',
    breathPatternId: '478',
    vbtTechniqueId: 'vbt-02',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 21,
    name: 'Scapular Ease (T6)',
    chapter: 'channel',
    region: 'THORACIC',
    regionCode: 'T6',
    description: 'Dual anchor training: splitting awareness between breath and a visual locus.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-05',
    attentionExercise: 'Dot Focus',
    isUnlocked: false,
  },
  {
    id: 22,
    name: 'Upper Thoracic Pillar (T5)',
    chapter: 'channel',
    region: 'THORACIC',
    regionCode: 'T5',
    description: 'Sky gazing: unbroken upward gaze calming the optical nerve.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-05',
    attentionExercise: 'Breath Archer',
    isUnlocked: false,
  },
  {
    id: 23,
    name: 'Sub-Clavicular Flow (T4)',
    chapter: 'crown',
    region: 'THORACIC',
    regionCode: 'T4',
    description: 'Pure witness consciousness: observing thoughts without identification.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-09',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 24,
    name: 'Viśuddha Threshold (T3)',
    chapter: 'crown',
    region: 'THORACIC',
    regionCode: 'T3',
    chakraAnchor: 'Viśuddha (Throat)',
    description: 'Entering the throat threshold. Dissolving subtle inner chatter.',
    breathPatternId: 'alternate',
    vbtTechniqueId: 'vbt-03',
    attentionExercise: 'Sound Anchor',
    isUnlocked: false,
  },
  {
    id: 25,
    name: 'Upper Rib Cage Grace (T2)',
    chapter: 'crown',
    region: 'THORACIC',
    regionCode: 'T2',
    description: 'Voluntary vagal tone activation downshifting heart rate rapidly.',
    breathPatternId: '478',
    vbtTechniqueId: 'vbt-02',
    attentionExercise: 'Breath Archer',
    isUnlocked: false,
  },
  {
    id: 26,
    name: 'Thoracic Apex (T1)',
    chapter: 'crown',
    region: 'THORACIC',
    regionCode: 'T1',
    description: 'Retracting external sensory inputs inward to the spinal core.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-04',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },

  // CERVICAL REGION (C7: Stages 27-33)
  {
    id: 27,
    name: 'Cervicothoracic Gateway (C7)',
    chapter: 'crown',
    region: 'CERVICAL',
    regionCode: 'C7',
    description: 'Maintaining smooth breath flow during physical or mental turbulence.',
    breathPatternId: 'wimhof',
    vbtTechniqueId: 'vbt-12',
    attentionExercise: 'Dot Focus',
    isUnlocked: false,
  },
  {
    id: 28,
    name: 'Nuchal Ligament Stillness (C6)',
    chapter: 'crown',
    region: 'CERVICAL',
    regionCode: 'C6',
    description: 'Effortless attention lock without psychological strain or force.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-11',
    attentionExercise: 'Breath Archer',
    isUnlocked: false,
  },
  {
    id: 29,
    name: 'Ājñā Horizon (C5)',
    chapter: 'crown',
    region: 'CERVICAL',
    regionCode: 'C5',
    chakraAnchor: 'Ājñā (Third Eye)',
    description: 'Meta-cognitive vigilance: instant release of micro-distractions.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-09',
    attentionExercise: 'Thought Catcher',
    isUnlocked: false,
  },
  {
    id: 30,
    name: 'Cervical Spine Column (C4)',
    chapter: 'crown',
    region: 'CERVICAL',
    regionCode: 'C4',
    description: 'Illuminating the continuous golden sushumna channel from base to brow.',
    breathPatternId: 'alternate',
    vbtTechniqueId: 'vbt-01',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
  {
    id: 31,
    name: 'High Neck Equilibrium (C3)',
    chapter: 'crown',
    region: 'CERVICAL',
    regionCode: 'C3',
    description: 'Deep absorptive focus where subject and object merge into witnessing.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-02',
    attentionExercise: 'Dot Focus',
    isUnlocked: false,
  },
  {
    id: 32,
    name: 'Axis Vertebra (C2)',
    chapter: 'crown',
    region: 'CERVICAL',
    regionCode: 'C2',
    description: 'Fusing meditative stillness with immediate routine daily action.',
    breathPatternId: 'box',
    vbtTechniqueId: 'vbt-12',
    attentionExercise: 'Breath Archer',
    isUnlocked: false,
  },
  {
    id: 33,
    name: 'Atlas & Sahasrāra Culmination (C1)',
    chapter: 'crown',
    region: 'CERVICAL',
    regionCode: 'C1',
    chakraAnchor: 'Sahasrāra (Crown)',
    description: 'All 33 vertebrae illuminated. The crown culmination of the living spine.',
    breathPatternId: 'coherence',
    vbtTechniqueId: 'vbt-09',
    attentionExercise: 'The Void',
    isUnlocked: false,
  },
];

export class SpineJourney {
  private sections: SpineSection[] = [...SPINE_SECTIONS_DATA];

  getSections(): SpineSection[] {
    return this.sections;
  }

  getSection(id: number): SpineSection | undefined {
    return this.sections.find((s) => s.id === id);
  }

  getSectionsByRegion(region: SpineRegion): SpineSection[] {
    return this.sections.filter((s) => s.region === region);
  }

  getChakraWaypoints(): SpineSection[] {
    return this.sections.filter((s) => Boolean(s.chakraAnchor));
  }

  /**
   * Fair progression formula:
   * Current stage level is based on completed sessions + independent practice,
   * capped at 33. Missed days never cause regression.
   */
  calculateStageLevel(completedSessions: number, independentReports: number = 0): number {
    return Math.min(33, 1 + completedSessions + independentReports);
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
