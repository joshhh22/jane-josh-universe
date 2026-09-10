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

// ─── STICKER COLLECTION ──────────────────────────────────────────────
export const STICKER_LIST = [
  "🌸", "💻", "💖", "🎀", "✨", "🐱", "🍗", "💌", "🧸", "🍓", "🌷", "☀️", "💍", "🍀", "🍰", "🌙"
];

interface PlacedSticker {
  id: string;
  emoji: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  scale: number;
}

export type PhotoboothLayout = "strip" | "grid" | "duo";

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
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
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

// ─── MAIN PHOTOBOOTH PAGE COMPONENT ──────────────────────────────────
export default function PhotoboothPage() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  // Camera & Stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [isMirrored, setIsMirrored] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Photos captured (array of data URLs, 4 slots)
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  // Shoot Countdown State
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isShootingSession, setIsShootingSession] = useState(false);
  const [flash, setFlash] = useState(false);

  // Design Settings
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

  // Maximum photo slots depending on layout
  const maxSlots = selectedLayout === "duo" ? 2 : 4;

  // 1. Initialize Camera Stream
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraActive(false);
      showToast("Camera access was blocked or unavailable. You can also upload photos from gallery!", {
        emoji: "📸",
        type: "error",
      });
    }
  }, [cameraFacing, showToast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Flip Camera Front/Back
  const toggleCameraFacing = () => {
    setCameraFacing((prev) => (prev === "user" ? "environment" : "user"));
  };

  // 2. Capture a Single Frame from Video
  const captureSnapshot = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = document.createElement("canvas");
    // Standard 4:3 portrait ratio crop for photobox
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

    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Handle mirror flip
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.92);
  }, [isMirrored]);

  // 3. Automated 4-Cuts Session Execution
  const runAutoShootSession = async () => {
    if (!cameraActive) {
      showToast("Please enable camera or upload photos first!", { emoji: "📷", type: "error" });
      return;
    }

    setIsShootingSession(true);
    const newPhotos = [...photos];

    for (let slot = 0; slot < maxSlots; slot++) {
      setActiveSlot(slot);

      // Countdown 3.. 2.. 1..
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
    setActiveSlot(null);
    setIsShootingSession(false);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFCCD5", "#BAE6FD", "#FEF08A", "#D8D2FF"],
    });
    showToast("Photobox strip complete! Now customize your frame ♡", { emoji: "✨", type: "love" });
  };

  // Manual 1-Shot capture into specific slot
  const takeSingleShot = (targetIndex: number) => {
    if (!cameraActive) return;
    if (soundEnabled) playShutterSound();
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    const shot = captureSnapshot();
    if (shot) {
      const copy = [...photos];
      copy[targetIndex] = shot;
      setPhotos(copy);
    }
  };

  // 4. File Upload Fallback (Multiple or Single)
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
      results.forEach((dataUrl, idx) => {
        if (idx < maxSlots) copy[idx] = dataUrl;
      });
      setPhotos(copy);
      showToast(`Uploaded ${results.length} photos from gallery! 📸`, { emoji: "✨" });
    });
  };

  // Retake individual slot
  const resetSlot = (slotIdx: number) => {
    const copy = [...photos];
    copy[slotIdx] = null;
    setPhotos(copy);
  };

  // Reset all
  const resetAllPhotos = () => {
    setPhotos([null, null, null, null]);
    setStickers([]);
  };

  // 5. Add Sticker
  const addSticker = (emoji: string) => {
    const newSticker: PlacedSticker = {
      id: "stk_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
      emoji,
      x: 30 + Math.random() * 40,
      y: 20 + Math.random() * 60,
      scale: 1,
    };
    setStickers((prev) => [...prev, newSticker]);
    showToast(`Added sticker ${emoji}! Drag to position ♡`, { emoji: "🎀" });
  };

  const removeSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // 6. Canvas High-Resolution Export
  const generateCanvasImage = useCallback(async (): Promise<string | null> => {
    const validPhotos = photos.slice(0, maxSlots);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Dimension scaling
    let w = 800;
    let h = 2400; // default for 1x4 vertical strip

    if (selectedLayout === "grid") {
      w = 1600;
      h = 1600;
    } else if (selectedLayout === "duo") {
      w = 800;
      h = 1350;
    }

    canvas.width = w;
    canvas.height = h;

    // Draw background
    ctx.fillStyle = selectedTheme.bg;
    ctx.fillRect(0, 0, w, h);

    // Decorative 35mm film perforations
    if (selectedTheme.decorType === "film") {
      ctx.fillStyle = "#27272A";
      const holeW = 28;
      const holeH = 42;
      const step = 64;
      for (let y = 30; y < h - 30; y += step) {
        // Left sprocket holes
        ctx.fillRect(16, y, holeW, holeH);
        // Right sprocket holes
        ctx.fillRect(w - 16 - holeW, y, holeW, holeH);
      }
    }

    // Outer border
    ctx.strokeStyle = selectedTheme.borderColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, w - 14, h - 14);

    // Header Badge
    const headerY = selectedLayout === "grid" ? 70 : 80;
    ctx.font = "bold 32px var(--font-syne, 'Trebuchet MS', sans-serif)";
    ctx.fillStyle = selectedTheme.textColor;
    ctx.textAlign = "center";
    ctx.fillText(selectedTheme.badge, w / 2, headerY);

    // Load and draw photo slots
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
      // 4 cuts vertically
      const photoH = (availableH - 3 * 24) / 4;
      const photoW = w - 2 * photoMarginX;

      for (let i = 0; i < 4; i++) {
        const py = headerSpace + i * (photoH + 24);
        const px = photoMarginX;

        // Draw photo frame placeholder
        ctx.fillStyle = "#E5E7EB";
        ctx.fillRect(px, py, photoW, photoH);

        const img = imgElements[i];
        if (img) {
          ctx.save();
          // Apply filter on canvas
          if (selectedFilter.css !== "none") {
            ctx.filter = selectedFilter.css;
          }
          // Draw image cropped cover
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
          // Empty slot placeholder
          ctx.font = "italic 28px sans-serif";
          ctx.fillStyle = "#9CA3AF";
          ctx.fillText(`Pose ${i + 1} ♡`, px + photoW / 2, py + photoH / 2);
        }

        // Inner frame stroke around each photo
        ctx.strokeStyle = selectedTheme.borderColor;
        ctx.lineWidth = 6;
        ctx.strokeRect(px, py, photoW, photoH);
      }
    } else if (selectedLayout === "grid") {
      // 2x2 grid
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
      // 2 cuts vertically
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

    // Draw stickers
    stickers.forEach((stk) => {
      const sx = (stk.x / 100) * w;
      const sy = (stk.y / 100) * h;
      ctx.font = `${Math.round(54 * stk.scale)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(stk.emoji, sx, sy);
    });

    // Draw Footer Caption & Subtitle
    const footerY = h - 95;
    ctx.textAlign = "center";
    ctx.font = "bold 32px var(--font-caveat, 'Comic Sans MS', cursive)";
    ctx.fillStyle = selectedTheme.textColor;
    ctx.fillText(captionText, w / 2, footerY);

    // Subtitle / Date
    ctx.font = "bold 20px var(--font-syne, 'Trebuchet MS', sans-serif)";
    ctx.fillStyle = selectedTheme.textColor;
    const dateStr = showDate ? ` • ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : "";
    ctx.fillText(`${selectedTheme.subtitle}${dateStr}`, w / 2, footerY + 45);

    return canvas.toDataURL("image/png");
  }, [photos, selectedTheme, selectedFilter, selectedLayout, captionText, showDate, stickers, maxSlots]);

  // Download high-res PNG
  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generateCanvasImage();
      if (!dataUrl) {
        showToast("Please capture some photos first!", { emoji: "📷", type: "error" });
        setIsExporting(false);
        return;
      }
      const link = document.createElement("a");
      link.download = `jane-josh-4cuts-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      showToast("Photostrip downloaded successfully! 🎉", { emoji: "🎞️", type: "love" });
    } catch (e) {
      console.error(e);
      showToast("Failed to download image", { emoji: "❌", type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  // Save directly to Memories Scrapbook (/memories)
  const handleSaveToMemories = async () => {
    if (!user) {
      showToast("Please log in first to save directly to Our Memories!", { emoji: "🔒", type: "error" });
      return;
    }

    setIsSavingMemory(true);
    try {
      const dataUrl = await generateCanvasImage();
      if (!dataUrl) {
        showToast("Please take some photos first!", { emoji: "📸", type: "error" });
        setIsSavingMemory(false);
        return;
      }

      // Convert dataUrl to blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const filename = `photobooth/${user.id}/${Date.now()}.png`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("memories")
        .upload(filename, blob, { contentType: "image/png", upsert: true });

      let publicUrl = dataUrl;
      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from("memories").getPublicUrl(filename);
        if (urlData?.publicUrl) publicUrl = urlData.publicUrl;
      }

      // Insert record to memories table
      const { error: insertErr } = await supabase.from("memories").insert({
        title: `JJ Photobox (${selectedTheme.name}) 🎞️`,
        description: captionText || "Our cute 4-cuts photobooth memories ♡",
        image_url: publicUrl,
        creator: user.id,
        memory_date: new Date().toISOString().split("T")[0],
      });

      if (insertErr) {
        console.warn("Memories insert notice:", insertErr);
      }

      confetti({ particleCount: 90, spread: 90, origin: { y: 0.5 } });
      showToast("Photostrip saved permanently to Our Memories scrapbook! 📸🌸", {
        emoji: "💖",
        type: "love",
      });
    } catch (e: any) {
      console.error(e);
      showToast("Saved photostrip! Download available anytime.", { emoji: "✨" });
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

        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E6] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Sparkles size={12} className="text-[#9F1239]" />
                <span>JJ 4-Cuts • Korean Photobox</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-5xl text-[#2C2824] tracking-tight">
                our online photobox 🎞️📸
              </h1>
              <p className="font-hand text-xl sm:text-2xl text-[#7A7269] mt-0.5">
                strike 4 cute poses, decorate your frame, and print our digital photostrip ♡
              </p>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="neu-box p-2 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] rounded-xl text-xs font-display font-bold flex items-center gap-1.5"
                title={soundEnabled ? "Mute shutter sound" : "Unmute shutter sound"}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span className="hidden sm:inline">{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
              </button>

              <label className="neu-btn neu-btn-yellow text-xs py-2 px-3 shadow-[2.5px_2.5px_0px_#2C2824] flex items-center gap-1.5 cursor-pointer">
                <Upload size={14} />
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Main Dual Workspace: Left Camera/Controls + Right Live Photostrip Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ─── LEFT COLUMN: Live Camera & Capture Tools (7 cols) ─── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Camera Viewfinder Box */}
              <div className="neu-box p-4 sm:p-5 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] rounded-3xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b-2 border-[#2C2824]/10">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse border border-[#2C2824]" />
                    <span className="font-display font-black text-sm text-[#2C2824]">
                      {cameraActive ? "Live Viewfinder" : "Camera Offline"}
                    </span>
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

                {/* Video Monitor with Live Filter Applied */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#2C2824] border-2 border-[#2C2824] flex items-center justify-center">
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

                  {/* Camera Off Placeholder */}
                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAF5EE] p-6 text-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#FFE4E6] border-2 border-[#2C2824] flex items-center justify-center text-2xl shadow-[3px_3px_0px_#2C2824]">
                        📷
                      </div>
                      <p className="font-display font-black text-base text-[#2C2824]">
                        Camera is currently disabled
                      </p>
                      <button
                        onClick={startCamera}
                        className="neu-btn neu-btn-pink text-xs py-2 px-4 shadow-[2px_2px_0px_#2C2824]"
                      >
                        Turn on Camera
                      </button>
                    </div>
                  )}

                  {/* Active slot indicator pill */}
                  {isShootingSession && activeSlot !== null && (
                    <div className="absolute top-3 left-3 bg-[#FEF08A] border-2 border-[#2C2824] px-3 py-1 rounded-full text-xs font-display font-black text-[#2C2824] shadow-[2px_2px_0px_#2C2824] animate-bounce">
                      Capturing Pose {activeSlot + 1} of {maxSlots} 📸
                    </div>
                  )}
                </div>

                {/* Shutter Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={runAutoShootSession}
                    disabled={isShootingSession || !cameraActive}
                    className="flex-1 neu-btn neu-btn-pink py-3 px-5 text-sm sm:text-base font-display font-black shadow-[4px_4px_0px_#2C2824] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  >
                    <Play size={18} />
                    <span>{isShootingSession ? "Capturing 4-Cuts..." : "Start 4-Cuts Auto Session (3s)"}</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextEmpty = photos.findIndex((p, idx) => idx < maxSlots && !p);
                      takeSingleShot(nextEmpty !== -1 ? nextEmpty : 0);
                    }}
                    disabled={isShootingSession || !cameraActive}
                    className="neu-btn bg-[#BAE6FD] hover:bg-[#93C5FD] py-3 px-4 text-xs sm:text-sm font-display font-bold border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Camera size={16} />
                    <span>Manual 1-Shot</span>
                  </button>

                  <button
                    onClick={resetAllPhotos}
                    className="p-3 rounded-2xl border-2 border-[#2C2824] bg-[#FFFDF9] hover:bg-rose-50 text-[#7A7269] hover:text-rose-600 shadow-[2px_2px_0px_#2C2824] transition-colors"
                    title="Clear all photos"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* 4 Thumbnail Slot Trays (Click to Retake individual photo) */}
              <div className="neu-box p-4 bg-[#FFFDF9] border-[2px] border-[#2C2824] shadow-[4px_4px_0px_#2C2824] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-display font-bold text-[#7A7269]">
                  <span>Slot Photos (Click any slot to retake):</span>
                  <span>{photos.filter((p, i) => i < maxSlots && !!p).length} / {maxSlots} photos</span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {Array.from({ length: maxSlots }).map((_, idx) => {
                    const src = photos[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => takeSingleShot(idx)}
                        className={`relative aspect-[4/3] rounded-xl border-2 overflow-hidden cursor-pointer group transition-all ${
                          src
                            ? "border-[#2C2824] shadow-[2px_2px_0px_#2C2824]"
                            : "border-dashed border-[#2C2824]/40 bg-[#FAF5EE] hover:bg-[#FFE4E6]/50"
                        }`}
                        title={`Click to snap Slot ${idx + 1}`}
                      >
                        {src ? (
                          <>
                            <img
                              src={src}
                              alt={`Slot ${idx + 1}`}
                              className="w-full h-full object-cover"
                              style={{ filter: selectedFilter.css }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                resetSlot(idx);
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-md bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </button>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#7A7269] text-xs font-display font-bold">
                            <Camera size={14} className="mb-0.5 opacity-60" />
                            <span>Slot {idx + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 🎨 CUSTOMIZE DRAWER: Frames, Layouts, Filters & Stickers */}
              <div className="neu-box p-5 bg-[#FFFDF9] border-[2.5px] border-[#2C2824] shadow-[6px_6px_0px_#2C2824] rounded-3xl space-y-5">
                {/* 1. Layout Chooser */}
                <div className="space-y-2">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] flex items-center gap-1.5">
                    <span>1. Choose Layout:</span>
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
                        className={`py-2 px-2.5 rounded-xl border-2 text-xs font-display font-bold flex items-center justify-center gap-1.5 transition-all ${
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

                {/* 2. Custom Cute Frames (10 Choices) */}
                <div className="space-y-2">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] flex items-center justify-between">
                    <span>2. Cute Frame Theme (10 Choices):</span>
                    <span className="text-[#7A7269] normal-case font-body font-normal text-xs">
                      Selected: <strong className="text-[#2C2824] font-display">{selectedTheme.name}</strong>
                    </span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {FRAME_THEMES.map((theme) => {
                      const active = selectedTheme.id === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setSelectedTheme(theme)}
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

                {/* 3. Photo Filters */}
                <div className="space-y-2">
                  <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824]">
                    3. Aesthetic Filter:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PHOTO_FILTERS.map((f) => {
                      const active = selectedFilter.id === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedFilter(f)}
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

                {/* 4. Stickers & Caption Text */}
                <div className="space-y-3 pt-2 border-t-2 border-[#2C2824]/10">
                  <div className="space-y-1.5">
                    <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] flex items-center gap-1.5">
                      <Smile size={14} />
                      <span>Click to Add Cute Stickers:</span>
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

                  {/* Caption input */}
                  <div className="space-y-1.5">
                    <label className="font-display font-bold text-xs uppercase tracking-wider text-[#2C2824] flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Type size={14} />
                        <span>Bottom Handwritten Caption:</span>
                      </span>
                      <label className="flex items-center gap-1 text-[11px] font-normal cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showDate}
                          onChange={(e) => setShowDate(e.target.checked)}
                          className="accent-[#2C2824]"
                        />
                        <span>Show Date</span>
                      </label>
                    </label>
                    <input
                      type="text"
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
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
                  <span>🎞️ Live Photostrip Print Preview</span>
                </span>
                <span className="text-xs text-[#7A7269] font-body">Ready for printing</span>
              </div>

              {/* ─── REALTIME RENDERED PHOTOSTRIP PREVIEW ─── */}
              <div
                ref={photostripRef}
                className="relative rounded-3xl border-[3.5px] shadow-[8px_8px_0px_#2C2824] transition-colors p-4 sm:p-5 select-none mx-auto max-w-[340px] sm:max-w-[360px]"
                style={{
                  backgroundColor: selectedTheme.bg,
                  borderColor: selectedTheme.borderColor,
                }}
              >
                {/* 35mm Film Sprockets if film theme */}
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

                {/* Top Badge Header */}
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
                    return (
                      <div
                        key={idx}
                        className="relative aspect-[4/3] rounded-lg border-2 border-[#2C2824] overflow-hidden bg-[#E5E7EB] shadow-sm flex items-center justify-center"
                      >
                        {src ? (
                          <img
                            src={src}
                            alt={`Shot ${idx + 1}`}
                            className="w-full h-full object-cover"
                            style={{ filter: selectedFilter.css }}
                          />
                        ) : (
                          <div className="text-center p-2 text-[#9CA3AF]">
                            <Camera size={20} className="mx-auto mb-1 opacity-50" />
                            <p className="font-hand text-sm">pose {idx + 1} ♡</p>
                          </div>
                        )}

                        {/* Film index marker */}
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
                      title="Click to remove sticker"
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
                  <span>{isExporting ? "Rendering High-Res..." : "Download High-Res PNG 📥"}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={handleSaveToMemories}
                    disabled={isSavingMemory}
                    className="w-full neu-btn bg-[#BAE6FD] hover:bg-[#93C5FD] py-2.5 px-4 font-display font-bold text-xs border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Heart size={14} className="fill-[#2C2824]" />
                    <span>{isSavingMemory ? "Saving to Scrapbook..." : "Save Directly to Memories (/memories) 🌸"}</span>
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
