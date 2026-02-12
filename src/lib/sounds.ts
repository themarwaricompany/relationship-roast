type SoundName =
    | 'tap'
    | 'whoosh'
    | 'categoryChange'
    | 'quizComplete'
    | 'drumroll'
    | 'scoreReveal'
    | 'verdictAppear'
    | 'shareUnlock';

interface SoundConfig {
    src: string[];
    volume: number;
}

const SOUND_CONFIG: Record<SoundName, SoundConfig> = {
    tap: { src: ['/sounds/tap.webm', '/sounds/tap.mp3'], volume: 0.5 },
    whoosh: { src: ['/sounds/whoosh.webm', '/sounds/whoosh.mp3'], volume: 0.4 },
    categoryChange: { src: ['/sounds/category.webm', '/sounds/category.mp3'], volume: 0.5 },
    quizComplete: { src: ['/sounds/complete.webm', '/sounds/complete.mp3'], volume: 0.6 },
    drumroll: { src: ['/sounds/drumroll.webm', '/sounds/drumroll.mp3'], volume: 0.5 },
    scoreReveal: { src: ['/sounds/reveal.webm', '/sounds/reveal.mp3'], volume: 0.6 },
    verdictAppear: { src: ['/sounds/verdict.webm', '/sounds/verdict.mp3'], volume: 0.3 },
    shareUnlock: { src: ['/sounds/share.webm', '/sounds/share.mp3'], volume: 0.4 },
};

let muted = false;
let initialized = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sounds: Record<string, any> = {};

const MUTE_STORAGE_KEY = 'jkg-muted';

/**
 * Initialize Howler sounds lazily on first user interaction
 */
async function initSounds() {
    if (initialized || typeof window === 'undefined') return;

    try {
        const { Howl, Howler } = await import('howler');

        // Restore mute state
        const savedMute = localStorage.getItem(MUTE_STORAGE_KEY);
        if (savedMute === 'true') {
            muted = true;
            Howler.mute(true);
        }

        // Create Howl instances
        for (const [name, config] of Object.entries(SOUND_CONFIG)) {
            sounds[name] = new Howl({
                src: config.src,
                volume: config.volume,
                preload: true,
                html5: false,
                onloaderror: () => {
                    // Gracefully handle missing sound files
                    console.warn(`Sound file not found: ${name}`);
                },
            });
        }

        initialized = true;
    } catch (e) {
        console.warn('Sound initialization failed:', e);
    }
}

/**
 * Play a named sound
 */
export function playSound(name: SoundName) {
    if (muted || !initialized) return;

    const sound = sounds[name];
    if (sound && typeof sound.play === 'function') {
        try {
            sound.play();
        } catch {
            // Silently fail — sound is nice-to-have
        }
    }
}

/**
 * Toggle mute state
 */
export async function toggleMute(): Promise<boolean> {
    if (!initialized) await initSounds();

    muted = !muted;

    try {
        const { Howler } = await import('howler');
        Howler.mute(muted);
    } catch {
        // Continue without Howler
    }

    if (typeof window !== 'undefined') {
        localStorage.setItem(MUTE_STORAGE_KEY, String(muted));
    }

    return muted;
}

/**
 * Get current mute state
 */
export function isMuted(): boolean {
    if (typeof window !== 'undefined' && !initialized) {
        const savedMute = localStorage.getItem(MUTE_STORAGE_KEY);
        if (savedMute === 'true') return true;
    }
    return muted;
}

/**
 * Must be called on first user interaction (click/tap) to satisfy browser autoplay policy
 */
export async function activateSounds() {
    if (!initialized) {
        await initSounds();
    }
}

export type { SoundName };
