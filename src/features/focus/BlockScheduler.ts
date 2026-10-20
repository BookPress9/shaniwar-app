import { MonkBlock } from '../../types';

export class BlockScheduler {
  private blocks: MonkBlock[] = [
    {
      id: 'block_1',
      name: '⚡ Morning Command Block',
      startTime: '06:00',
      endTime: '08:00',
      blockedApps: ['com.instagram.android', 'com.google.android.youtube', 'com.zhiliaoapp.musically'],
      strictMode: true,
      isActive: true,
    },
    {
      id: 'block_2',
      name: '🔒 Deep Work Monastery',
      startTime: '09:00',
      endTime: '12:00',
      blockedApps: ['com.twitter.android', 'com.facebook.katana', 'com.reddit.frontpage'],
      strictMode: true,
      isActive: false,
    },
    {
      id: 'block_3',
      name: '🪷 Evening Sadhna Block',
      startTime: '20:00',
      endTime: '21:00',
      blockedApps: ['*'], // Total distraction blackout
      strictMode: true,
      isActive: true,
    },
  ];

  getBlocks(): MonkBlock[] {
    return [...this.blocks];
  }

  toggleBlock(id: string): MonkBlock | undefined {
    const block = this.blocks.find((b) => b.id === id);
    if (block) {
      block.isActive = !block.isActive;
      // TODO: Call native Accessibility / UsageStats blocking bridge
    }
    return block;
  }

  addBlock(name: string, startTime: string, endTime: string, blockedApps: string[]): MonkBlock {
    const newBlock: MonkBlock = {
      id: `block_${Date.now()}`,
      name,
      startTime,
      endTime,
      blockedApps,
      strictMode: true,
      isActive: true,
    };
    this.blocks.push(newBlock);
    return newBlock;
  }
}

export const blockScheduler = new BlockScheduler();
