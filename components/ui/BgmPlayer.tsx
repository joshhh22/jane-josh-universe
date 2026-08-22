"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Pause, SkipForward, CloudRain, Sparkles, Music, Disc } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  emoji: string;
  rootFreq: number; // Base frequency for generative cozy lofi chords
  scale: number[]; // Interval scale
  tempo: number;
}

const TRACKS: Track[] = [
  {
    title: "Jane's Cozy Afternoon",
    artist: "Jane × Josh Lo-Fi",
    emoji: "🌸",
    rootFreq: 261.63, // C4
    scale: [0, 4, 7, 11, 14, 16], // Major 9th chill chords
    tempo: 72,
  },
  {
    title: "Starlit Night Thoughts",
    artist: "Jane × Josh Lo-Fi",
    emoji: "🌙",
    rootFreq: 220.0, // A3
    scale: [0, 3, 7, 10, 14, 15], // Minor 9th dreamy chords
    tempo: 64,
  },
  {
    title: "Sweet Nostalgia & Coffee",
    artist: "Jane × Josh Lo-Fi",
    emoji: "☕",
    rootFreq: 329.63, // E4
    scale: [0, 4, 7, 9, 12, 16], // Lofi Rhodes vibe
    tempo: 80,
  },
];

export function BgmPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [rainEnabled, setRainEnabled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.6);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentChordStepRef = useRef(0);

  // Initialize Web Audio Engine
  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

  // Play a soft, dreamy electric piano chord
  const playCozyChord = () => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const track = TRACKS[trackIndex];

    // Progression shifts
    const chordProgressions = [0, 5, 9, 7]; // I - IV - vi - V
    const progOffset = chordProgressions[currentChordStepRef.current % chordProgressions.length];
    currentChordStepRef.current += 1;

    // Pick 3-4 gentle harmonic notes
    const chordNotes = [0, 4, 7, 11].map((interval) => {
      const semitones = progOffset + interval;
      return track.rootFreq * Math.pow(2, semitones / 12);
    });

    chordNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Warm low-pass filter for cozy lofi warmth
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800 + Math.random() * 200, now);

      // Sine/Triangle blend
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      // Gentle attack & long decay
      gain.gain.setValueAtTime(0.001, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.08 / chordNotes.length, now + i * 0.05 + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current!);

      osc.start(now + i * 0.05);
      osc.stop(now + 3.5);
    });
  };

  // Generative Rain Sound using Pink/White Noise
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
        data[i] = (lastOut + 0.02 * white) / 1.02; // Pink-ish noise
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
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playCozyChord();
      const intervalMs = (60 / TRACKS[trackIndex].tempo) * 2000;
      intervalRef.current = setInterval(playCozyChord, intervalMs);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (trackIndex + 1) % TRACKS.length;
    setTrackIndex(nextIdx);
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playCozyChord();
      const intervalMs = (60 / TRACKS[nextIdx].tempo) * 2000;
      intervalRef.current = setInterval(playCozyChord, intervalMs);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(isMuted ? 0 : newVol, audioCtxRef.current.currentTime);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(nextMuted ? 0 : volume, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
            className="mb-3 w-72 neu-box p-4 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#2C2824]/10 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">📻</span>
                <span className="font-display font-black text-xs uppercase tracking-wider text-[#2C2824]">
                  Lo-Fi Cassette
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs font-bold text-[#7A7269] hover:text-[#2C2824] px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            {/* Track Info */}
            <div className="flex items-center gap-3 bg-[#FAF5EE] p-2.5 rounded-xl border-2 border-[#2C2824]/15">
              <div className={`w-10 h-10 rounded-xl bg-[#FFCCD5] border-2 border-[#2C2824] flex items-center justify-center text-lg shadow-[2px_2px_0px_#2C2824] flex-shrink-0 ${
                isPlaying ? "animate-spin" : ""
              }`}>
                {currentTrack.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-black text-xs text-[#2C2824] truncate">
                  {currentTrack.title}
                </p>
                <p className="font-hand text-xs text-[#7A7269] truncate">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              {/* Rain Ambient Toggle */}
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
                {/* Play/Pause */}
                <button
                  onClick={handleTogglePlay}
                  className="w-9 h-9 rounded-xl bg-[#FEF08A] border-2 border-[#2C2824] flex items-center justify-center text-[#2C2824] shadow-[2px_2px_0px_#2C2824] hover:-translate-y-0.5 transition-all"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>

                {/* Skip */}
                <button
                  onClick={handleNextTrack}
                  className="w-9 h-9 rounded-xl bg-[#FFFDF9] border-2 border-[#2C2824] flex items-center justify-center text-[#2C2824] shadow-[2px_2px_0px_#2C2824] hover:-translate-y-0.5 transition-all"
                  title="Next track"
                >
                  <SkipForward size={14} />
                </button>

                {/* Mute */}
                <button
                  onClick={handleToggleMute}
                  className="p-2 rounded-xl border-2 border-[#2C2824] bg-[#FFFDF9] text-[#2C2824] hover:bg-[#FAF5EE]"
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-display font-bold text-[#7A7269]">VOL</span>
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

      {/* Floating Mini Player Pill */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="neu-box px-3.5 py-2 bg-[#FFFDF9] border-[2px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] flex items-center gap-2.5 text-[#2C2824] cursor-pointer"
      >
        <div className={`w-6 h-6 rounded-full bg-[#FFCCD5] border border-[#2C2824] flex items-center justify-center text-xs flex-shrink-0 ${
          isPlaying ? "animate-spin" : ""
        }`}>
          {isPlaying ? "🎵" : "📻"}
        </div>
        <div className="text-left">
          <p className="font-display font-black text-[11px] leading-tight">
            {isPlaying ? currentTrack.title : "Lo-Fi Player"}
          </p>
          <p className="font-hand text-[10px] text-[#7A7269] leading-none mt-0.5">
            {isPlaying ? (rainEnabled ? "playing + 🌧️ rain" : "playing vibes...") : "tap to play music ♡"}
          </p>
        </div>
        <span className="text-xs ml-1">{isExpanded ? "▾" : "▴"}</span>
      </motion.button>
    </div>
  );
}
