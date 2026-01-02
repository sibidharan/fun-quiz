/**
 * Audio Manager for Fun Quiz
 * Handles all game audio using Web Audio API
 * Includes sound effects, mascot reactions, and background music
 */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.isMuted = false;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        this.currentMusic = null;
        this.currentTrackIndex = 0;
        this.isInitialized = false;
        this.musicContext = null;
        this.howlerMusic = null; // Howler.js music player

        // MP3 music tracks from Mixkit (royalty-free) - 27 variety tracks
        this.mp3Tracks = [
            // Original batch
            { name: 'playful', file: '/audio/music/playful.mp3' },
            { name: 'comical', file: '/audio/music/comical.mp3' },
            { name: 'just_kidding', file: '/audio/music/just_kidding.mp3' },
            { name: 'playground_fun', file: '/audio/music/playground_fun.mp3' },
            { name: 'keep_smiling', file: '/audio/music/keep_smiling.mp3' },
            { name: 'happy_times', file: '/audio/music/happy_times.mp3' },
            { name: 'smile', file: '/audio/music/smile.mp3' },
            { name: 'classical_vibes', file: '/audio/music/classical_vibes.mp3' },
            // Batch 2 - Cartoon & Fun
            { name: 'funny_cartoon', file: '/audio/music/funny_cartoon.mp3' },
            { name: 'cheerful_day', file: '/audio/music/cheerful_day.mp3' },
            { name: 'happy_adventure', file: '/audio/music/happy_adventure.mp3' },
            { name: 'playful_melody', file: '/audio/music/playful_melody.mp3' },
            { name: 'sunny_morning', file: '/audio/music/sunny_morning.mp3' },
            { name: 'joyful_bounce', file: '/audio/music/joyful_bounce.mp3' },
            // Batch 3 - Quirky & Upbeat
            { name: 'quirky_fun', file: '/audio/music/quirky_fun.mp3' },
            { name: 'bouncy_beat', file: '/audio/music/bouncy_beat.mp3' },
            { name: 'whimsical', file: '/audio/music/whimsical.mp3' },
            { name: 'lighthearted', file: '/audio/music/lighthearted.mp3' },
            { name: 'carefree', file: '/audio/music/carefree.mp3' },
            { name: 'uplifting', file: '/audio/music/uplifting.mp3' },
            // Batch 4 - Game & Adventure
            { name: 'fun_game', file: '/audio/music/fun_game.mp3' },
            { name: 'adventure_time', file: '/audio/music/adventure_time.mp3' },
            { name: 'happy_clappy', file: '/audio/music/happy_clappy.mp3' },
            { name: 'silly_walk', file: '/audio/music/silly_walk.mp3' },
            { name: 'cartoon_chase', file: '/audio/music/cartoon_chase.mp3' },
            { name: 'magic_spell', file: '/audio/music/magic_spell.mp3' }
        ];

        // Fallback synthesized tracks (if MP3s fail to load)
        this.quizTracks = [
            'quizUpbeat', 'quizFunky', 'quizAdventure', 'quizPlayful', 'quizExciting',
            'quizRetro', 'quizDisco', 'quizMystery', 'quizTropical', 'quizRock',
            'quizJazzy', 'quizElectronic', 'quizOrchestral', 'quizCountry', 'quizReggae'
        ];

        // Use MP3 by default, fall back to synth if Howler not available
        this.useMP3 = typeof Howl !== 'undefined';

        // Check for saved preferences
        this.loadPreferences();
    }

    /**
     * Initialize all audio assets
     * Must be called after user interaction (browser policy)
     */
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;
        console.log('AudioManager initialized with', this.quizTracks.length, 'music tracks');
    }

    // ==========================================
    // Playback Methods
    // ==========================================

    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    play(soundName) {
        if (this.isMuted) return;

        const ctx = new (window.AudioContext || window.webkitAudioContext)();

        switch(soundName) {
            // UI Sounds
            case 'click': this.playClick(ctx); break;
            case 'hover': this.playHover(ctx); break;
            case 'whoosh': this.playWhoosh(ctx); break;

            // Answer Sounds
            case 'correct': this.playCorrect(ctx); break;
            case 'wrong': this.playWrong(ctx); break;

            // Celebration Sounds
            case 'celebration': this.playCelebration(ctx); break;
            case 'levelUp': this.playLevelUp(ctx); break;

            // Timer Sounds
            case 'tick': this.playTick(ctx); break;
            case 'timerWarning': this.playTimerWarning(ctx); break;

            // Game State Sounds
            case 'gameOver': this.playGameOver(ctx); break;

            // Mascot Happy Sounds
            case 'mascotYay': this.playMascotYay(ctx); break;
            case 'mascotWoohoo': this.playMascotWoohoo(ctx); break;
            case 'mascotGiggle': this.playMascotGiggle(ctx); break;
            case 'mascotCheer': this.playMascotCheer(ctx); break;

            // Mascot Sad Sounds
            case 'mascotAww': this.playMascotAww(ctx); break;
            case 'mascotOops': this.playMascotOops(ctx); break;
            case 'mascotSigh': this.playMascotSigh(ctx); break;
            case 'mascotUhOh': this.playMascotUhOh(ctx); break;

            // Mascot Thinking/Idle Sounds
            case 'mascotHmm': this.playMascotHmm(ctx); break;
            case 'mascotCurious': this.playMascotCurious(ctx); break;

            // Bonus Sounds
            case 'pop': this.playPop(ctx); break;
            case 'sparkle': this.playSparkle(ctx); break;
            case 'boing': this.playBoing(ctx); break;
            case 'ding': this.playDing(ctx); break;
        }
    }

    /**
     * Play a random mascot happy reaction
     */
    playMascotHappy() {
        const sounds = ['mascotYay', 'mascotWoohoo', 'mascotGiggle', 'mascotCheer'];
        this.play(sounds[Math.floor(Math.random() * sounds.length)]);
    }

    /**
     * Play a random mascot sad reaction
     */
    playMascotSad() {
        const sounds = ['mascotAww', 'mascotOops', 'mascotSigh', 'mascotUhOh'];
        this.play(sounds[Math.floor(Math.random() * sounds.length)]);
    }

    // ==========================================
    // UI Sound Effects
    // ==========================================

    playClick(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(this.sfxVolume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    }

    playHover(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);

        gain.gain.setValueAtTime(this.sfxVolume * 0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.03);
    }

    playWhoosh(ctx) {
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        noise.buffer = buffer;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(100, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);
        filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.3);
        filter.Q.setValueAtTime(1, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + 0.3);
    }

    // ==========================================
    // Answer Sound Effects
    // ==========================================

    playCorrect(ctx) {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            const startTime = ctx.currentTime + (i * 0.08);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

            osc.start(startTime);
            osc.stop(startTime + 0.15);
        });
    }

    playWrong(ctx) {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';

        osc1.frequency.setValueAtTime(200, ctx.currentTime);
        osc1.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.3);

        osc2.frequency.setValueAtTime(203, ctx.currentTime);
        osc2.frequency.linearRampToValueAtTime(153, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(this.sfxVolume * 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.35);
        osc2.stop(ctx.currentTime + 0.35);
    }

    // ==========================================
    // Celebration Sound Effects
    // ==========================================

    playCelebration(ctx) {
        const melody = [
            {freq: 523.25, start: 0, dur: 0.15},
            {freq: 659.25, start: 0.1, dur: 0.15},
            {freq: 783.99, start: 0.2, dur: 0.15},
            {freq: 1046.50, start: 0.3, dur: 0.3},
            {freq: 783.99, start: 0.35, dur: 0.25},
            {freq: 1046.50, start: 0.5, dur: 0.4},
        ];

        melody.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.freq, ctx.currentTime);

            const startTime = ctx.currentTime + note.start;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, startTime + 0.02);
            gain.gain.setValueAtTime(this.sfxVolume * 0.2, startTime + note.dur * 0.7);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.dur);

            osc.start(startTime);
            osc.stop(startTime + note.dur);
        });
    }

    playLevelUp(ctx) {
        const notes = [392, 523.25, 659.25, 783.99, 1046.50, 1318.51];

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            const startTime = ctx.currentTime + (i * 0.06);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

            osc.start(startTime);
            osc.stop(startTime + 0.2);
        });
    }

    // ==========================================
    // Timer Sound Effects
    // ==========================================

    playTick(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);

        gain.gain.setValueAtTime(this.sfxVolume * 0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.03);
    }

    playTimerWarning(ctx) {
        [0, 0.15].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(880, ctx.currentTime + delay);

            gain.gain.setValueAtTime(this.sfxVolume * 0.15, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.1);

            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.1);
        });
    }

    // ==========================================
    // Game State Sound Effects
    // ==========================================

    playGameOver(ctx) {
        const notes = [659.25, 523.25, 392];

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            const startTime = ctx.currentTime + (i * 0.2);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, startTime + 0.05);
            gain.gain.setValueAtTime(this.sfxVolume * 0.2, startTime + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.35);

            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    }

    // ==========================================
    // Mascot Happy Reactions
    // ==========================================

    // "Yay!" - Excited ascending chirps
    playMascotYay(ctx) {
        const chirps = [800, 1000, 1200, 1400, 1600];

        chirps.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const startTime = ctx.currentTime + (i * 0.06);

            osc.frequency.setValueAtTime(freq, startTime);
            osc.frequency.setValueAtTime(freq * 1.1, startTime + 0.03);
            osc.frequency.setValueAtTime(freq, startTime + 0.05);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);

            osc.start(startTime);
            osc.stop(startTime + 0.08);
        });
    }

    // "Woohoo!" - Sliding celebratory sound
    playMascotWoohoo(ctx) {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc2.type = 'triangle';

        // "Woo" - rising
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);

        // "hoo" - high sustained
        osc.frequency.setValueAtTime(900, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.35);

        osc2.frequency.setValueAtTime(800, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.15);
        osc2.frequency.setValueAtTime(1800, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(this.sfxVolume * 0.25, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
    }

    // Giggle - Bouncy rapid notes
    playMascotGiggle(ctx) {
        const giggles = [
            {freq: 600, time: 0},
            {freq: 700, time: 0.05},
            {freq: 650, time: 0.1},
            {freq: 750, time: 0.15},
            {freq: 700, time: 0.2},
            {freq: 800, time: 0.25},
            {freq: 900, time: 0.3}
        ];

        giggles.forEach(g => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const startTime = ctx.currentTime + g.time;

            osc.frequency.setValueAtTime(g.freq, startTime);
            osc.frequency.setValueAtTime(g.freq * 1.15, startTime + 0.02);
            osc.frequency.setValueAtTime(g.freq, startTime + 0.04);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.15, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);

            osc.start(startTime);
            osc.stop(startTime + 0.05);
        });
    }

    // Cheer - Multi-layered celebration
    playMascotCheer(ctx) {
        // Base cheer tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(523, ctx.currentTime);
        osc1.frequency.linearRampToValueAtTime(784, ctx.currentTime + 0.2);
        osc1.frequency.setValueAtTime(1047, ctx.currentTime + 0.2);
        osc1.frequency.linearRampToValueAtTime(1318, ctx.currentTime + 0.4);

        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, ctx.currentTime + 0.05);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.5);

        // Sparkle overlay
        for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const startTime = ctx.currentTime + (i * 0.08);
            const freq = 1500 + (i * 200);

            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

            osc.start(startTime);
            osc.stop(startTime + 0.1);
        }
    }

    // ==========================================
    // Mascot Sad Reactions
    // ==========================================

    // "Aww" - Sympathetic descending tone
    playMascotAww(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(this.sfxVolume * 0.15, ctx.currentTime + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    }

    // "Oops!" - Surprised error sound
    playMascotOops(ctx) {
        // "Oo" part
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(400, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.08);
        osc1.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.2);

        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, ctx.currentTime + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.25);

        // "ps" part - short burst
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain2 = ctx.createGain();

        noise.buffer = buffer;
        noise.connect(filter);
        filter.connect(gain2);
        gain2.connect(ctx.destination);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime + 0.15);

        gain2.gain.setValueAtTime(0, ctx.currentTime + 0.15);
        gain2.gain.linearRampToValueAtTime(this.sfxVolume * 0.15, ctx.currentTime + 0.16);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        noise.start(ctx.currentTime + 0.15);
        noise.stop(ctx.currentTime + 0.2);
    }

    // Sigh - Tired/disappointed exhale
    playMascotSigh(ctx) {
        const bufferSize = ctx.sampleRate * 0.6;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        noise.buffer = buffer;
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.4);
        filter.Q.setValueAtTime(2, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.15, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + 0.6);

        // Add tonal element
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);

        oscGain.gain.setValueAtTime(0, ctx.currentTime);
        oscGain.gain.linearRampToValueAtTime(this.sfxVolume * 0.08, ctx.currentTime + 0.1);
        oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    }

    // "Uh oh" - Warning/concern sound
    playMascotUhOh(ctx) {
        // "Uh" - lower tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(300, ctx.currentTime);
        osc1.frequency.setValueAtTime(280, ctx.currentTime + 0.1);

        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, ctx.currentTime + 0.02);
        gain1.gain.setValueAtTime(this.sfxVolume * 0.15, ctx.currentTime + 0.1);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.15);

        // "oh" - descending tone
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(350, ctx.currentTime + 0.18);
        osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);

        gain2.gain.setValueAtTime(0, ctx.currentTime + 0.18);
        gain2.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, ctx.currentTime + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

        osc2.start(ctx.currentTime + 0.18);
        osc2.stop(ctx.currentTime + 0.45);
    }

    // ==========================================
    // Mascot Thinking/Idle Sounds
    // ==========================================

    // "Hmm" - Thinking sound
    playMascotHmm(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(280, ctx.currentTime + 0.2);
        osc.frequency.linearRampToValueAtTime(260, ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.12, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(this.sfxVolume * 0.1, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    }

    // Curious - Question mark sound
    playMascotCurious(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(650, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.15, ctx.currentTime + 0.03);
        gain.gain.setValueAtTime(this.sfxVolume * 0.12, ctx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    }

    // ==========================================
    // Bonus Sound Effects
    // ==========================================

    playPop(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(this.sfxVolume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    }

    playSparkle(ctx) {
        for (let i = 0; i < 4; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const freq = 2000 + (i * 400) + (Math.random() * 200);
            const startTime = ctx.currentTime + (i * 0.05);

            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);

            osc.start(startTime);
            osc.stop(startTime + 0.1);
        }
    }

    playBoing(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.35);
    }

    playDing(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, ctx.currentTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);

        // Harmonic
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2400, ctx.currentTime);

        gain2.gain.setValueAtTime(0, ctx.currentTime);
        gain2.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, ctx.currentTime + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc2.start(ctx.currentTime);
        osc2.stop(ctx.currentTime + 0.3);
    }

    // ==========================================
    // Background Music Control
    // ==========================================

    /**
     * Play background music
     * @param {string} trackName - Name of the music track ('quiz', 'menu', 'victory')
     */
    playMusic(trackName) {
        if (this.currentMusic) {
            this.stopMusic();
        }

        this.currentMusic = trackName;

        // For quiz music, try MP3 first, then fall back to synthesized
        if (trackName === 'quiz') {
            if (this.useMP3 && this.mp3Tracks.length > 0) {
                this.playMP3Music();
                return;
            }
            this.currentTrackIndex = Math.floor(Math.random() * this.quizTracks.length);
        }

        this.startMusicLoop(trackName);
    }

    /**
     * Play MP3 music using Howler.js
     */
    playMP3Music() {
        if (this.isMuted) return;

        // Pick a random track
        const trackIndex = Math.floor(Math.random() * this.mp3Tracks.length);
        const track = this.mp3Tracks[trackIndex];

        console.log('Playing MP3 track:', track.name);

        // Stop any existing Howler music
        if (this.howlerMusic) {
            this.howlerMusic.unload();
        }

        this.howlerMusic = new Howl({
            src: [track.file],
            volume: this.musicVolume,
            loop: false, // We'll handle track rotation ourselves
            html5: true, // Use HTML5 audio for better streaming
            onend: () => {
                // When track ends, play a different random track
                if (this.currentMusic === 'quiz' && !this.isMuted) {
                    this.playMP3Music();
                }
            },
            onloaderror: (id, error) => {
                console.warn('Failed to load MP3, falling back to synth music:', error);
                this.useMP3 = false;
                this.startMusicLoop('quiz');
            }
        });

        this.howlerMusic.play();
    }

    /**
     * Start a looping music track using Web Audio (synthesized fallback)
     */
    startMusicLoop(trackName) {
        if (this.isMuted || !this.currentMusic) return;

        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.musicContext = ctx;

        const playLoop = () => {
            if (this.isMuted || this.currentMusic !== trackName) {
                ctx.close();
                return;
            }

            switch(trackName) {
                case 'quiz':
                    this.playQuizMusicVariant(ctx, playLoop);
                    break;
                case 'menu':
                    this.playMenuMusicLoop(ctx, playLoop);
                    break;
                case 'victory':
                    this.playVictoryMusic(ctx);
                    break;
            }
        };

        playLoop();
    }

    /**
     * Play quiz music with variety - rotates through 15 different tracks
     */
    playQuizMusicVariant(ctx, callback) {
        const track = this.quizTracks[this.currentTrackIndex];

        switch(track) {
            case 'quizUpbeat':
                this.playQuizUpbeat(ctx, callback);
                break;
            case 'quizFunky':
                this.playQuizFunky(ctx, callback);
                break;
            case 'quizAdventure':
                this.playQuizAdventure(ctx, callback);
                break;
            case 'quizPlayful':
                this.playQuizPlayful(ctx, callback);
                break;
            case 'quizExciting':
                this.playQuizExciting(ctx, callback);
                break;
            case 'quizRetro':
                this.playQuizRetro(ctx, callback);
                break;
            case 'quizDisco':
                this.playQuizDisco(ctx, callback);
                break;
            case 'quizMystery':
                this.playQuizMystery(ctx, callback);
                break;
            case 'quizTropical':
                this.playQuizTropical(ctx, callback);
                break;
            case 'quizRock':
                this.playQuizRock(ctx, callback);
                break;
            case 'quizJazzy':
                this.playQuizJazzy(ctx, callback);
                break;
            case 'quizElectronic':
                this.playQuizElectronic(ctx, callback);
                break;
            case 'quizOrchestral':
                this.playQuizOrchestral(ctx, callback);
                break;
            case 'quizCountry':
                this.playQuizCountry(ctx, callback);
                break;
            case 'quizReggae':
                this.playQuizReggae(ctx, callback);
                break;
            default:
                this.playQuizUpbeat(ctx, callback);
        }

        // Rotate to next track for next loop
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.quizTracks.length;
    }

    // Track 1: Upbeat (Original)
    playQuizUpbeat(ctx, callback) {
        const tempo = 120;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Bass line - C major progression
        const bassNotes = [130.81, 146.83, 164.81, 146.83];
        bassNotes.forEach((freq, i) => {
            for (let repeat = 0; repeat < 4; repeat++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                const startTime = ctx.currentTime + (repeat * 4 + i) * beatDuration;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.15, startTime + 0.02);
                gain.gain.setValueAtTime(this.musicVolume * 0.15, startTime + beatDuration * 0.8);
                gain.gain.linearRampToValueAtTime(0, startTime + beatDuration);

                osc.start(startTime);
                osc.stop(startTime + beatDuration);
            }
        });

        // Melody
        const melody = [523.25, 587.33, 659.25, 587.33, 659.25, 783.99, 659.25, 523.25,
                       587.33, 659.25, 523.25, 440, 523.25, 587.33, 523.25, 440];

        melody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            const startTime = ctx.currentTime + i * beatDuration;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, startTime + 0.02);
            gain.gain.setValueAtTime(this.musicVolume * 0.08, startTime + beatDuration * 0.7);
            gain.gain.linearRampToValueAtTime(0, startTime + beatDuration * 0.95);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 2: Funky - Syncopated rhythm with bass slaps
    playQuizFunky(ctx, callback) {
        const tempo = 110;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Funky bass line with syncopation
        const bassPattern = [
            {freq: 98, time: 0}, {freq: 98, time: 0.75}, {freq: 110, time: 1.5},
            {freq: 98, time: 2}, {freq: 123, time: 2.5}, {freq: 98, time: 3},
            {freq: 98, time: 4}, {freq: 98, time: 4.75}, {freq: 131, time: 5.5},
            {freq: 98, time: 6}, {freq: 110, time: 6.5}, {freq: 98, time: 7}
        ];

        bassPattern.forEach(note => {
            for (let repeat = 0; repeat < 2; repeat++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sawtooth';
                const startTime = ctx.currentTime + (repeat * 8 + note.time) * beatDuration;
                osc.frequency.setValueAtTime(note.freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.12, startTime + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.4);

                osc.start(startTime);
                osc.stop(startTime + beatDuration * 0.5);
            }
        });

        // Funky melody with slides
        const funkMelody = [392, 440, 523, 440, 392, 349, 392, 440,
                          523, 587, 523, 440, 392, 440, 523, 659];

        funkMelody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'square';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq * 0.98, startTime);
            osc.frequency.linearRampToValueAtTime(freq, startTime + 0.05);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.06, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.7);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 3: Adventure - Epic feel with rising progressions
    playQuizAdventure(ctx, callback) {
        const tempo = 100;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Power chord bass
        const powerChords = [
            {root: 110, fifth: 165, time: 0, dur: 2},
            {root: 130.81, fifth: 196, time: 2, dur: 2},
            {root: 146.83, fifth: 220, time: 4, dur: 2},
            {root: 164.81, fifth: 247, time: 6, dur: 2},
            {root: 146.83, fifth: 220, time: 8, dur: 2},
            {root: 130.81, fifth: 196, time: 10, dur: 2},
            {root: 110, fifth: 165, time: 12, dur: 4}
        ];

        powerChords.forEach(chord => {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';

            const startTime = ctx.currentTime + chord.time * beatDuration;
            osc1.frequency.setValueAtTime(chord.root, startTime);
            osc2.frequency.setValueAtTime(chord.fifth, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.08, startTime + 0.05);
            gain.gain.setValueAtTime(this.musicVolume * 0.06, startTime + chord.dur * beatDuration * 0.8);
            gain.gain.linearRampToValueAtTime(0, startTime + chord.dur * beatDuration);

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + chord.dur * beatDuration);
            osc2.stop(startTime + chord.dur * beatDuration);
        });

        // Epic melody
        const epicMelody = [330, 392, 440, 523, 587, 523, 440, 392,
                          330, 392, 523, 659, 784, 659, 523, 440];

        epicMelody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.12, startTime + 0.03);
            gain.gain.setValueAtTime(this.musicVolume * 0.1, startTime + beatDuration * 0.6);
            gain.gain.linearRampToValueAtTime(0, startTime + beatDuration * 0.95);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 4: Playful - Bouncy and light with staccato
    playQuizPlayful(ctx, callback) {
        const tempo = 140;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Bouncy bass - short staccato notes
        const bouncyBass = [196, 0, 196, 220, 0, 220, 247, 0, 247, 262, 0, 262, 247, 0, 220, 196];

        bouncyBass.forEach((freq, i) => {
            if (freq === 0) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.15, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.3);

            osc.start(startTime);
            osc.stop(startTime + beatDuration * 0.35);
        });

        // Playful melody with jumps
        const playfulMelody = [784, 659, 784, 880, 784, 659, 523, 659,
                              784, 880, 1047, 880, 784, 659, 523, 392];

        playfulMelody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.08, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.5);

            osc.start(startTime);
            osc.stop(startTime + beatDuration * 0.55);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 5: Exciting - Fast-paced with energy
    playQuizExciting(ctx, callback) {
        const tempo = 150;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Driving bass
        const drivingBass = [110, 110, 130.81, 130.81, 146.83, 146.83, 164.81, 164.81];

        drivingBass.forEach((freq, i) => {
            for (let r = 0; r < 2; r++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'square';
                const startTime = ctx.currentTime + (r * 8 + i) * beatDuration;
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, startTime + 0.01);
                gain.gain.setValueAtTime(this.musicVolume * 0.08, startTime + beatDuration * 0.7);
                gain.gain.linearRampToValueAtTime(0, startTime + beatDuration * 0.9);

                osc.start(startTime);
                osc.stop(startTime + beatDuration);
            }
        });

        // High energy arpeggios
        const arpeggios = [
            523, 659, 784, 1047, 659, 784, 1047, 1319,
            587, 740, 880, 1175, 740, 880, 1175, 1480
        ];

        arpeggios.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sawtooth';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.05, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.6);

            osc.start(startTime);
            osc.stop(startTime + beatDuration * 0.65);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 6: Retro - 8-bit chiptune style
    playQuizRetro(ctx, callback) {
        const tempo = 130;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Chiptune bass with quick pulses
        const retroBass = [110, 110, 138.59, 138.59, 164.81, 164.81, 138.59, 138.59];

        retroBass.forEach((freq, i) => {
            for (let r = 0; r < 2; r++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'square';
                const startTime = ctx.currentTime + (r * 8 + i) * beatDuration;
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, startTime + 0.01);
                gain.gain.setValueAtTime(this.musicVolume * 0.08, startTime + beatDuration * 0.6);
                gain.gain.linearRampToValueAtTime(0, startTime + beatDuration * 0.8);

                osc.start(startTime);
                osc.stop(startTime + beatDuration);
            }
        });

        // 8-bit melody with arpeggios
        const retroMelody = [523, 659, 784, 659, 523, 392, 523, 659,
                            698, 784, 880, 784, 698, 659, 523, 440];

        retroMelody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'square';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);
            // Add vibrato
            osc.frequency.setValueAtTime(freq * 1.02, startTime + beatDuration * 0.3);
            osc.frequency.setValueAtTime(freq, startTime + beatDuration * 0.5);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.08, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.85);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 7: Disco - Groovy with four-on-the-floor beat feel
    playQuizDisco(ctx, callback) {
        const tempo = 120;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Disco bass - octave jumps
        const discoBass = [
            {freq: 98, time: 0}, {freq: 196, time: 0.5},
            {freq: 110, time: 1}, {freq: 220, time: 1.5},
            {freq: 123, time: 2}, {freq: 247, time: 2.5},
            {freq: 110, time: 3}, {freq: 220, time: 3.5}
        ];

        discoBass.forEach(note => {
            for (let r = 0; r < 4; r++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'triangle';
                const startTime = ctx.currentTime + (r * 4 + note.time) * beatDuration;
                osc.frequency.setValueAtTime(note.freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.15, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.45);

                osc.start(startTime);
                osc.stop(startTime + beatDuration * 0.5);
            }
        });

        // Funky string stabs
        const discoStrings = [523, 659, 784, 1047, 880, 784, 659, 523,
                             587, 698, 880, 1175, 987, 880, 698, 587];

        discoStrings.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sawtooth';
            osc2.type = 'sawtooth';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);
            osc2.frequency.setValueAtTime(freq * 1.005, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.05, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.4);

            osc.start(startTime);
            osc2.start(startTime);
            osc.stop(startTime + beatDuration * 0.45);
            osc2.stop(startTime + beatDuration * 0.45);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 8: Mystery - Suspenseful and intriguing
    playQuizMystery(ctx, callback) {
        const tempo = 90;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Mysterious drone bass
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(82.41, ctx.currentTime);
        osc1.frequency.linearRampToValueAtTime(87.31, ctx.currentTime + loopDuration / 2);
        osc1.frequency.linearRampToValueAtTime(82.41, ctx.currentTime + loopDuration);

        gain1.gain.setValueAtTime(0, ctx.currentTime);
        gain1.gain.linearRampToValueAtTime(this.musicVolume * 0.12, ctx.currentTime + 0.5);
        gain1.gain.setValueAtTime(this.musicVolume * 0.1, ctx.currentTime + loopDuration - 0.5);
        gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + loopDuration);

        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + loopDuration);

        // Mysterious melody - minor key
        const mysteryMelody = [329.63, 349.23, 329.63, 293.66, 329.63, 392, 349.23, 329.63,
                              311.13, 329.63, 349.23, 392, 440, 392, 349.23, 293.66];

        mysteryMelody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.08, startTime + 0.05);
            gain.gain.setValueAtTime(this.musicVolume * 0.06, startTime + beatDuration * 0.7);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.95);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 9: Tropical - Caribbean steel drum vibes
    playQuizTropical(ctx, callback) {
        const tempo = 115;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Reggae-style bass
        const tropicalBass = [130.81, 0, 130.81, 146.83, 0, 164.81, 0, 146.83];

        tropicalBass.forEach((freq, i) => {
            if (freq === 0) return;
            for (let r = 0; r < 2; r++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                const startTime = ctx.currentTime + (r * 8 + i) * beatDuration;
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.15, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.5);

                osc.start(startTime);
                osc.stop(startTime + beatDuration * 0.55);
            }
        });

        // Steel drum-like melody (bright, metallic)
        const steelDrum = [784, 880, 1047, 880, 784, 659, 784, 880,
                          1047, 1175, 1047, 880, 784, 880, 1047, 1175];

        steelDrum.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc2.type = 'triangle';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);
            osc2.frequency.setValueAtTime(freq * 2, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.35);

            osc.start(startTime);
            osc2.start(startTime);
            osc.stop(startTime + beatDuration * 0.4);
            osc2.stop(startTime + beatDuration * 0.4);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 10: Rock - Driving guitar riffs
    playQuizRock(ctx, callback) {
        const tempo = 135;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Power chord progression (E-A-D-A)
        const powerChords = [
            {root: 82.41, fifth: 123.47, time: 0, dur: 4},
            {root: 110, fifth: 164.81, time: 4, dur: 4},
            {root: 146.83, fifth: 220, time: 8, dur: 4},
            {root: 110, fifth: 164.81, time: 12, dur: 4}
        ];

        powerChords.forEach(chord => {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const distGain = ctx.createGain();
            const gain = ctx.createGain();

            osc1.connect(distGain);
            osc2.connect(distGain);
            distGain.connect(gain);
            gain.connect(ctx.destination);

            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';

            const startTime = ctx.currentTime + chord.time * beatDuration;
            osc1.frequency.setValueAtTime(chord.root, startTime);
            osc2.frequency.setValueAtTime(chord.fifth, startTime);

            distGain.gain.setValueAtTime(1.5, startTime);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, startTime + 0.02);
            gain.gain.setValueAtTime(this.musicVolume * 0.08, startTime + chord.dur * beatDuration * 0.9);
            gain.gain.linearRampToValueAtTime(0, startTime + chord.dur * beatDuration);

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + chord.dur * beatDuration);
            osc2.stop(startTime + chord.dur * beatDuration);
        });

        // Lead guitar riff
        const rockRiff = [329.63, 392, 440, 392, 329.63, 293.66, 329.63, 392,
                         440, 493.88, 523.25, 493.88, 440, 392, 329.63, 293.66];

        rockRiff.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sawtooth';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);
            // Bend up
            osc.frequency.linearRampToValueAtTime(freq * 1.05, startTime + beatDuration * 0.3);
            osc.frequency.linearRampToValueAtTime(freq, startTime + beatDuration * 0.5);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.07, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.8);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 11: Jazzy - Smooth jazz with swing feel
    playQuizJazzy(ctx, callback) {
        const tempo = 105;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Walking bass line
        const walkingBass = [130.81, 146.83, 164.81, 174.61, 196, 174.61, 164.81, 146.83,
                            130.81, 123.47, 110, 103.83, 98, 110, 123.47, 130.81];

        walkingBass.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.12, startTime + 0.03);
            gain.gain.setValueAtTime(this.musicVolume * 0.1, startTime + beatDuration * 0.7);
            gain.gain.linearRampToValueAtTime(0, startTime + beatDuration * 0.95);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        // Jazz melody with 7th chords feel
        const jazzMelody = [523, 0, 587, 659, 0, 784, 880, 784,
                          698, 0, 659, 587, 0, 523, 493.88, 523];

        jazzMelody.forEach((freq, i) => {
            if (freq === 0) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);
            // Subtle vibrato
            osc.frequency.setValueAtTime(freq * 1.01, startTime + beatDuration * 0.4);
            osc.frequency.setValueAtTime(freq, startTime + beatDuration * 0.6);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, startTime + 0.02);
            gain.gain.setValueAtTime(this.musicVolume * 0.08, startTime + beatDuration * 0.5);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.9);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 12: Electronic - Synth-heavy EDM style
    playQuizElectronic(ctx, callback) {
        const tempo = 128;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Sidechained bass
        const bassNotes = [65.41, 65.41, 73.42, 73.42, 82.41, 82.41, 73.42, 73.42];

        bassNotes.forEach((freq, i) => {
            for (let r = 0; r < 2; r++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sawtooth';
                const startTime = ctx.currentTime + (r * 8 + i) * beatDuration;
                osc.frequency.setValueAtTime(freq, startTime);

                // Sidechain pump effect
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.15, startTime + beatDuration * 0.1);
                gain.gain.exponentialRampToValueAtTime(this.musicVolume * 0.02, startTime + beatDuration * 0.9);

                osc.start(startTime);
                osc.stop(startTime + beatDuration);
            }
        });

        // Synth lead with filter sweep feel
        const synthLead = [523, 659, 784, 880, 784, 659, 523, 440,
                          523, 698, 880, 1047, 880, 698, 523, 440];

        synthLead.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sawtooth';
            osc2.type = 'square';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);
            osc2.frequency.setValueAtTime(freq * 0.5, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.06, startTime + 0.01);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.04, startTime + beatDuration * 0.3);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.7);

            osc.start(startTime);
            osc2.start(startTime);
            osc.stop(startTime + beatDuration * 0.75);
            osc2.stop(startTime + beatDuration * 0.75);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 13: Orchestral - Grand and majestic
    playQuizOrchestral(ctx, callback) {
        const tempo = 95;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // String section - sustained chords
        const stringChords = [
            {notes: [130.81, 164.81, 196], time: 0, dur: 4},
            {notes: [146.83, 174.61, 220], time: 4, dur: 4},
            {notes: [164.81, 196, 247], time: 8, dur: 4},
            {notes: [130.81, 164.81, 196], time: 12, dur: 4}
        ];

        stringChords.forEach(chord => {
            chord.notes.forEach(freq => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                const startTime = ctx.currentTime + chord.time * beatDuration;
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.08, startTime + 0.2);
                gain.gain.setValueAtTime(this.musicVolume * 0.07, startTime + chord.dur * beatDuration * 0.8);
                gain.gain.linearRampToValueAtTime(0, startTime + chord.dur * beatDuration);

                osc.start(startTime);
                osc.stop(startTime + chord.dur * beatDuration);
            });
        });

        // Brass-like melody
        const brassMelody = [392, 440, 523, 587, 523, 440, 392, 349.23,
                           392, 493.88, 587, 659, 587, 493.88, 392, 329.63];

        brassMelody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sawtooth';
            osc2.type = 'triangle';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);
            osc2.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.07, startTime + 0.05);
            gain.gain.setValueAtTime(this.musicVolume * 0.06, startTime + beatDuration * 0.7);
            gain.gain.linearRampToValueAtTime(0, startTime + beatDuration * 0.95);

            osc.start(startTime);
            osc2.start(startTime);
            osc.stop(startTime + beatDuration);
            osc2.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 14: Country - Twangy and cheerful
    playQuizCountry(ctx, callback) {
        const tempo = 125;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Country bass - boom-chick pattern
        const countryBass = [130.81, 196, 130.81, 196, 164.81, 247, 164.81, 247];

        countryBass.forEach((freq, i) => {
            for (let r = 0; r < 2; r++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'triangle';
                const startTime = ctx.currentTime + (r * 8 + i) * beatDuration;
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.12, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.4);

                osc.start(startTime);
                osc.stop(startTime + beatDuration * 0.45);
            }
        });

        // Twangy guitar melody with bends
        const countryMelody = [523, 587, 659, 587, 523, 440, 392, 440,
                              523, 659, 784, 659, 523, 587, 659, 523];

        countryMelody.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sawtooth';
            const startTime = ctx.currentTime + i * beatDuration;
            // Start slightly flat and bend up for twang
            osc.frequency.setValueAtTime(freq * 0.95, startTime);
            osc.frequency.exponentialRampToValueAtTime(freq, startTime + 0.05);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.08, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.6);

            osc.start(startTime);
            osc.stop(startTime + beatDuration * 0.65);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Track 15: Reggae - Laid-back island vibes
    playQuizReggae(ctx, callback) {
        const tempo = 85;
        const beatDuration = 60 / tempo;
        const loopDuration = 16 * beatDuration;

        // Reggae bass - emphasizing offbeats
        const reggaeBass = [
            {freq: 98, time: 0.5}, {freq: 98, time: 2.5},
            {freq: 110, time: 4.5}, {freq: 110, time: 6.5}
        ];

        reggaeBass.forEach(note => {
            for (let r = 0; r < 2; r++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                const startTime = ctx.currentTime + (r * 8 + note.time) * beatDuration;
                osc.frequency.setValueAtTime(note.freq, startTime);
                osc.frequency.setValueAtTime(note.freq * 0.98, startTime + beatDuration);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.18, startTime + 0.02);
                gain.gain.setValueAtTime(this.musicVolume * 0.15, startTime + beatDuration * 1.5);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 1.8);

                osc.start(startTime);
                osc.stop(startTime + beatDuration * 2);
            }
        });

        // Skank guitar on offbeats
        const skankChords = [
            {notes: [392, 493.88, 587], time: 0.5},
            {notes: [392, 493.88, 587], time: 1.5},
            {notes: [440, 554.37, 659], time: 2.5},
            {notes: [440, 554.37, 659], time: 3.5}
        ];

        skankChords.forEach(chord => {
            for (let r = 0; r < 4; r++) {
                chord.notes.forEach(freq => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.type = 'square';
                    const startTime = ctx.currentTime + (r * 4 + chord.time) * beatDuration;
                    osc.frequency.setValueAtTime(freq, startTime);

                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(this.musicVolume * 0.04, startTime + 0.01);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.25);

                    osc.start(startTime);
                    osc.stop(startTime + beatDuration * 0.3);
                });
            }
        });

        // Simple melody
        const reggaeMelody = [523, 0, 587, 0, 659, 0, 587, 0,
                            523, 0, 493.88, 0, 440, 0, 493.88, 523];

        reggaeMelody.forEach((freq, i) => {
            if (freq === 0) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            const startTime = ctx.currentTime + i * beatDuration;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.1, startTime + 0.02);
            gain.gain.setValueAtTime(this.musicVolume * 0.08, startTime + beatDuration * 0.5);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + beatDuration * 0.9);

            osc.start(startTime);
            osc.stop(startTime + beatDuration);
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'quiz' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Menu Music - Calm and welcoming
    playMenuMusicLoop(ctx, callback) {
        const notes = [261.63, 329.63, 392, 493.88];
        const loopDuration = 8;

        notes.forEach((freq, i) => {
            for (let repeat = 0; repeat < 4; repeat++) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);

                const startTime = ctx.currentTime + (repeat * 4 + i) * 0.5;
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(this.musicVolume * 0.08, startTime + 0.1);
                gain.gain.setValueAtTime(this.musicVolume * 0.06, startTime + 0.4);
                gain.gain.linearRampToValueAtTime(0, startTime + 0.5);

                osc.start(startTime);
                osc.stop(startTime + 0.5);
            }
        });

        setTimeout(() => {
            if (callback && this.currentMusic === 'menu' && !this.isMuted) {
                callback();
            }
        }, loopDuration * 1000);
    }

    // Victory Music - Triumphant fanfare
    playVictoryMusic(ctx) {
        const fanfare = [
            {freq: 523.25, start: 0, dur: 0.3},
            {freq: 659.25, start: 0.25, dur: 0.3},
            {freq: 783.99, start: 0.5, dur: 0.3},
            {freq: 1046.50, start: 0.75, dur: 0.6},
            {freq: 783.99, start: 1.2, dur: 0.2},
            {freq: 880, start: 1.35, dur: 0.2},
            {freq: 1046.50, start: 1.5, dur: 0.8},
        ];

        fanfare.forEach(note => {
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            osc2.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, ctx.currentTime);
            osc2.frequency.setValueAtTime(note.freq * 2, ctx.currentTime);

            const startTime = ctx.currentTime + note.start;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.15, startTime + 0.05);
            gain.gain.setValueAtTime(this.musicVolume * 0.12, startTime + note.dur * 0.8);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.dur);

            osc.start(startTime);
            osc2.start(startTime);
            osc.stop(startTime + note.dur);
            osc2.stop(startTime + note.dur);
        });

        setTimeout(() => {
            if (this.currentMusic === 'victory') {
                this.currentMusic = null;
            }
        }, 2500);
    }

    /**
     * Stop current background music
     */
    stopMusic() {
        this.currentMusic = null;

        // Stop Howler music if playing
        if (this.howlerMusic) {
            this.howlerMusic.stop();
            this.howlerMusic.unload();
            this.howlerMusic = null;
        }

        // Stop Web Audio context music
        if (this.musicContext) {
            try {
                this.musicContext.close();
            } catch (e) {}
            this.musicContext = null;
        }
    }

    /**
     * Pause/resume music
     */
    pauseMusic() {
        if (this.howlerMusic && this.howlerMusic.playing()) {
            this.howlerMusic.pause();
        }
        if (this.musicContext && this.musicContext.state === 'running') {
            this.musicContext.suspend();
        }
    }

    resumeMusic() {
        // If we have a paused Howler track, resume it
        if (this.howlerMusic && !this.howlerMusic.playing()) {
            this.howlerMusic.play();
            return;
        }
        // If we have a suspended synth context, resume it
        if (this.musicContext && this.musicContext.state === 'suspended') {
            this.musicContext.resume();
            return;
        }
        // If no music was playing but we're in quiz mode, start new music
        if (this.currentMusic === 'quiz' && !this.isMuted) {
            if (this.useMP3) {
                this.playMP3Music();
            } else {
                this.startMusicLoop('quiz');
            }
        }
    }

    // ==========================================
    // Volume and Mute Controls
    // ==========================================

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.savePreferences();

        if (this.isMuted) {
            // Pause music when muting (so we can resume)
            this.pauseMusic();
        } else {
            // Resume music when unmuting
            this.resumeMusic();
        }

        return this.isMuted;
    }

    setMuted(muted) {
        this.isMuted = muted;
        this.savePreferences();

        if (this.isMuted) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
    }

    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        this.savePreferences();
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.savePreferences();

        // Update Howler volume if playing
        if (this.howlerMusic) {
            this.howlerMusic.volume(this.musicVolume);
        }
    }

    // ==========================================
    // Persistence
    // ==========================================

    savePreferences() {
        try {
            localStorage.setItem('quizAudioPrefs', JSON.stringify({
                isMuted: this.isMuted,
                sfxVolume: this.sfxVolume,
                musicVolume: this.musicVolume
            }));
        } catch (e) {}
    }

    loadPreferences() {
        try {
            const prefs = JSON.parse(localStorage.getItem('quizAudioPrefs'));
            if (prefs) {
                this.isMuted = prefs.isMuted || false;
                this.sfxVolume = prefs.sfxVolume ?? 0.5;
                this.musicVolume = prefs.musicVolume ?? 0.3;
            }
        } catch (e) {}
    }
}

// Create global audio manager instance
const audioManager = new AudioManager();

// Initialize on first user interaction (browser policy requirement)
document.addEventListener('click', function initAudio() {
    audioManager.init();
    document.removeEventListener('click', initAudio);
}, { once: true });

document.addEventListener('keydown', function initAudio() {
    audioManager.init();
    document.removeEventListener('keydown', initAudio);
}, { once: true });
