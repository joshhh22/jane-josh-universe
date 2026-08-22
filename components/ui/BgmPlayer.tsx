"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  CloudRain,
  Radio,
  Music,
  Disc3,
  Heart,
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  emoji: string;
  tempo: number; // BPM
  style: "jazz_lofi" | "music_box" | "rainy_rhodes" | "cute_kalimba";
}

const TRACKS: Track[] = [
  {
    id: "track-1",
    title: "Jane's Cozy Afternoon",
    artist: "Jane × Josh — Jazz Lo-Fi",
    genre: "Warm Lofi Piano & Chords",
    emoji: "🌸",
    tempo: 72,
    style: "jazz_lofi",
  },
  {
    id: "track-2",
    title: "Starlit Night Music Box",
    artist: "Jane × Josh — Dreamy Bells",
    genre: "Twinkling Music Box Waltz",
    emoji: "🌙",
    tempo: 58,
    style: "music_box",
  },
  {
    id: "track-3",
    title: "Rainy Cafe & Warm Coffee",
    artist: "Jane × Josh — Rhodes Chill",
    genre: "Smooth Rhodes & Deep Bass",
    emoji: "☕",
    tempo: 84,
    style: "rainy_rhodes",
  },
  {
    id: "track-4",
    title: "JJ's Playful Garden Walk",
    artist: "Jane × Josh — Kalimba Cute",
    genre: "Bouncy Kalimba & Marimba",
    emoji: "🐱",
    tempo: 96,
    style: "cute_kalimba",
  },
];

export function BgmPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [rainEnabled, setRainEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.65);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stepRef = useRef(0);

  // Initialize Web Audio Engine
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtx();
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = masterGain;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // ─── INSTRUMENT 1: JAZZ LOFI PIANO & SUB BASS ───────────────
  const playJazzLofiStep = (ctx: AudioContext, master: GainNode, step: number) => {
    const now = ctx.currentTime;
    // Chords: FM9 -> Em7 -> Dm9 -> Cmaj9
    const progressions = [
      { bass: 174.61 /* F3 */, chord: [349.23, 440.0, 523.25, 659.25] },
      { bass: 164.81 /* E3 */, chord: [329.63, 392.0, 493.88, 587.33] },
      { bass: 146.83 /* D3 */, chord: [293.66, 349.23, 440.0, 523.25] },
      { bass: 130.81 /* C3 */, chord: [261.63, 329.63, 392.0, 493.88] },
    ];
    const current = progressions[Math.floor(step / 2) % progressions.length];

    // Deep warm sub-bass note on beat 1
    if (step % 2 === 0) {
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = "triangle";
      bassOsc.frequency.setValueAtTime(current.bass / 2, now);
      bassGain.gain.setValueAtTime(0.2, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
      bassOsc.connect(bassGain);
      bassGain.connect(master);
      bassOsc.start(now);
      bassOsc.stop(now + 1.8);
    }

    // Warm Rhodes chords with gentle vibrato
    current.chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(750, now);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.04);

      gain.gain.setValueAtTime(0.001, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.05, now + i * 0.04 + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now + i * 0.04);
      osc.stop(now + 2.0);
    });

    // Soft high piano lead note
    const leadNotes = [523.25, 659.25, 783.99, 880.0, 1046.5];
    const leadFreq = leadNotes[(step * 3) % leadNotes.length];
    const leadOsc = ctx.createOscillator();
    const leadGain = ctx.createGain();
    leadOsc.type = "sine";
    leadOsc.frequency.setValueAtTime(leadFreq, now + 0.2);
    leadGain.gain.setValueAtTime(0.03, now + 0.2);
    leadGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    leadOsc.connect(leadGain);
    leadGain.connect(master);
    leadOsc.start(now + 0.2);
    leadOsc.stop(now + 1.3);
  };

  // ─── INSTRUMENT 2: STARLIT MUSIC BOX WALTZ ──────────────────
  const playMusicBoxStep = (ctx: AudioContext, master: GainNode, step: number) => {
    const now = ctx.currentTime;
    // Dreamy Celesta notes in 3/4 waltz
    const arpeggios = [
      [523.25, 659.25, 783.99, 1046.5], // C5
      [440.0, 523.25, 659.25, 880.0],   // Am
      [349.23, 440.0, 523.25, 698.46],  // F
      [392.0, 493.88, 587.33, 783.99],  // G
    ];
    const currentArp = arpeggios[Math.floor(step / 3) % arpeggios.length];
    const noteFreq = currentArp[step % currentArp.length];

    // Bell chime generator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(noteFreq, now);

    // Sharp bright chime attack + long ring
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 2.0);

    // Warm deep sub chime on measure start
    if (step % 3 === 0) {
      const rootOsc = ctx.createOscillator();
      const rootGain = ctx.createGain();
      rootOsc.type = "triangle";
      rootOsc.frequency.setValueAtTime(noteFreq / 4, now);
      rootGain.gain.setValueAtTime(0.12, now);
      rootGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
      rootOsc.connect(rootGain);
      rootGain.connect(master);
      rootOsc.start(now);
      rootOsc.stop(now + 2.4);
    }
  };

  // ─── INSTRUMENT 3: RAINY CAFE RHODES & WALKING BASS ──────────
  const playRainyRhodesStep = (ctx: AudioContext, master: GainNode, step: number) => {
    const now = ctx.currentTime;
    // Bossa / Neo-Soul Chords: Dm9 -> G13 -> Cmaj9 -> A7alt
    const chords = [
      { bass: 146.83 /* D3 */, notes: [293.66, 349.23, 440.0, 523.25, 659.25] },
      { bass: 98.0   /* G2 */, notes: [246.94, 329.63, 392.0, 493.88, 659.25] },
      { bass: 130.81 /* C3 */, notes: [261.63, 329.63, 392.0, 493.88, 587.33] },
      { bass: 110.0  /* A2 */, notes: [277.18, 329.63, 392.0, 466.16, 554.37] },
    ];
    const current = chords[Math.floor(step / 2) % chords.length];

    // Funky warm walking bass
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = "sine";
    const bassNote = step % 2 === 0 ? current.bass : current.bass * 1.5;
    bassOsc.frequency.setValueAtTime(bassNote, now);
    bassGain.gain.setValueAtTime(0.22, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    bassOsc.connect(bassGain);
    bassGain.connect(master);
    bassOsc.start(now);
    bassOsc.stop(now + 0.9);

    // Warm Rhodes comping
    current.notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(650, now);

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(now + idx * 0.03);
      osc.stop(now + 1.3);
    });
  };

  // ─── INSTRUMENT 4: JJ'S BOUNCY KALIMBA & MARIMBA ────────────
  const playKalimbaStep = (ctx: AudioContext, master: GainNode, step: number) => {
    const now = ctx.currentTime;
    // Cute bouncy pentatonic melody: C - D - E - G - A
    const pentatonic = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 659.25, 783.99];
    const melodySeq = [0, 2, 4, 7, 5, 4, 2, 3, 4, 7, 5, 2];
    const noteIdx = melodySeq[step % melodySeq.length];
    const freq = pentatonic[noteIdx % pentatonic.length];

    // Marimba wood attack
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Bouncy pluck envelope
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc.connect(gain);
    gain.connect(master);
    osc.start(now);
    osc.stop(now + 0.5);

    // Harmonic marimba top overtone
    const harmOsc = ctx.createOscillator();
    const harmGain = ctx.createGain();
    harmOsc.type = "triangle";
    harmOsc.frequency.setValueAtTime(freq * 3, now);
    harmGain.gain.setValueAtTime(0.03, now);
    harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    harmOsc.connect(harmGain);
    harmGain.connect(master);
    harmOsc.start(now);
    harmOsc.stop(now + 0.2);

    // Cute sub bounce on every 4 beats
    if (step % 4 === 0) {
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      bOsc.type = "sine";
      bOsc.frequency.setValueAtTime(130.81, now);
      bGain.gain.setValueAtTime(0.18, now);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      bOsc.connect(bGain);
      bGain.connect(master);
      bOsc.start(now);
      bOsc.stop(now + 0.7);
    }
  };

  // ─── MASTER MUSIC STEP ROUTER ────────────────────────────────
  const executeMusicStep = () => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    const track = TRACKS[trackIndex];
    const step = stepRef.current;
    stepRef.current += 1;

    if (track.style === "jazz_lofi") {
      playJazzLofiStep(ctx, master, step);
    } else if (track.style === "music_box") {
      playMusicBoxStep(ctx, master, step);
    } else if (track.style === "rainy_rhodes") {
      playRainyRhodesStep(ctx, master, step);
    } else if (track.style === "cute_kalimba") {
      playKalimbaStep(ctx, master, step);
    }
  };

  // ─── GENERATIVE RAIN SOUND ──────────────────────────────────
  const toggleRainSound = (enable: boolean) => {
    initAudio();
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;

    if (enable) {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "lowpass";
      rainFilter.frequency.setValueAtTime(1000, ctx.currentTime);

      const rainGain = ctx.createGain();
      rainGain.gain.setValueAtTime(0.04, ctx.currentTime);

      noise.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(masterGainRef.current!);

      noise.start();
      rainGainRef.current = rainGain;
    } else if (rainGainRef.current) {
      rainGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      rainGainRef.current = null;
    }
    setRainEnabled(enable);
  };

  const handleTogglePlay = () => {
    initAudio();
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      executeMusicStep();
      const track = TRACKS[trackIndex];
      const stepMs = (60 / track.tempo) * 1000;
      timerRef.current = setInterval(executeMusicStep, stepMs);
    }
  };

  const switchTrack = (idx: number) => {
    setTrackIndex(idx);
    stepRef.current = 0;
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      executeMusicStep();
      const stepMs = (60 / TRACKS[idx].tempo) * 1000;
      timerRef.current = setInterval(executeMusicStep, stepMs);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (trackIndex + 1) % TRACKS.length;
    switchTrack(nextIdx);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        isMuted ? 0 : newVol,
        audioCtxRef.current.currentTime
      );
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        nextMuted ? 0 : volume,
        audioCtxRef.current.currentTime
      );
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentTrack = TRACKS[trackIndex];

  return (
    <div className="fixed bottom-5 right-5 z-40 selection:bg-transparent">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 w-80 neu-box p-4 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#2C2824]/10 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">📻</span>
                <span className="font-display font-black text-xs uppercase tracking-wider text-[#2C2824]">
                  Lo-Fi Cassette Station
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs font-bold text-[#7A7269] hover:text-[#2C2824] px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            {/* Currently Playing Card */}
            <div className="flex items-center gap-3 bg-[#FAF5EE] p-3 rounded-xl border-2 border-[#2C2824]/15">
              <div
                className={`w-12 h-12 rounded-xl bg-[#FFCCD5] border-2 border-[#2C2824] flex items-center justify-center text-2xl shadow-[2px_2px_0px_#2C2824] flex-shrink-0 ${
                  isPlaying ? "animate-spin" : ""
                }`}
              >
                {currentTrack.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <span className="sticker bg-[#FEF08A] text-[9px] py-0.2 px-1.5 font-bold mb-0.5 inline-block">
                  {currentTrack.genre}
                </span>
                <p className="font-display font-black text-xs text-[#2C2824] truncate">
                  {currentTrack.title}
                </p>
                <p className="font-hand text-xs text-[#7A7269] truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Track Selector List */}
            <div className="space-y-1">
              <p className="text-[10px] font-display font-bold uppercase tracking-wider text-[#7A7269] px-1">
                Select Track ({TRACKS.length})
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {TRACKS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => switchTrack(idx)}
                    className={`p-2 rounded-xl border-2 text-left transition-all ${
                      trackIndex === idx
                        ? "bg-[#FFCCD5] border-[#2C2824] shadow-[2px_2px_0px_#2C2824] font-bold"
                        : "bg-[#FFFDF9] border-[#2C2824]/20 hover:border-[#2C2824] text-[#7A7269]"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs truncate">
                      <span>{t.emoji}</span>
                      <span className="truncate font-display text-[11px] text-[#2C2824]">
                        {t.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#2C2824]/10">
              <button
                onClick={() => toggleRainSound(!rainEnabled)}
                className={`p-2 rounded-xl border-2 border-[#2C2824] text-xs font-display font-bold flex items-center gap-1 transition-all ${
                  rainEnabled
                    ? "bg-[#BAE6FD] shadow-[2px_2px_0px_#2C2824]"
                    : "bg-[#FFFDF9] hover:bg-[#FAF5EE]"
                }`}
                title="Toggle cozy rain sound"
              >
                <CloudRain size={13} />
                <span>{rainEnabled ? "Rain ON" : "Rain"}</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleTogglePlay}
                  className="w-10 h-10 rounded-xl bg-[#FEF08A] border-2 border-[#2C2824] flex items-center justify-center text-[#2C2824] shadow-[2px_2px_0px_#2C2824] hover:-translate-y-0.5 transition-all"
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="w-10 h-10 rounded-xl bg-[#FFFDF9] border-2 border-[#2C2824] flex items-center justify-center text-[#2C2824] shadow-[2px_2px_0px_#2C2824] hover:-translate-y-0.5 transition-all"
                  title="Next track"
                >
                  <SkipForward size={16} />
                </button>

                <button
                  onClick={handleToggleMute}
                  className="p-2 rounded-xl border-2 border-[#2C2824] bg-[#FFFDF9] text-[#2C2824] hover:bg-[#FAF5EE]"
                >
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[10px] font-display font-bold text-[#7A7269]">
                VOL
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-[#FF8FAB] cursor-pointer h-1.5 bg-[#FAF5EE] rounded-lg"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mini Player Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="neu-box px-3.5 py-2 bg-[#FFFDF9] border-[2px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] flex items-center gap-2.5 text-[#2C2824] cursor-pointer"
      >
        <div
          className={`w-6 h-6 rounded-full bg-[#FFCCD5] border border-[#2C2824] flex items-center justify-center text-xs flex-shrink-0 ${
            isPlaying ? "animate-spin" : ""
          }`}
        >
          {isPlaying ? "🎵" : "📻"}
        </div>
        <div className="text-left">
          <p className="font-display font-black text-[11px] leading-tight">
            {isPlaying ? currentTrack.title : "Lo-Fi Cassette"}
          </p>
          <p className="font-hand text-[10px] text-[#7A7269] leading-none mt-0.5">
            {isPlaying
              ? rainEnabled
                ? "playing + 🌧️ rain"
                : "playing cozy beats ♡"
              : "tap to play music ♡"}
          </p>
        </div>
        <span className="text-xs ml-1">{isExpanded ? "▾" : "▴"}</span>
      </motion.button>
    </div>
  );
}
