import AsyncStorage from '@react-native-async-storage/async-storage';
import { HapticService } from './haptics';

export interface NaamJapaConfig {
  naam: string;
  japaCount: number;
  totalMalaRounds: number; // 1 Mala = 108 counts
  isPulseEnabled: boolean;
  selectedVisual: 'golden_flame' | 'sacred_lotus' | 'cosmic_void' | 'kundalini_coil';
}

const STORAGE_KEY = '@hybrid_monk_naam_japa_v1';

export const DEFAULT_NAAM_CONFIG: NaamJapaConfig = {
  naam: 'OM NAMAH SHIVAYA',
  japaCount: 0,
  totalMalaRounds: 0,
  isPulseEnabled: true,
  selectedVisual: 'golden_flame',
};

export const PRESET_NAAMS = [
  { name: 'OM NAMAH SHIVAYA', devanagari: 'ॐ नमः शिवाय', trad: 'Shiva / Supreme Consciousness' },
  { name: 'RAM', devanagari: 'राम', trad: 'Divine Light Within' },
  { name: 'WAHEGURU', devanagari: 'ਵਾਹਿਗੁਰੂ', trad: 'Wondrous Enlightener' },
  { name: 'RADHE KRISHNA', devanagari: 'राधे कृष्ण', trad: 'Divine Devotion & Joy' },
  { name: 'SO HUM', devanagari: 'सो ऽहम्', trad: 'I Am That (The Breath)' },
  { name: 'I AM', devanagari: 'अहम्', trad: 'Pure Witness Presence' },
  { name: 'ALLAHU AKBAR', devanagari: 'الله أكبر', trad: 'God is Greater' },
  { name: 'JESUS', devanagari: 'यीशु', trad: 'Sacred Heart & Grace' },
];

class NaamJapaService {
  private config: NaamJapaConfig = { ...DEFAULT_NAAM_CONFIG };
  private isLoaded = false;

  async getConfig(): Promise<NaamJapaConfig> {
    if (!this.isLoaded) await this.load();
    return { ...this.config };
  }

  async load(): Promise<NaamJapaConfig> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.config = { ...DEFAULT_NAAM_CONFIG, ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('[NaamJapaService] Load error:', e);
    }
    this.isLoaded = true;
    return { ...this.config };
  }

  async setNaam(naam: string): Promise<NaamJapaConfig> {
    this.config.naam = naam.trim().toUpperCase();
    await this.save();
    return { ...this.config };
  }

  async setVisual(visual: NaamJapaConfig['selectedVisual']): Promise<NaamJapaConfig> {
    this.config.selectedVisual = visual;
    await this.save();
    return { ...this.config };
  }

  async incrementJapa(): Promise<{ count: number; completedMala: boolean }> {
    this.config.japaCount += 1;
    let completedMala = false;

    // Check 108 Mala threshold
    if (this.config.japaCount % 108 === 0) {
      this.config.totalMalaRounds += 1;
      completedMala = true;
      await HapticService.successNotification();
    } else {
      await HapticService.naamJapaPulse();
    }

    await this.save();
    return { count: this.config.japaCount, completedMala };
  }

  async resetCount(): Promise<void> {
    this.config.japaCount = 0;
    await this.save();
  }

  private async save(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.warn('[NaamJapaService] Save error:', e);
    }
  }
}

export const naamJapaService = new NaamJapaService();
