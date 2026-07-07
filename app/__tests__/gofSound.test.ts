import { nextGofSoundIndex, resetGofSound } from '../src/components/gofSound';

describe('nextGofSoundIndex', () => {
  beforeEach(() => resetGofSound());

  it('reste dans [0, count)', () => {
    for (let i = 0; i < 200; i++) {
      const idx = nextGofSoundIndex(3, Math.random);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(3);
    }
  });

  it('ne répète jamais le même son deux fois de suite', () => {
    let prev = nextGofSoundIndex(3, Math.random);
    for (let i = 0; i < 500; i++) {
      const idx = nextGofSoundIndex(3, Math.random);
      expect(idx).not.toBe(prev);
      prev = idx;
    }
  });

  it("dévie même quand le hasard retombe toujours sur le même index (0)", () => {
    const alwaysZero = () => 0; // simule un Math.random dégénéré
    // Même bloqué sur 0, on ne doit pas rejouer le même son : 0 → 1 → 0 → 1…
    expect(nextGofSoundIndex(3, alwaysZero)).toBe(0);
    expect(nextGofSoundIndex(3, alwaysZero)).toBe(1);
    expect(nextGofSoundIndex(3, alwaysZero)).toBe(0);
    expect(nextGofSoundIndex(3, alwaysZero)).toBe(1);
  });

  it('couvre les 3 sons sur une longue série', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 300; i++) seen.add(nextGofSoundIndex(3, Math.random));
    expect(seen).toEqual(new Set([0, 1, 2]));
  });

  it('renvoie 0 quand il n’y a qu’un son', () => {
    expect(nextGofSoundIndex(1, Math.random)).toBe(0);
  });
});
