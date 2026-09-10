"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import confetti from "canvas-confetti";
import {
  Camera,
  FlipHorizontal,
  RotateCcw,
  Download,
  Sparkles,
  Upload,
  Play,
  Trash2,
  Heart,
  Smile,
  Type,
  Volume2,
  VolumeX,
  Users,
  User,
  Radio,
  ArrowRight,
  Clock,
  Shuffle,
} from "lucide-react";

// ─── 10 CUSTOM THEMED FRAMES ──────────────────────────────────────────
export interface FrameTheme {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  badge: string;
  subtitle: string;
  decorType: "sakura" | "butter" | "lavender" | "matcha" | "film" | "y2k" | "korean" | "newspaper" | "cat" | "galaxy";
}

export const FRAME_THEMES: FrameTheme[] = [
  {
    id: "sakura",
    name: "Sakura Romance",
    emoji: "🌸",
    bg: "#FFE4E6",
    borderColor: "#2C2824",
    textColor: "#9F1239",
    accentColor: "#FB7185",
    badge: "🌸 JANE × JOSH 🌸",
    subtitle: "sweet romance • our tiny universe ♡",
    decorType: "sakura",
  },
  {
    id: "butter",
    name: "Butter Sunshine",
    emoji: "☀️",
    bg: "#FEF9C3",
    borderColor: "#2C2824",
    textColor: "#854D0E",
    accentColor: "#FACC15",
    badge: "☀️ GOLDEN SUNSHINE 🌼",
    subtitle: "you brighten my whole world ♡",
    decorType: "butter",
  },
  {
    id: "lavender",
    name: "Lavender Cloud",
    emoji: "💜",
    bg: "#EDE9FE",
    borderColor: "#2C2824",
    textColor: "#581C87",
    accentColor: "#A78BFA",
    badge: "🌙 SWEETEST DREAMS ☁️",
    subtitle: "walking on clouds with you ✦",
    decorType: "lavender",
  },
  {
    id: "matcha",
    name: "Matcha Garden",
    emoji: "🍵",
    bg: "#DCFCE7",
    borderColor: "#2C2824",
    textColor: "#14532D",
    accentColor: "#4ADE80",
    badge: "🍃 MATCHA COZY VIBE 🍵",
    subtitle: "my favorite cozy human 🌿",
    decorType: "matcha",
  },
  {
    id: "film35mm",
    name: "Vintage 35mm",
    emoji: "🎞️",
    bg: "#18181B",
    borderColor: "#3F3F46",
    textColor: "#FEF08A",
    accentColor: "#EF4444",
    badge: "🎞️ KODAK PORTRA 400",
    subtitle: "28.05.2026 • 24 EXP • 35MM FILM",
    decorType: "film",
  },
  {
    id: "y2k",
    name: "Y2K Cyber Pop",
    emoji: "💖",
    bg: "#FDF2F8",
    borderColor: "#BE185D",
    textColor: "#BE185D",
    accentColor: "#EC4899",
    badge: "★ 2000s CUTIE PIE ★",
    subtitle: "jj besties & lovers 4ever 💿",
    decorType: "y2k",
  },
  {
    id: "korean",
    name: "Korean Minimalist",
    emoji: "🤍",
    bg: "#FAF8F5",
    borderColor: "#2C2824",
    textColor: "#1C1917",
    accentColor: "#78716C",
    badge: "HARU FILM • 하루필름",
    subtitle: "seoul memories • 2026.05.28",
    decorType: "korean",
  },
  {
    id: "newspaper",
    name: "Daily Chronicle",
    emoji: "📰",
    bg: "#F5EBE0",
    borderColor: "#2C2824",
    textColor: "#292524",
    accentColor: "#78716C",
    badge: "📰 THE LOVE CHRONICLE",
    subtitle: "BREAKING: Josh & Jane found happiest together",
    decorType: "newspaper",
  },
  {
    id: "biscuit",
    name: "Biscuit Cat Café",
    emoji: "🐾",
    bg: "#FFEDD5",
    borderColor: "#2C2824",
    textColor: "#7C2D12",
    accentColor: "#FB923C",
    badge: "🐾 BISCUIT & JJ CAFÉ 🐱",
    subtitle: "100% purr-fect moments • meow ♡",
    decorType: "cat",
  },
  {
    id: "galaxy",
    name: "Midnight Galaxy",
    emoji: "🌌",
    bg: "#0F172A",
    borderColor: "#38BDF8",
    textColor: "#BAE6FD",
    accentColor: "#C084FC",
    badge: "🪐 INTERSTELLAR LOVE ✦",
    subtitle: "loved to the moon and beyond 🛸",
    decorType: "galaxy",
  },
];

// ─── PHOTO FILTERS ───────────────────────────────────────────────────
export interface PhotoFilter {
  id: string;
  name: string;
  css: string;
}

export const PHOTO_FILTERS: PhotoFilter[] = [
  { id: "normal", name: "Normal", css: "none" },
  { id: "soft", name: "Soft Glow", css: "brightness(1.08) contrast(0.96) saturate(1.1)" },
  { id: "vintage", name: "90s Film", css: "sepia(0.3) contrast(1.1) brightness(0.95) saturate(1.15)" },
  { id: "noir", name: "Noir B&W", css: "grayscale(1) contrast(1.25) brightness(0.95)" },
  { id: "rosy", name: "Rosy Blush", css: "hue-rotate(-12deg) saturate(1.25) brightness(1.04)" },
  { id: "golden", name: "Golden Hour", css: "sepia(0.22) saturate(1.3) brightness(1.05) contrast(1.05)" },
];

export const STICKER_LIST = [
  "🌸", "💻", "💖", "🎀", "✨", "🐱", "🍗", "💌", "🧸", "🍓", "🌷", "☀️", "💍", "🍀", "🍰", "🌙"
];

interface PlacedSticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
}

export type PhotoboothLayout = "strip" | "grid" | "duo";
export type ShooterRole = "josh" | "jane";

// ─── AUDIO SYNTHESIZER ────────────────────────────────────────────────
function playBeep(freq = 880, duration = 0.12) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function playShutterSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1000;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    setTimeout(() => playBeep(1200, 0.04), 40);
  } catch (e) {}
}

// ─── MAIN PHOTOBOOTH COMPONENT ───────────────────────────────────────
export default function PhotoboothPage() {
  const { user, profile, isAdmin, isJane, isJosh } = useAuth();
  const { showToast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  // Mode: "solo" vs "collab" (Default to Collab LDR mode for Jane & Josh)
  const [sessionMode, setSessionMode] = useState<"solo" | "collab">("collab");

  // User's Role in Photobox
  const [myRole, setMyRole] = useState<ShooterRole>("josh");
  useEffect(() => {
    if (isJane) setMyRole("jane");
    else if (isJosh) setMyRole("josh");
  }, [isJane, isJosh]);

  // Client ID for Supabase Presence
  const [clientId] = useState(() => "cli_" + Math.random().toString(36).substring(2, 9));

  // Socket & Partner Heartbeat Status
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [lastPartnerSeen, setLastPartnerSeen] = useState<number | null>(null);

  // Presence State (Online users in Collab session)
  const [onlineUsers, setOnlineUsers] = useState<{ josh: boolean; jane: boolean }>({
    josh: false,
    jane: false,
  });

  // Dual-redundancy: Josh is online if (I am Josh & socket connected) OR (partner heartbeat/presence received within 15s)
  const isJoshOnline =
    (myRole === "josh" && isSocketConnected) ||
    onlineUsers.josh ||
    (lastPartnerSeen !== null && Date.now() - lastPartnerSeen < 15000 && myRole !== "josh");

  // Jane is online if (I am Jane & socket connected) OR (partner heartbeat/presence received within 15s)
  const isJaneOnline =
    (myRole === "jane" && isSocketConnected) ||
    onlineUsers.jane ||
    (lastPartnerSeen !== null && Date.now() - lastPartnerSeen < 15000 && myRole !== "jane");

  // Slot Turn Assignments (Default: Slot 1 Josh, Slot 2 Jane, Slot 3 Josh, Slot 4 Jane)
  const [slotAssignments, setSlotAssignments] = useState<ShooterRole[]>([
    "josh",
    "jane",
    "josh",
    "jane",
  ]);

  // Current Active Slot for Collab
  const [currentTurnSlot, setCurrentTurnSlot] = useState<number>(0);

  // Photos array (4 slots)
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [photoShooters, setPhotoShooters] = useState<(ShooterRole | null)[]>([null, null, null, null]);

  // Camera & Viewfinder
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [isMirrored, setIsMirrored] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Shoot Countdown State
  const [countdown, setCountdown] = useState<number | null>(null);
  const [partnerCountdown, setPartnerCountdown] = useState<{ slot: number; count: number } | null>(null);
  const [isShootingSession, setIsShootingSession] = useState(false);
  const [flash, setFlash] = useState(false);

  // Frame & Styling State
  const [selectedTheme, setSelectedTheme] = useState<FrameTheme>(FRAME_THEMES[0]);
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>(PHOTO_FILTERS[0]);
  const [selectedLayout, setSelectedLayout] = useState<PhotoboothLayout>("strip");
  const [captionText, setCaptionText] = useState("jane × josh • 28 mei 2026 ♡");
  const [showDate, setShowDate] = useState(true);

  // Stickers
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const photostripRef = useRef<HTMLDivElement>(null);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [isSavingMemory, setIsSavingMemory] = useState(false);

  const maxSlots = selectedLayout === "duo" ? 2 : 4;

  // Realtime Channel Ref
  const channelRef = useRef<any>(null);

  // Keep state refs updated for instant sync responses
  const myRoleRef = useRef<ShooterRole>(myRole);
  myRoleRef.current = myRole;
  const photosRef = useRef(photos);
  photosRef.current = photos;
  const photoShootersRef = useRef(photoShooters);
  photoShootersRef.current = photoShooters;
  const currentTurnSlotRef = useRef(currentTurnSlot);
  currentTurnSlotRef.current = currentTurnSlot;
  const selectedThemeRef = useRef(selectedTheme);
  selectedThemeRef.current = selectedTheme;
  const selectedFilterRef = useRef(selectedFilter);
  selectedFilterRef.current = selectedFilter;
  const captionTextRef = useRef(captionText);
  captionTextRef.current = captionText;
  const stickersRef = useRef(stickers);
  stickersRef.current = stickers;

  // Track presence whenever myRole changes without tearing down channel
  useEffect(() => {
    if (channelRef.current && sessionMode === "collab") {
      channelRef.current.track({
        role: myRole,
        clientId,
        onlineAt: Date.now(),
      });
      channelRef.current.send({
        type: "broadcast",
        event: "heartbeat",
        payload: { role: myRole, time: Date.now() },
      });
    }
  }, [myRole, sessionMode, clientId]);

  // 1. Initialize Camera
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn("Camera access failed:", err);
      setCameraActive(false);
    }
  }, [cameraFacing]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === "user" ? "environment" : "user"));
  };

  // 2. Capture Single Snapshot
  const captureSnapshot = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement("canvas");
    const targetAspect = 4 / 3;
    const vidAspect = video.videoWidth / video.videoHeight;
    let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;
    if (vidAspect > targetAspect) {
      sw = video.videoHeight * targetAspect;
      sx = (video.videoWidth - sw) / 2;
    } else {
      sh = video.videoWidth / targetAspect;
      sy = (video.videoHeight - sh) / 2;
    }

    // High quality resolution
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.88);
  }, [isMirrored]);

  // Manual Trigger to re-sync state and presence
  const triggerManualSync = useCallback(() => {
    if (channelRef.current && sessionMode === "collab") {
      channelRef.current.send({
        type: "broadcast",
        event: "heartbeat",
        payload: { role: myRoleRef.current, time: Date.now() },
      });
      channelRef.current.track({
        role: myRoleRef.current,
        clientId,
        onlineAt: Date.now(),
      });
      channelRef.current.send({
        type: "broadcast",
        event: "request-state",
        payload: { requester: myRoleRef.current },
      });
      showToast("Menyinkronkan status LDR Photobox... 🔄", { emoji: "📡" });
    }
  }, [sessionMode, showToast, clientId]);

  // 3. Supabase Realtime Collaboration Setup (Presence & Broadcast)
  useEffect(() => {
    if (sessionMode !== "collab") return;

    const channel = supabase.channel("jj-photobooth-collab-v5", {
      config: {
        broadcast: { ack: true, self: false },
        presence: { key: clientId },
      },
    });

    channelRef.current = channel;

    // A. Listen for Partner's Presence via Presence Sync
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const keys = Object.keys(state);
      const allPresences = Object.values(state).flat() as any[];
      const hasJosh = keys.includes("josh") || allPresences.some((p) => p?.role === "josh");
      const hasJane = keys.includes("jane") || allPresences.some((p) => p?.role === "jane");
      setOnlineUsers({ josh: hasJosh, jane: hasJane });
    });

    // B. Direct WebSocket Heartbeat (Instant sub-second partner detection)
    channel.on("broadcast", { event: "heartbeat" }, ({ payload }) => {
      if (payload?.role && payload.role !== myRoleRef.current) {
        setLastPartnerSeen(Date.now());
        setOnlineUsers((prev) => ({
          ...prev,
          [payload.role]: true,
        }));
      }
    });

    // C. State Synchronization Handlers
    channel.on("broadcast", { event: "request-state" }, () => {
      const hasPhotos = photosRef.current.some((p) => !!p);
      if (hasPhotos || currentTurnSlotRef.current > 0) {
        channel.send({
          type: "broadcast",
          event: "sync-state",
          payload: {
            photos: photosRef.current,
            photoShooters: photoShootersRef.current,
            currentTurnSlot: currentTurnSlotRef.current,
            themeId: selectedThemeRef.current.id,
            filterId: selectedFilterRef.current.id,
            caption: captionTextRef.current,
            stickers: stickersRef.current,
          },
        });
      }
    });

    channel.on("broadcast", { event: "sync-state" }, ({ payload }) => {
      if (Array.isArray(payload.photos)) setPhotos(payload.photos);
      if (Array.isArray(payload.photoShooters)) setPhotoShooters(payload.photoShooters);
      if (typeof payload.currentTurnSlot === "number") setCurrentTurnSlot(payload.currentTurnSlot);
      if (payload.themeId) {
        const found = FRAME_THEMES.find((t) => t.id === payload.themeId);
        if (found) setSelectedTheme(found);
      }
      if (payload.filterId) {
        const found = PHOTO_FILTERS.find((f) => f.id === payload.filterId);
        if (found) setSelectedFilter(found);
      }
      if (typeof payload.caption === "string") setCaptionText(payload.caption);
      if (Array.isArray(payload.stickers)) setStickers(payload.stickers);
      showToast("Photobox tersinkronisasi dengan pasangan! 🌸💻", { emoji: "✨" });
    });

    // D. Listen for Slot Captured Photo Broadcast
    channel.on("broadcast", { event: "slot-captured" }, ({ payload }) => {
      const { slotIndex, dataUrl, shooter } = payload;
      setPhotos((prev) => {
        const copy = [...prev];
        copy[slotIndex] = dataUrl;
        return copy;
      });
      setPhotoShooters((prev) => {
        const copy = [...prev];
        copy[slotIndex] = shooter;
        return copy;
      });

      // Advance turn
      setCurrentTurnSlot((prev) => (slotIndex + 1 < maxSlots ? slotIndex + 1 : 0));
      setPartnerCountdown(null);

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.5 },
        colors: shooter === "jane" ? ["#FFCCD5", "#FDA4AF"] : ["#BAE6FD", "#93C5FD"],
      });
      showToast(`${shooter === "jane" ? "Jane 🌸" : "Josh 💻"} snapped Grid ${slotIndex + 1}!`, {
        emoji: "📸",
        type: "love",
      });
    });

    // E. Listen for Live Partner Countdown
    channel.on("broadcast", { event: "partner-countdown" }, ({ payload }) => {
      setPartnerCountdown(payload);
    });

    // F. Listen for Shared Theme & Decoration Changes
    channel.on("broadcast", { event: "theme-change" }, ({ payload }) => {
      const found = FRAME_THEMES.find((t) => t.id === payload.themeId);
      if (found) setSelectedTheme(found);
    });

    channel.on("broadcast", { event: "filter-change" }, ({ payload }) => {
      const found = PHOTO_FILTERS.find((f) => f.id === payload.filterId);
      if (found) setSelectedFilter(found);
    });

    channel.on("broadcast", { event: "caption-change" }, ({ payload }) => {
      setCaptionText(payload.text);
    });

    channel.on("broadcast", { event: "stickers-update" }, ({ payload }) => {
      setStickers(payload.stickers);
    });

    channel.on("broadcast", { event: "reset-session" }, () => {
      setPhotos([null, null, null, null]);
      setPhotoShooters([null, null, null, null]);
      setCurrentTurnSlot(0);
      setStickers([]);
      showToast("Started a fresh Photobox strip together! 🎞️", { emoji: "✨" });
    });

    // Subscribe and track presence
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        setIsSocketConnected(true);
        await channel.track({
          role: myRoleRef.current,
          clientId,
          onlineAt: Date.now(),
        });
        channel.send({
          type: "broadcast",
          event: "heartbeat",
          payload: { role: myRoleRef.current, time: Date.now() },
        });
        channel.send({
          type: "broadcast",
          event: "request-state",
          payload: { requester: myRoleRef.current },
        });
      } else {
        setIsSocketConnected(false);
      }
    });

    // Heartbeat every 4s to guarantee partner presence
    const heartbeat = setInterval(() => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "heartbeat",
          payload: { role: myRoleRef.current, time: Date.now() },
        });
        channelRef.current.track({
          role: myRoleRef.current,
          clientId,
          onlineAt: Date.now(),
        });
      }
    }, 4000);

    return () => {
      clearInterval(heartbeat);
      supabase.removeChannel(channel);
      channelRef.current = null;
      setIsSocketConnected(false);
    };
  }, [sessionMode, maxSlots, supabase, showToast, clientId]);

  // Turn verification
  const assignedShooterForCurrentSlot = slotAssignments[currentTurnSlot % maxSlots];
  const isMyTurnInCollab = sessionMode === "solo" || assignedShooterForCurrentSlot === myRole;

  // 4. Capture photo for current slot (Triggered by shooter)
  const takeTurnShot = async (targetSlot: number) => {
    if (!cameraActive) {
      showToast("Please enable camera or upload photos from gallery!", { emoji: "📷", type: "error" });
      return;
    }

    setIsShootingSession(true);

    // 3s Countdown with Audio
    for (let c = 3; c > 0; c--) {
      setCountdown(c);
      if (soundEnabled) playBeep(750, 0.08);

      // Broadcast countdown to partner so their screen shows it in real time
      if (channelRef.current && sessionMode === "collab") {
        channelRef.current.send({
          type: "broadcast",
          event: "partner-countdown",
          payload: { slot: targetSlot, count: c },
        });
      }
      await new Promise((r) => setTimeout(r, 900));
    }

    setCountdown(0);
    if (soundEnabled) playShutterSound();
    setFlash(true);
    setTimeout(() => setFlash(false), 250);

    const shot = captureSnapshot();
    if (shot) {
      // Local state update
      setPhotos((prev) => {
        const copy = [...prev];
        copy[targetSlot] = shot;
        return copy;
      });
      setPhotoShooters((prev) => {
        const copy = [...prev];
        copy[targetSlot] = myRole;
        return copy;
      });

      // Broadcast to partner over Supabase Realtime
      if (channelRef.current && sessionMode === "collab") {
        channelRef.current.send({
          type: "broadcast",
          event: "slot-captured",
          payload: { slotIndex: targetSlot, dataUrl: shot, shooter: myRole },
        });
      }

      // Next slot
      const nextSlot = targetSlot + 1;
      if (nextSlot < maxSlots) {
        setCurrentTurnSlot(nextSlot);
      } else {
        // Strip complete!
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#FFCCD5", "#BAE6FD", "#FEF08A", "#D8D2FF"],
        });
        showToast("Photostrip complete! You both look so adorable ♡", { emoji: "💖", type: "love" });
      }
    }

    setCountdown(null);
    setIsShootingSession(false);
  };

  // Solo mode auto-session
  const runSoloAutoSession = async () => {
    if (!cameraActive) return;
    setIsShootingSession(true);
    const newPhotos = [...photos];

    for (let slot = 0; slot < maxSlots; slot++) {
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        if (soundEnabled) playBeep(750, 0.08);
        await new Promise((r) => setTimeout(r, 900));
      }
      setCountdown(0);
      if (soundEnabled) playShutterSound();
      setFlash(true);
      setTimeout(() => setFlash(false), 250);

      const shot = captureSnapshot();
      if (shot) {
        newPhotos[slot] = shot;
        setPhotos([...newPhotos]);
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    setCountdown(null);
    setIsShootingSession(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    showToast("Photobox strip complete! Now decorate your frame ♡", { emoji: "✨", type: "love" });
  };

  // Upload from Gallery fallback
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, maxSlots);
    const readers = fileList.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((results) => {
      const copy = [...photos];
      const shooterCopy = [...photoShooters];
      results.forEach((dataUrl, idx) => {
        if (idx < maxSlots) {
          copy[idx] = dataUrl;
          shooterCopy[idx] = myRole;
          // Broadcast each uploaded photo
          if (channelRef.current && sessionMode === "collab") {
            channelRef.current.send({
              type: "broadcast",
              event: "slot-captured",
              payload: { slotIndex: idx, dataUrl, shooter: myRole },
            });
          }
        }
      });
      setPhotos(copy);
      setPhotoShooters(shooterCopy);
      showToast(`Uploaded ${results.length} photos! 📸`, { emoji: "✨" });
    });
  };

  // Broadcast Theme change
  const handleThemeChange = (theme: FrameTheme) => {
    setSelectedTheme(theme);
    if (channelRef.current && sessionMode === "collab") {
      channelRef.current.send({
        type: "broadcast",
        event: "theme-change",
        payload: { themeId: theme.id },
      });
    }
  };

  // Broadcast Filter change
  const handleFilterChange = (filter: PhotoFilter) => {
    setSelectedFilter(filter);
    if (channelRef.current && sessionMode === "collab") {
      channelRef.current.send({
        type: "broadcast",
        event: "filter-change",
        payload: { filterId: filter.id },
      });
    }
  };

  // Broadcast Caption change
  const handleCaptionChange = (text: string) => {
    setCaptionText(text);
    if (channelRef.current && sessionMode === "collab") {
      channelRef.current.send({
        type: "broadcast",
        event: "caption-change",
        payload: { text },
      });
    }
  };

  // Broadcast Sticker add
  const addSticker = (emoji: string) => {
    const newSticker: PlacedSticker = {
      id: "stk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      emoji,
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 60,
      scale: 1,
    };
    const updated = [...stickers, newSticker];
    setStickers(updated);
    if (channelRef.current && sessionMode === "collab") {
      channelRef.current.send({
        type: "broadcast",
        event: "stickers-update",
        payload: { stickers: updated },
      });
    }
  };

  const removeSticker = (id: string) => {
    const updated = stickers.filter((s) => s.id !== id);
    setStickers(updated);
    if (channelRef.current && sessionMode === "collab") {
      channelRef.current.send({
        type: "broadcast",
        event: "stickers-update",
        payload: { stickers: updated },
      });
    }
  };

  // Reset entire round
  const resetEntireSession = () => {
    setPhotos([null, null, null, null]);
    setPhotoShooters([null, null, null, null]);
    setCurrentTurnSlot(0);
    setStickers([]);
    if (channelRef.current && sessionMode === "collab") {
      channelRef.current.send({
        type: "broadcast",
        event: "reset-session",
        payload: {},
      });
    }
  };

  // Swap Slot Assignment
  const toggleSlotShooter = (idx: number) => {
    const copy = [...slotAssignments];
    copy[idx] = copy[idx] === "josh" ? "jane" : "josh";
    setSlotAssignments(copy);
  };

  // 5. High-Resolution Canvas Export
  const generateCanvasImage = useCallback(async (): Promise<string | null> => {
    const validPhotos = photos.slice(0, maxSlots);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    let w = 800;
    let h = 2400; // default 1x4 vertical strip

    if (selectedLayout === "grid") {
      w = 1600;
      h = 1600;
    } else if (selectedLayout === "duo") {
      w = 800;
      h = 1350;
    }

    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = selectedTheme.bg;
    ctx.fillRect(0, 0, w, h);

    // Film sprocket holes
    if (selectedTheme.decorType === "film") {
      ctx.fillStyle = "#27272A";
      const holeW = 28;
      const holeH = 42;
      const step = 64;
      for (let y = 30; y < h - 30; y += step) {
        ctx.fillRect(16, y, holeW, holeH);
        ctx.fillRect(w - 16 - holeW, y, holeW, holeH);
      }
    }

    // Outer border
    ctx.strokeStyle = selectedTheme.borderColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, w - 14, h - 14);

    // Top Header Badge
    const headerY = selectedLayout === "grid" ? 70 : 80;
    ctx.font = "bold 32px var(--font-syne, 'Trebuchet MS', sans-serif)";
    ctx.fillStyle = selectedTheme.textColor;
    ctx.textAlign = "center";
    ctx.fillText(selectedTheme.badge, w / 2, headerY);

    const photoMarginX = selectedTheme.decorType === "film" ? 64 : 48;
    const headerSpace = 130;
    const footerSpace = 180;
    const availableH = h - headerSpace - footerSpace;

    const imgElements: (HTMLImageElement | null)[] = await Promise.all(
      validPhotos.map((src) => {
        if (!src) return Promise.resolve(null);
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null as any);
          img.src = src;
        });
      })
    );

    if (selectedLayout === "strip") {
      const photoH = (availableH - 3 * 24) / 4;
      const photoW = w - 2 * photoMarginX;

      for (let i = 0; i < 4; i++) {
        const py = headerSpace + i * (photoH + 24);
        const px = photoMarginX;
        ctx.fillStyle = "#E5E7EB";
        ctx.fillRect(px, py, photoW, photoH);

        const img = imgElements[i];
        if (img) {
          ctx.save();
          if (selectedFilter.css !== "none") ctx.filter = selectedFilter.css;
          const imgAspect = img.width / img.height;
          const boxAspect = photoW / photoH;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (imgAspect > boxAspect) {
            sw = img.height * boxAspect;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / boxAspect;
            sy = (img.height - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, px, py, photoW, photoH);
          ctx.restore();
        } else {
          ctx.font = "italic 28px sans-serif";
          ctx.fillStyle = "#9CA3AF";
          ctx.fillText(`Grid ${i + 1} (${slotAssignments[i] === "jane" ? "Jane 🌸" : "Josh 💻"})`, px + photoW / 2, py + photoH / 2);
        }

        ctx.strokeStyle = selectedTheme.borderColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(px, py, photoW, photoH);
      }
    } else if (selectedLayout === "grid") {
      const gap = 24;
      const photoW = (w - 2 * photoMarginX - gap) / 2;
      const photoH = (availableH - gap) / 2;

      const positions = [
        { x: photoMarginX, y: headerSpace },
        { x: photoMarginX + photoW + gap, y: headerSpace },
        { x: photoMarginX, y: headerSpace + photoH + gap },
        { x: photoMarginX + photoW + gap, y: headerSpace + photoH + gap },
      ];

      for (let i = 0; i < 4; i++) {
        const pos = positions[i];
        ctx.fillStyle = "#E5E7EB";
        ctx.fillRect(pos.x, pos.y, photoW, photoH);

        const img = imgElements[i];
        if (img) {
          ctx.save();
          if (selectedFilter.css !== "none") ctx.filter = selectedFilter.css;
          const imgAspect = img.width / img.height;
          const boxAspect = photoW / photoH;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (imgAspect > boxAspect) {
            sw = img.height * boxAspect;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / boxAspect;
            sy = (img.height - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, pos.x, pos.y, photoW, photoH);
          ctx.restore();
        }

        ctx.strokeStyle = selectedTheme.borderColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(pos.x, pos.y, photoW, photoH);
      }
    } else if (selectedLayout === "duo") {
      const photoH = (availableH - 24) / 2;
      const photoW = w - 2 * photoMarginX;

      for (let i = 0; i < 2; i++) {
        const py = headerSpace + i * (photoH + 24);
        const px = photoMarginX;
        ctx.fillStyle = "#E5E7EB";
        ctx.fillRect(px, py, photoW, photoH);

        const img = imgElements[i];
        if (img) {
          ctx.save();
          if (selectedFilter.css !== "none") ctx.filter = selectedFilter.css;
          const imgAspect = img.width / img.height;
          const boxAspect = photoW / photoH;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (imgAspect > boxAspect) {
            sw = img.height * boxAspect;
            sx = (img.width - sw) / 2;
          } else {
            sh = img.width / boxAspect;
            sy = (img.height - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, px, py, photoW, photoH);
          ctx.restore();
        }

        ctx.strokeStyle = selectedTheme.borderColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(px, py, photoW, photoH);
      }
    }

    // Stickers
    stickers.forEach((stk) => {
      const sx = (stk.x / 100) * w;
      const sy = (stk.y / 100) * h;
      ctx.font = `${Math.round(54 * stk.scale)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(stk.emoji, sx, sy);
    });

    // Caption
    const footerY = h - 95;
    ctx.textAlign = "center";
    ctx.font = "bold 32px var(--font-caveat, 'Comic Sans MS', cursive)";
    ctx.fillStyle = selectedTheme.textColor;
    ctx.fillText(captionText, w / 2, footerY);

    // Subtitle & Date
    ctx.font = "bold 20px var(--font-syne, 'Trebuchet MS', sans-serif)";
    ctx.fillStyle = selectedTheme.textColor;
    const dateStr = showDate ? ` • ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : "";
    ctx.fillText(`${selectedTheme.subtitle}${dateStr}`, w / 2, footerY + 45);

    return canvas.toDataURL("image/png");
  }, [photos, selectedTheme, selectedFilter, selectedLayout, captionText, showDate, stickers, maxSlots, slotAssignments]);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generateCanvasImage();
      if (!dataUrl) {
        showToast("Please snap some photos first!", { emoji: "📷", type: "error" });
        setIsExporting(false);
        return;
      }
      const link = document.createElement("a");
      link.download = `jj-4cuts-collab-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      showToast("Photostrip downloaded! Ready for printing or story IG ♡", { emoji: "🎞️", type: "love" });
    } catch (e) {
      console.error(e);
      showToast("Failed to download image", { emoji: "❌", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveToMemories = async () => {
    if (!user) {
      showToast("Please log in first to save to memories!", { emoji: "🔒", type: "error" });
      return;
    }

    setIsSavingMemory(true);
    try {
      const dataUrl = await generateCanvasImage();
      if (!dataUrl) {
        showToast("Please snap some photos first!", { emoji: "📸", type: "error" });
        setIsSavingMemory(false);
        return;
      }

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `photobooth/${user.id}/${Date.now()}.png`;

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("memories")
        .upload(filename, blob, { contentType: "image/png", upsert: true });

      let publicUrl = dataUrl;
      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from("memories").getPublicUrl(filename);
        if (urlData?.publicUrl) publicUrl = urlData.publicUrl;
      }

      await supabase.from("memories").insert({
        title: `JJ LDR Photobox (${selectedTheme.name}) 🎞️`,
        description: captionText || "Our long distance 4-cuts photobooth strip ♡",
        image_url: publicUrl,
        creator: user.id,
        memory_date: new Date().toISOString().split("T")[0],
      });

      confetti({ particleCount: 90, spread: 90, origin: { y: 0.5 } });
      showToast("Photostrip saved permanently to Our Memories scrapbook! 📸🌸", {
        emoji: "💖",
        type: "love",
      });
    } catch (e) {
      console.error(e);
      showToast("Saved photostrip!", { emoji: "✨" });
    } finally {
      setIsSavingMemory(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        {/* Screen Flash Animation */}
        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Header Title & Mode Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Sparkles size={12} className="text-[#9F1239]" />
                <span>JJ 4-Cuts • Realtime LDR Photobox</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-[#2C2824] tracking-tight">
                our online photobox 🎞️📸
              </h1>
              <p className="font-hand text-xl sm:text-2xl text-[#7A7269] mt-0.5">
                {sessionMode === "collab"
                  ? "janjian photobox berdua dari jauh: ganti-gantian pose Grid 1, 2, 3, 4 bareng Jane & Josh ♡"
                  : "take 4 cute poses yourself and decorate your photostrip ♡"}
              </p>
            </div>

            {/* Mode & Sound Switchers */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Session Mode Selector */}
              <div className="bg-[#FFFDF9] border-2 border-[#2C2824] p-1 rounded-2xl shadow-[2px_2px_0px_#2C2824] flex items-center gap-1">
                <button
                  onClick={() => setSessionMode("collab")}
                  className={`px-3 py-1.5 rounded-xl font-display font-black text-xs flex items-center gap-1.5 transition-all ${
                    sessionMode === "collab"
                      ? "bg-[#FFCCD5] border border-[#2C2824] text-[#2C2824] shadow-sm -translate-y-0.5"
                      : "text-[#7A7269] hover:text-[#2C2824]"
                  }`}
                >
                  <Users size={14} />
                  <span>Janjian Berdua 🌸💻</span>
                </button>
                <button
                  onClick={() => setSessionMode("solo")}
                  className={`px-3 py-1.5 rounded-xl font-display font-black text-xs flex items-center gap-1.5 transition-all ${
                    sessionMode === "solo"
                      ? "bg-[#BAE6FD] border border-[#2C2824] text-[#2C2824] shadow-sm -translate-y-0.5"
                      : "text-[#7A7269] hover:text-[#2C2824]"
                  }`}
                >
                  <User size={14} />
                  <span>Solo Mode</span>
                </button>
              </div>

              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="neu-box p-2 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] rounded-xl text-xs font-display font-bold flex items-center gap-1"
                title={soundEnabled ? "Mute shutter" : "Unmute shutter"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>

          {/* 🌸💻 REALTIME PRESENCE & TURN BANNER (When in Collab Mode) */}
          {sessionMode === "collab" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="neu-box p-4 bg-[#EDE9FE] border-[2.5px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              {/* Presence Status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-[#2C2824]"></span>
                  </span>
                  <span className="font-display font-black text-xs uppercase tracking-wider text-[#2C2824]">
                    LDR Room Live:
                  </span>
                </div>

                {/* Josh pill */}
                <div
                  className={`px-3 py-1 rounded-full border border-[#2C2824] text-xs font-display font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                    isJoshOnline
                      ? "bg-[#BAE6FD] text-[#2C2824]"
                      : "bg-[#FAF5EE] text-[#7A7269] opacity-60"
                  }`}
                >
                  <span>💻 Josh</span>
                  <span className="text-[10px]">
                    {isJoshOnline ? "● Ready" : "○ Offline"}
                  </span>
                </div>

                {/* Jane pill */}
                <div
                  className={`px-3 py-1 rounded-full border border-[#2C2824] text-xs font-display font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                    isJaneOnline
                      ? "bg-[#FFCCD5] text-[#2C2824]"
                      : "bg-[#FAF5EE] text-[#7A7269] opacity-60"
                  }`}
                >
                  <span>🌸 Jane</span>
                  <span className="text-[10px]">
                    {isJaneOnline ? "● Ready" : "○ Offline"}
                  </span>
                </div>

                {/* Both online badge */}
                {isJoshOnline && isJaneOnline && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-display font-black text-rose-600 bg-rose-100 border border-rose-300 px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                    ✨ Berdua Terhubung! ♡
                  </span>
                )}

                {/* Manual Sync Button */}
                <button
                  onClick={triggerManualSync}
                  className="px-2.5 py-1 rounded-xl border border-[#2C2824]/30 bg-white hover:bg-[#FAF5EE] text-[10px] font-display font-bold text-[#2C2824] flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                  title="Klik untuk sinkronisasi ulang status & foto"
                >
                  <RotateCcw size={11} />
                  <span>Sync 🔄</span>
                </button>
              </div>

              {/* Role Switcher for Testing/Visitors */}
              <div className="flex items-center gap-2 text-xs font-display font-bold">
                <span className="text-[#7A7269]">I am posing as:</span>
                <div className="flex bg-white rounded-xl border-2 border-[#2C2824] p-0.5 shadow-sm">
                  <button
                    onClick={() => setMyRole("josh")}
                    className={`px-2.5 py-0.5 rounded-lg transition-colors ${
                      myRole === "josh" ? "bg-[#BAE6FD] text-[#2C2824]" : "text-[#7A7269]"
                    }`}
                  >
                    Josh 💻
                  </button>
                  <button
                    onClick={() => setMyRole("jane")}
                    className={`px-2.5 py-0.5 rounded-lg transition-colors ${
                      myRole === "jane" ? "bg-[#FFCCD5] text-[#2C2824]" : "text-[#7A7269]"
                    }`}
                  >
                    Jane 🌸
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Dual Workspace: Left Camera/Controls + Right Live Photostrip Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ─── LEFT COLUMN: Live Camera & Turn-Based Viewfinder (7 cols) ─── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Camera & Turn Viewfinder Card */}
              <div className="neu-box p-4 sm:p-5 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] rounded-3xl space-y-4 relative overflow-hidden">
                {/* Header Row: Whose Turn is it? */}
                <div className="flex items-center justify-between pb-2 border-b-2 border-[#2C2824]/10">
                  <div className="flex items-center gap-2">
                    {sessionMode === "collab" ? (
                      <span className="font-display font-black text-sm text-[#2C2824] flex items-center gap-1.5">
                        <Clock size={16} className="text-[#9F1239]" />
                        <span>
                          Giliran Grid {currentTurnSlot + 1}:{" "}
                          <strong className={assignedShooterForCurrentSlot === "jane" ? "text-rose-600" : "text-sky-600"}>
                            {assignedShooterForCurrentSlot === "jane" ? "Jane 🌸" : "Josh 💻"}
                          </strong>
                        </span>
                      </span>
                    ) : (
                      <span className="font-display font-black text-sm text-[#2C2824]">
                        Solo Viewfinder
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMirrored(!isMirrored)}
                      className={`p-1.5 rounded-lg border border-[#2C2824]/30 text-xs font-bold transition-colors ${
                        isMirrored ? "bg-[#BAE6FD] text-[#2C2824]" : "bg-[#FAF5EE]"
                      }`}
                      title="Mirror view flip"
                    >
                      <FlipHorizontal size={15} />
                    </button>
                    <button
                      onClick={toggleCameraFacing}
                      className="p-1.5 rounded-lg border border-[#2C2824]/30 text-xs font-bold bg-[#FAF5EE] hover:bg-[#EDE9FE] transition-colors"
                      title="Switch front / rear camera"
                    >
                      <RotateCcw size={15} />
                    </button>
                  </div>
                </div>

                {/* Viewfinder: Active Camera OR Waiting State for Partner */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#2C2824] border-2 border-[#2C2824] flex items-center justify-center">
                  {/* If it's my turn OR solo mode: show live camera */}
                  {isMyTurnInCollab ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{
                          transform: isMirrored ? "scaleX(-1)" : "none",
                          filter: selectedFilter.css,
                        }}
                      />

                      {/* Countdown Overlay */}
                      <AnimatePresence>
                        {countdown !== null && countdown > 0 && (
                          <motion.div
                            key={countdown}
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1.1, opacity: 1 }}
                            exit={{ scale: 1.4, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                          >
                            <div className="w-24 h-24 rounded-full bg-[#FFCCD5] border-4 border-[#2C2824] shadow-[4px_4px_0px_#2C2824] flex items-center justify-center font-display font-black text-5xl text-[#2C2824]">
                              {countdown}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Camera disabled message */}
                      {!cameraActive && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF5EE] p-6 text-center space-y-3">
                          <div className="w-14 h-14 rounded-2xl bg-[#FFE4E6] border-2 border-[#2C2824] flex items-center justify-center text-2xl shadow-[3px_3px_0px_#2C2824]">
                            📷
                          </div>
                          <p className="font-display font-black text-base text-[#2C2824]">
                            Kamera belum aktif
                          </p>
                          <button
                            onClick={startCamera}
                            className="neu-btn neu-btn-pink text-xs py-2 px-4 shadow-[2px_2px_0px_#2C2824]"
                          >
                            Nyalakan Kamera
                          </button>
                        </div>
                      )}

                      {/* "It's your turn" pulsating pill */}
                      {sessionMode === "collab" && (
                        <div className="absolute top-3 left-3 bg-[#FEF08A] border-2 border-[#2C2824] px-3.5 py-1 rounded-full text-xs font-display font-black text-[#2C2824] shadow-[2px_2px_0px_#2C2824] animate-bounce">
                          👉 Giliranmu Pose untuk Grid {currentTurnSlot + 1}! 📸
                        </div>
                      )}
                    </>
                  ) : (
                    /* Waiting view when it's partner's turn */
                    <div className="w-full h-full bg-[#FAF5EE] p-8 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-20 h-20 rounded-3xl bg-[#FFCCD5] border-2 border-[#2C2824] shadow-[4px_4px_0px_#2C2824] flex items-center justify-center text-4xl animate-bounce">
                        {assignedShooterForCurrentSlot === "jane" ? "🌸" : "💻"}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-display font-black text-xl text-[#2C2824]">
                          {assignedShooterForCurrentSlot === "jane" ? "Jane lagi pose untuk Grid " : "Josh lagi pose untuk Grid "}
                          {currentTurnSlot + 1}...
                        </h3>
                        <p className="font-hand text-lg text-[#7A7269]">
                          tunggu yaa, fotonya bakal langsung muncul di layar kamu! ♡
                        </p>
                      </div>

                      {/* Partner countdown display if active */}
                      {partnerCountdown && (
                        <div className="bg-[#FEF08A] border-2 border-[#2C2824] px-4 py-2 rounded-2xl shadow-[3px_3px_0px_#2C2824] font-display font-black text-xl animate-pulse">
                          📸 Menjepret dalam: {partnerCountdown.count} detik!
                        </div>
                      )}

                      <div className="pt-2 text-xs text-[#7A7269] font-body flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>Siapkan pose manismu untuk grid berikutnya!</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shutter Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {sessionMode === "collab" ? (
                    <>
                      {isMyTurnInCollab ? (
                        <button
                          onClick={() => takeTurnShot(currentTurnSlot)}
                          disabled={isShootingSession || !cameraActive}
                          className="flex-1 neu-btn neu-btn-pink py-3 px-5 text-sm sm:text-base font-display font-black shadow-[4px_4px_0px_#2C2824] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                        >
                          <Play size={18} />
                          <span>
                            {isShootingSession
                              ? "Menjepret..."
                              : `Jepret Grid ${currentTurnSlot + 1} (Hitung Mundur 3s) 📸`}
                          </span>
                        </button>
                      ) : (
                        <div className="flex-1 py-3 px-4 rounded-xl border-2 border-[#2C2824]/30 bg-[#FAF5EE] text-center font-display font-bold text-xs text-[#7A7269]">
                          ⏳ Menunggu pasanganmu mengambil foto Grid {currentTurnSlot + 1}...
                        </div>
                      )}

                      {/* Upload for this turn */}
                      {isMyTurnInCollab && (
                        <label className="neu-btn bg-[#BAE6FD] hover:bg-[#93C5FD] py-3 px-3 text-xs font-display font-bold border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] flex items-center gap-1 cursor-pointer">
                          <Upload size={14} />
                          <span>Pilih Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                const dataUrl = reader.result as string;
                                setPhotos((prev) => {
                                  const copy = [...prev];
                                  copy[currentTurnSlot] = dataUrl;
                                  return copy;
                                });
                                if (channelRef.current) {
                                  channelRef.current.send({
                                    type: "broadcast",
                                    event: "slot-captured",
                                    payload: { slotIndex: currentTurnSlot, dataUrl, shooter: myRole },
                                  });
                                }
                                setCurrentTurnSlot((prev) => (prev + 1 < maxSlots ? prev + 1 : 0));
                              };
                              reader.readAsDataURL(file);
                            }}
                            className="hidden"
                          />
                        </label>
                      )}
                    </>
                  ) : (
                    /* Solo Mode Shutter */
                    <>
                      <button
                        onClick={runSoloAutoSession}
                        disabled={isShootingSession || !cameraActive}
                        className="flex-1 neu-btn neu-btn-pink py-3 px-5 text-sm sm:text-base font-display font-black shadow-[4px_4px_0px_#2C2824] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                      >
                        <Play size={18} />
                        <span>{isShootingSession ? "Menjepret..." : "Mulai Sesi 4-Cuts Otomatis (3s)"}</span>
                      </button>

                      <button
                        onClick={() => takeTurnShot(currentTurnSlot)}
                        disabled={isShootingSession || !cameraActive}
                        className="neu-btn bg-[#BAE6FD] hover:bg-[#93C5FD] py-3 px-4 text-xs font-display font-bold border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Camera size={16} />
                        <span>Manual 1-Shot</span>
                      </button>
                    </>
                  )}

                  {/* Reset Round */}
                  <button
                    onClick={resetEntireSession}
                    className="p-3 rounded-2xl border-2 border-[#2C2824] bg-[#FFFDF9] hover:bg-rose-50 text-[#7A7269] hover:text-rose-600 shadow-[2px_2px_0px_#2C2824] transition-colors"
                    title="Mulai strip baru dari awal"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              </div>

              {/* Grid Slots Turn Manager (Ganti-Gantian 1, 2, 3, 4) */}
              <div className="neu-box p-4 bg-[#FFFDF9] border-[2px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-display font-bold text-[#2C2824]">
                  <span className="flex items-center gap-1.5">
                    <span>Aturan Giliran Grid (Ganti-gantian):</span>
                  </span>
                  <span className="text-[#7A7269] font-normal">
                    {photos.filter((p, i) => i < maxSlots && !!p).length} / {maxSlots} terisi
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {Array.from({ length: maxSlots }).map((_, idx) => {
                    const src = photos[idx];
                    const shooter = photoShooters[idx] || slotAssignments[idx];
                    const isTarget = currentTurnSlot === idx;

                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (sessionMode === "solo" || isMyTurnInCollab) {
                            setCurrentTurnSlot(idx);
                          }
                        }}
                        className={`relative aspect-[4/3] rounded-xl border-2 overflow-hidden cursor-pointer group transition-all ${
                          isTarget
                            ? "ring-4 ring-rose-400/50 border-[#2C2824] -translate-y-1 shadow-[3px_3px_0px_#2C2824]"
                            : src
                            ? "border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                            : "border-dashed border-[#2C2824]/40 bg-[#FAF5EE]"
                        }`}
                      >
                        {src ? (
                          <>
                            <img
                              src={src}
                              alt={`Grid ${idx + 1}`}
                              className="w-full h-full object-cover"
                              style={{ filter: selectedFilter.css }}
                            />
                            {/* Shooter Badge Tag */}
                            <div className="absolute bottom-1 left-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-display font-bold text-white flex items-center gap-0.5">
                              <span>{shooter === "jane" ? "🌸 Jane" : "💻 Josh"}</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
                            <span className="text-sm">{shooter === "jane" ? "🌸" : "💻"}</span>
                            <span className="text-[10px] font-display font-bold text-[#2C2824] mt-0.5">
                              Grid {idx + 1}
                            </span>
                            <span className="text-[9px] text-[#7A7269] font-body">
                              {shooter === "jane" ? "Jane" : "Josh"}
                            </span>
                          </div>
                        )}

                        {/* Turn Indicator Dot */}
                        {isTarget && (
                          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Option to Swap Assignment */}
                {sessionMode === "collab" && (
                  <div className="flex items-center justify-between text-[11px] text-[#7A7269] pt-1">
                    <span>Mau ubah urutan? Klik tombol tukar:</span>
                    <button
                      onClick={() => {
                        setSlotAssignments((prev) => [prev[1], prev[0], prev[3], prev[2]]);
                      }}
                      className="text-xs font-display font-bold text-[#2C2824] hover:text-rose-600 flex items-center gap-1"
                    >
                      <Shuffle size={12} />
                      <span>Tukar Urutan Giliran</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 🎨 CUSTOMIZE DRAWER: 10 Frames, Filters, Stickers */}
              <div className="neu-box p-5 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] rounded-3xl space-y-5">
                {/* 1. Layout Chooser */}
                <div className="space-y-2">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824]">
                    1. Pilih Tata Letak Strip:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "strip", label: "Classic 4-Cut Strip", icon: "🎞️" },
                      { id: "grid", label: "2×2 Square Grid", icon: "🔲" },
                      { id: "duo", label: "Duo Polaroid (2-Cut)", icon: "🖼️" },
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setSelectedLayout(l.id as PhotoboothLayout)}
                        className={`py-2 px-2 rounded-xl border-2 text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all ${
                          selectedLayout === l.id
                            ? "bg-[#FFCCD5] border-[#2C2824] shadow-[2px_2px_0px_#2C2824] -translate-y-0.5"
                            : "bg-[#FAF5EE] border-[#2C2824]/30 hover:bg-[#FFFDF9]"
                        }`}
                      >
                        <span>{l.icon}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 10 Custom Cute Frames */}
                <div className="space-y-2">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] flex items-center justify-between">
                    <span>2. Pilihan Frame Lucu (10 Tema):</span>
                    <span className="text-[#7A7269] normal-case font-body font-normal text-xs">
                      Aktif: <strong className="text-[#2C2824] font-display">{selectedTheme.name}</strong>
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {FRAME_THEMES.map((theme) => {
                      const active = selectedTheme.id === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => handleThemeChange(theme)}
                          className={`p-2.5 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between h-[76px] ${
                            active
                              ? "border-[#2C2824] shadow-[3px_3px_0px_#2C2824] -translate-y-1 ring-2 ring-[#2C2824]/10"
                              : "border-[#2C2824]/25 hover:border-[#2C2824] opacity-85 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: theme.bg }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xl">{theme.emoji}</span>
                            {active && (
                              <span className="w-4 h-4 rounded-full bg-[#2C2824] text-white flex items-center justify-center text-[9px]">
                                ✓
                              </span>
                            )}
                          </div>
                          <span
                            className="font-display font-black text-xs leading-tight line-clamp-1"
                            style={{ color: theme.textColor }}
                          >
                            {theme.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Aesthetic Filters */}
                <div className="space-y-2">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824]">
                    3. Filter Estetik:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PHOTO_FILTERS.map((f) => {
                      const active = selectedFilter.id === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => handleFilterChange(f)}
                          className={`px-3 py-1.5 rounded-xl border-2 text-xs font-display font-bold transition-all ${
                            active
                              ? "bg-[#D8D2FF] border-[#2C2824] shadow-[2px_2px_0px_#2C2824] -translate-y-0.5"
                              : "bg-[#FAF5EE] border-[#2C2824]/20 hover:bg-[#FFFDF9]"
                          }`}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Stickers & Caption */}
                <div className="space-y-3 pt-2 border-t-2 border-[#2C2824]/10">
                  <div className="space-y-1.5">
                    <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] flex items-center gap-1.5">
                      <Smile size={14} />
                      <span>Klik untuk Pasang Stiker Lucu:</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#FAF5EE] border border-[#2C2824]/20">
                      {STICKER_LIST.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => addSticker(emoji)}
                          className="w-8 h-8 rounded-lg bg-white border border-[#2C2824]/20 hover:scale-125 transition-transform flex items-center justify-center text-lg shadow-sm"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Type size={14} />
                        <span>Tulisan Tangan Caption Bawah:</span>
                      </span>
                      <label className="flex items-center gap-1 text-[11px] font-normal cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showDate}
                          onChange={(e) => setShowDate(e.target.checked)}
                          className="accent-[#2C2824]"
                        />
                        <span>Tampilkan Tanggal</span>
                      </label>
                    </label>
                    <input
                      type="text"
                      value={captionText}
                      onChange={(e) => handleCaptionChange(e.target.value)}
                      placeholder="e.g. 'jane × josh • 28 mei 2026 ♡'"
                      className="w-full border-2 border-[#2C2824] rounded-xl px-3.5 py-2 text-sm font-hand bg-[#FAF5EE] focus:bg-[#FFFDF9] focus:outline-none shadow-[2px_2px_0px_#2C2824]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN: Realtime Photostrip Preview & Download (5 cols) ─── */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between px-1">
                <span className="font-display font-black text-sm text-[#2C2824] flex items-center gap-1.5">
                  <span>🎞️ Preview Cetak Photostrip Bersama</span>
                </span>
                <span className="text-xs text-[#7A7269] font-body">Realtime Sync</span>
              </div>

              {/* ─── LIVE PHOTOSTRIP PREVIEW ─── */}
              <div
                ref={photostripRef}
                className="relative rounded-3xl border-[3.5px] shadow-[8px_8px_0px_#2C2824] transition-colors p-4 sm:p-5 select-none mx-auto max-w-[340px] sm:max-w-[360px]"
                style={{
                  backgroundColor: selectedTheme.bg,
                  borderColor: selectedTheme.borderColor,
                }}
              >
                {/* 35mm Film Sprockets */}
                {selectedTheme.decorType === "film" && (
                  <>
                    <div className="absolute top-4 bottom-4 left-1.5 w-3.5 flex flex-col justify-between pointer-events-none">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-3.5 rounded-sm bg-[#27272A]" />
                      ))}
                    </div>
                    <div className="absolute top-4 bottom-4 right-1.5 w-3.5 flex flex-col justify-between pointer-events-none">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-3.5 rounded-sm bg-[#27272A]" />
                      ))}
                    </div>
                  </>
                )}

                {/* Top Badge */}
                <div className="text-center pt-1 pb-3">
                  <p
                    className="font-display font-black text-xs sm:text-sm tracking-wider uppercase"
                    style={{ color: selectedTheme.textColor }}
                  >
                    {selectedTheme.badge}
                  </p>
                </div>

                {/* Photo Cuts Grid/Strip */}
                <div
                  className={`relative ${
                    selectedLayout === "strip"
                      ? "space-y-3"
                      : selectedLayout === "grid"
                      ? "grid grid-cols-2 gap-2"
                      : "space-y-3"
                  } ${selectedTheme.decorType === "film" ? "px-4" : ""}`}
                >
                  {Array.from({ length: maxSlots }).map((_, idx) => {
                    const src = photos[idx];
                    const shooter = photoShooters[idx] || slotAssignments[idx];

                    return (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] rounded-lg border-2 border-[#2C2824] overflow-hidden bg-[#E5E7EB] shadow-sm flex items-center justify-center"
                      >
                        {src ? (
                          <>
                            <img
                              src={src}
                              alt={`Shot ${idx + 1}`}
                              className="w-full h-full object-cover"
                              style={{ filter: selectedFilter.css }}
                            />
                            {/* Mini Shooter Pill */}
                            <div className="absolute top-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-display font-bold text-white flex items-center gap-1">
                              <span>{shooter === "jane" ? "🌸 Jane" : "💻 Josh"}</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2 text-[#9CA3AF]">
                            <Camera size={20} className="mx-auto mb-1 opacity-50" />
                            <p className="font-hand text-sm">
                              grid {idx + 1} ({shooter === "jane" ? "Jane 🌸" : "Josh 💻"})
                            </p>
                          </div>
                        )}

                        {selectedTheme.decorType === "film" && (
                          <div className="absolute bottom-1 right-1 text-[9px] font-mono text-[#EF4444] font-bold px-1 bg-black/70 rounded">
                            ▲ 2{idx + 1}A
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Floating Placed Stickers */}
                  {stickers.map((stk) => (
                    <div
                      key={stk.id}
                      onClick={() => removeSticker(stk.id)}
                      className="absolute text-3xl sm:text-4xl cursor-pointer hover:scale-125 transition-transform"
                      style={{
                        left: `${stk.x}%`,
                        top: `${stk.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      title="Klik untuk hapus stiker"
                    >
                      {stk.emoji}
                    </div>
                  ))}
                </div>

                {/* Bottom Handwritten Caption & Subtitle */}
                <div className="text-center pt-4 pb-1 space-y-1">
                  <p
                    className="font-hand text-xl sm:text-2xl leading-none font-bold"
                    style={{ color: selectedTheme.textColor }}
                  >
                    {captionText}
                  </p>
                  <p
                    className="font-display font-bold text-[10px] tracking-wider uppercase opacity-85"
                    style={{ color: selectedTheme.textColor }}
                  >
                    {selectedTheme.subtitle}
                    {showDate && ` • ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                  </p>
                </div>
              </div>

              {/* 📥 EXPORT & SAVE BUTTONS */}
              <div className="neu-box p-4 bg-[#FFFDF9] border-[2px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] rounded-2xl space-y-2.5">
                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="w-full neu-btn neu-btn-pink py-3 px-4 font-display font-black text-sm shadow-[3px_3px_0px_#2C2824] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download size={16} />
                  <span>{isExporting ? "Rendering High-Res..." : "Download Strip High-Res PNG 📥"}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={handleSaveToMemories}
                    disabled={isSavingMemory}
                    className="w-full neu-btn bg-[#BAE6FD] hover:bg-[#93C5FD] py-2.5 px-4 font-display font-bold text-xs border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Heart size={14} className="fill-[#2C2824]" />
                    <span>{isSavingMemory ? "Menyimpan ke Scrapbook..." : "Simpan ke Galeri Kenangan (/memories) 🌸"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
