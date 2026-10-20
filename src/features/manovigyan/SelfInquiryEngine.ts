import {
  InquiryDilemma,
  InquiryCategory,
  PsychologicalRadarProfile,
  DeconstructionItem,
} from '../../types';

export const INQUIRY_DILEMMAS: InquiryDilemma[] = [
  // 1. THE MASKS: Conditioned Persona vs. Organic Nature (KnowMe AI & Know Yourself DNA)
  {
    id: 'dilemma_1',
    category: 'masks',
    categoryTitle: 'The Social Mask',
    scenario:
      'You are in a high-stakes group setting and disagree completely with the prevailing opinion.',
    question: 'What is your immediate physiological and behavioral reflex?',
    options: [
      {
        id: 'opt_1a',
        text: 'Nod pleasantly or stay silent to keep harmony, feeling internal tension.',
        psychologicalLabel: 'Compensatory Accommodator',
        isConditionedPersona: true,
        insight:
          'This is NOT your authentic nature. It is a childhood survival mechanism designed to avoid rejection or conflict.',
      },
      {
        id: 'opt_1b',
        text: 'State your perspective grounded and neutral, without attachment to consensus.',
        psychologicalLabel: 'Grounded Self-Expression',
        isConditionedPersona: false,
        insight:
          'This is WHO YOU ARE. Organic stillness anchored in sovereign self-agency.',
      },
    ],
  },
  // 2. EGO DEFENSES: Stress & Disintegration Lines (EnneaApp DNA)
  {
    id: 'dilemma_2',
    category: 'stress_lines',
    categoryTitle: 'Ego Disintegration Under Pressure',
    scenario:
      'A project or vital commitment fails unexpectedly due to external circumstances.',
    question: 'Where does your mind immediately gravitate?',
    options: [
      {
        id: 'opt_2a',
        text: 'Obsessive micro-control, blame-seeking, or harsh self-flagellation.',
        psychologicalLabel: 'Neurotic Disintegration Armor',
        isConditionedPersona: true,
        insight:
          'This is NOT you. Under acute stress, your ego regresses along a disintegration line to re-establish the illusion of certainty.',
      },
      {
        id: 'opt_2b',
        text: 'Quiet observation of the facts, emotional processing without identity-collapse.',
        psychologicalLabel: 'The Witness Observer',
        isConditionedPersona: false,
        insight:
          'This is WHO YOU ARE. The unchanging awareness behind the rise and fall of external events.',
      },
    ],
  },
  // 3. LOCUS OF CONTROL: Internal Agency vs Borrowed Ambition (Reflectly DNA)
  {
    id: 'dilemma_3',
    category: 'locus_of_control',
    categoryTitle: 'Locus of Desire & Ambition',
    scenario:
      'You examine the primary ambition or goal consuming most of your waking thoughts.',
    question: 'If no one else in the world could ever know about your success, would you still chase it?',
    options: [
      {
        id: 'opt_3a',
        text: 'Honestly, the motivation would drastically diminish or feel hollow.',
        psychologicalLabel: 'Borrowed Social Proof Script',
        isConditionedPersona: true,
        insight:
          'This goal is NOT YOURS. It is an internalized social script borrowed to manufacture self-worth.',
      },
      {
        id: 'opt_3b',
        text: 'Yes. The process itself is intrinsic to my growth and daily joy.',
        psychologicalLabel: 'Autonomous Dharma',
        isConditionedPersona: false,
        insight:
          'This is WHO YOU ARE. Intrinsic alignment uncoupled from external validation metrics.',
      },
    ],
  },
  // 4. THE SHADOW: Blindspots & Repressed Impulses (Jungian / Know Yourself DNA)
  {
    id: 'dilemma_4',
    category: 'shadow',
    categoryTitle: 'The Shadow Mirror',
    scenario:
      'You observe someone who triggers an immediate, visceral irritation in you.',
    question: 'What is truly fueling that irritation beneath the surface?',
    options: [
      {
        id: 'opt_4a',
        text: 'A secret quality that I disown in myself or forbid myself from expressing.',
        psychologicalLabel: 'Integrated Shadow Recognition',
        isConditionedPersona: false,
        insight:
          'Recognizing projection is THE REAL YOU waking up. The mirror ceases to be an enemy and becomes illumination.',
      },
      {
        id: 'opt_4b',
        text: 'Rationalizing complete moral superiority and judging them harshly.',
        psychologicalLabel: 'Projective Ego Defense',
        isConditionedPersona: true,
        insight:
          'This is NOT you. It is your ego armor deflecting attention away from your own unintegrated shadow.',
      },
    ],
  },
];

export class SelfInquiryEngine {
  private dilemmas: InquiryDilemma[] = [...INQUIRY_DILEMMAS];
  private deconstructionLedger: DeconstructionItem[] = [
    {
      id: 'item_1',
      title: 'The People-Pleasing Shield',
      nature: 'conditioned_armor',
      description: 'Tendency to apologize or soften truth to preemptively pacify others.',
      origin: 'Conditioned Adaptation (Fear of abandonment)',
    },
    {
      id: 'item_2',
      title: 'Unshakable Witness Presence',
      nature: 'true_self',
      description: 'The calm space that notices thoughts without becoming entangled in them.',
      origin: 'Innate Sovereign Nature',
    },
    {
      id: 'item_3',
      title: 'Perfectionist Control Grid',
      nature: 'conditioned_armor',
      description: 'Belief that if everything is flawless, you cannot be harmed or judged.',
      origin: 'Stress Line Disintegration',
    },
    {
      id: 'item_4',
      title: 'Visceral Creative Intuition',
      nature: 'true_self',
      description: 'Immediate knowing before mental chatter begins rationalizing.',
      origin: 'Authentic Core Self',
    },
  ];

  private radarProfile: PsychologicalRadarProfile = {
    authenticity: 72,
    emotionalWitnessing: 68,
    internalAgency: 81,
    shadowIntegration: 59,
    stressGroundedness: 64,
    nonAttachment: 75,
  };

  getDilemmas(): InquiryDilemma[] {
    return this.dilemmas;
  }

  getDilemmasByCategory(cat: InquiryCategory): InquiryDilemma[] {
    return this.dilemmas.filter((d) => d.category === cat);
  }

  getDeconstructionLedger(): DeconstructionItem[] {
    return this.deconstructionLedger;
  }

  getRadarProfile(): PsychologicalRadarProfile {
    return { ...this.radarProfile };
  }

  recordChoice(dilemmaId: string, selectedOptionId: string): { isConditioned: boolean; insight: string } {
    const dilemma = this.dilemmas.find((d) => d.id === dilemmaId);
    if (!dilemma) return { isConditioned: false, insight: '' };

    const selected = dilemma.options.find((o) => o.id === selectedOptionId);
    if (!selected) return { isConditioned: false, insight: '' };

    if (selected.isConditionedPersona) {
      this.deconstructionLedger.unshift({
        id: `ledger_${Date.now()}`,
        title: selected.psychologicalLabel,
        nature: 'conditioned_armor',
        description: selected.text,
        origin: `${dilemma.categoryTitle} (Identified False Self)`,
      });
      // Adjust radar metrics towards awareness
      this.radarProfile.shadowIntegration = Math.min(100, this.radarProfile.shadowIntegration + 4);
    } else {
      this.deconstructionLedger.unshift({
        id: `ledger_${Date.now()}`,
        title: selected.psychologicalLabel,
        nature: 'true_self',
        description: selected.text,
        origin: 'Authentic Sovereign Core',
      });
      this.radarProfile.authenticity = Math.min(100, this.radarProfile.authenticity + 3);
      this.radarProfile.emotionalWitnessing = Math.min(100, this.radarProfile.emotionalWitnessing + 3);
    }

    return {
      isConditioned: selected.isConditionedPersona,
      insight: selected.insight,
    };
  }
}

export const selfInquiryEngine = new SelfInquiryEngine();
