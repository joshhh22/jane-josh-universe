"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Letter } from "@/lib/supabase/types";
import {
  Send,
  Mail,
  X,
  ChevronDown,
  Mic,
  Square,
  Play,
  Pause,
  Trash2,
  Volume2,
} from "lucide-react";

const MOODS = ["💗", "🥰", "🌸", "✨", "😊", "😔", "🎉", "💭"];

// ─── VOICE NOTE PLAYER COMPONENT ─────────────────────────────
function VoiceNotePlayer({ audioUrl }: { audioUrl: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.onended = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="mt-3 p-3 bg-[#FFFDF9] border-2 border-[#2C2824] rounded-xl shadow-[3px_3px_0px_#2C2824] flex items-center gap-3"
    >
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-xl bg-[#FFCCD5] border-2 border-[#2C2824] flex items-center justify-center text-[#2C2824] shadow-[2px_2px_0px_#2C2824] hover:-translate-y-0.5 transition-all flex-shrink-0"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>

      {/* Progress & Waveform */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[10px] font-display font-bold text-[#7A7269] mb-1">
          <span className="flex items-center gap-1">
            <Volume2 size={12} />
            <span>Voice Note 🎙️</span>
          </span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="w-full bg-[#FAF5EE] border border-[#2C2824]/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#FF8FAB] h-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Animated Sound Bars */}
      <div className="flex items-end gap-0.5 h-6 flex-shrink-0">
        {[40, 70, 30, 90, 50].map((h, i) => (
          <div
            key={i}
            className={`w-1 bg-[#2C2824] rounded-full transition-all duration-200 ${
              isPlaying ? "animate-pulse" : "opacity-40"
            }`}
            style={{ height: isPlaying ? `${h}%` : "30%" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── LETTER CARD ─────────────────────────────────────────────
function LetterCard({
  letter,
  profiles,
  currentUserId,
  onRead,
}: {
  letter: Letter;
  profiles: Record<string, { display_name: string; avatar_emoji: string; username: string }>;
  currentUserId?: string;
  onRead: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const sender = profiles[letter.sender];
  const isForMe = letter.recipient === currentUserId;
  const isUnread = !letter.is_read && isForMe;

  // Extract voice note if embedded
  const voiceNoteMatch = letter.body.match(/\[\[VOICE:(data:audio\/[^\]]+)\]\]/);
  const voiceNoteUrl = voiceNoteMatch ? voiceNoteMatch[1] : null;
  const cleanBody = letter.body.replace(/\[\[VOICE:[^\]]+\]\]/g, "").trim();

  const handleToggle = () => {
    setOpen(!open);
    if (isUnread && !open) onRead(letter.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`neu-box p-5 bg-[#FFFDF9] border-2 border-[#2C2824] shadow-[3px_3px_0px_#2C2824] cursor-pointer transition-all ${
        isUnread ? "bg-[#FFCCD5]/40 border-[#FFAAA6]" : ""
      }`}
      onClick={handleToggle}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[#FFCCD5] border-2 border-[#2C2824] flex items-center justify-center text-xl shadow-[2px_2px_0px_#2C2824] flex-shrink-0">
            {voiceNoteUrl ? "🎙️" : isUnread ? "💌" : "📨"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display font-black text-sm text-[#2C2824] truncate">
                {sender?.avatar_emoji || "👤"} {sender?.display_name || "Someone"}
              </p>
              {letter.mood && <span className="text-sm">{letter.mood}</span>}
              {voiceNoteUrl && (
                <span className="sticker bg-[#DDD6FE] text-[9px] py-0.5 px-2">
                  🎙️ VOICE
                </span>
              )}
              {isUnread && (
                <span className="sticker bg-[#FEF08A] text-[9px] py-0.5 px-2">
                  NEW
                </span>
              )}
            </div>
            {letter.title && (
              <p className="font-display font-bold text-xs text-[#7A7269] truncate mt-0.5">
                &ldquo;{letter.title}&rdquo;
              </p>
            )}
            <p className="font-body text-[11px] text-[#7A7269]/80 mt-0.5">
              {new Date(letter.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="p-1 rounded-lg border border-[#2C2824]/20 bg-[#FAF5EE]">
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t-2 border-[#2C2824]/15 bg-[#FAF5EE] p-4 rounded-xl border border-[#2C2824]/10 space-y-3">
              {cleanBody && (
                <p className="font-body text-sm text-[#2C2824] leading-relaxed whitespace-pre-wrap">
                  {cleanBody}
                </p>
              )}

              {/* Voice Note Audio Player */}
              {voiceNoteUrl && <VoiceNotePlayer audioUrl={voiceNoteUrl} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── MAIN LETTERS PAGE ─────────────────────────────────────────
export default function LettersPage() {
  const { user, profile, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [profiles, setProfiles] = useState<
    Record<string, { display_name: string; avatar_emoji: string; username: string }>
  >({});
  const [recipient, setRecipient] = useState<{ id: string; display_name: string; avatar_emoji: string } | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedMood, setSelectedMood] = useState("💗");
  const [sending, setSending] = useState(false);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioDataUrl, setRecordedAudioDataUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLetters = async () => {
    const { data: ps } = await supabase.from("profiles").select("id, username, display_name, avatar_emoji");
    if (ps) {
      const map: typeof profiles = {};
      ps.forEach((p) => {
        map[p.id] = p;
      });
      setProfiles(map);
      const other = ps.find((p) => p.id !== user?.id);
      if (other) setRecipient(other);
    }

    const { data: ls } = await supabase.from("letters").select("*").order("created_at", { ascending: false });
    if (ls) setLetters(ls as Letter[]);
  };

  useEffect(() => {
    fetchLetters();
  }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("letters").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id);
    setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, is_read: true } : l)));
  };

  // 🎙️ Voice Recording Controls
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setRecordedAudioDataUrl(reader.result as string);
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      showToast("Please allow microphone access to record voice notes!", { emoji: "🎙️", type: "error" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setRecordedAudioDataUrl(null);
    setRecordingTime(0);
  };

  // 💌 Send Letter
  const sendLetter = async () => {
    if (!user || !recipient) return;
    if (!body.trim() && !recordedAudioDataUrl) {
      showToast("Write some text or record a voice note first!", { emoji: "✍️", type: "error" });
      return;
    }

    setSending(true);

    let finalBody = body.trim();
    if (recordedAudioDataUrl) {
      finalBody = `${finalBody}\n\n[[VOICE:${recordedAudioDataUrl}]]`.trim();
    }

    await supabase.from("letters").insert({
      sender: user.id,
      recipient: recipient.id,
      title: title.trim() || (recordedAudioDataUrl ? "Voice Note 🎙️" : null),
      body: finalBody,
      mood: selectedMood,
    });

    showToast(`Letter sent to ${recipient.display_name}! 💌`, { emoji: "💌", type: "love" });
    setTitle("");
    setBody("");
    setRecordedAudioDataUrl(null);
    setShowCompose(false);
    setSending(false);
    fetchLetters();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFCCD5] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Mail size={12} />
                <span>Our Private Post</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                our mailbox 💌
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                {letters.length} letter{letters.length !== 1 ? "s" : ""} exchanged so far
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowCompose(!showCompose)}
                className="neu-btn neu-btn-pink text-xs py-2 px-4 shadow-[3px_3px_0px_#2C2824]"
              >
                <Send size={13} />
                <span>write a new letter</span>
              </button>
            )}
          </div>

          {/* Compose Form Modal */}
          <AnimatePresence>
            {showCompose && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="neu-box p-6 bg-[#FEF08A] border-[2.5px] border-[#2C2824] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-base text-[#2C2824] flex items-center gap-2">
                      <span>✍️</span>
                      <span>
                        letter to {recipient?.avatar_emoji || "🌸"} {recipient?.display_name || "Jane"}
                      </span>
                    </h2>
                    <button
                      onClick={() => setShowCompose(false)}
                      className="p-1 rounded-lg hover:bg-[#FAF5EE]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="letter subject (optional)..."
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                  />

                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="write your thoughts, feelings, or cute stories here..."
                    rows={4}
                    className="w-full border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none resize-none"
                  />

                  {/* 🎙️ Voice Note Recorder Box */}
                  <div className="p-3 bg-[#FFFDF9] border-2 border-[#2C2824] rounded-xl shadow-[2px_2px_0px_#2C2824] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs text-[#2C2824] flex items-center gap-1.5">
                        <Mic size={14} className={isRecording ? "text-rose-500 animate-pulse" : ""} />
                        <span>Voice Note Attachment (Optional)</span>
                      </span>
                      {isRecording && (
                        <span className="font-mono text-xs font-bold text-rose-600 animate-pulse">
                          0:{recordingTime < 10 ? `0${recordingTime}` : recordingTime} / 1:00
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isRecording && !recordedAudioDataUrl && (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="neu-btn neu-btn-white text-xs py-1.5 px-3 flex items-center gap-1.5"
                        >
                          <Mic size={13} className="text-rose-500" />
                          <span>Record Voice Note</span>
                        </button>
                      )}

                      {isRecording && (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="neu-btn neu-btn-pink text-xs py-1.5 px-3 flex items-center gap-1.5 bg-rose-200"
                        >
                          <Square size={13} className="fill-rose-600 text-rose-600" />
                          <span>Stop Recording</span>
                        </button>
                      )}

                      {recordedAudioDataUrl && (
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-xs font-hand text-emerald-700 font-bold">
                            ✓ Voice note recorded ({recordingTime}s)
                          </span>
                          <button
                            type="button"
                            onClick={deleteRecording}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg ml-auto"
                            title="Delete voice note"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xs text-[#2C2824]">mood tag:</span>
                      <div className="flex gap-1.5">
                        {MOODS.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSelectedMood(m)}
                            className={`text-lg p-1 rounded-lg border-2 transition-transform ${
                              selectedMood === m
                                ? "bg-[#FFCCD5] border-[#2C2824] scale-110"
                                : "border-transparent hover:scale-110"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={sendLetter}
                      disabled={sending || isRecording}
                      className="neu-btn neu-btn-pink text-xs py-2 px-5 shadow-[3px_3px_0px_#2C2824] disabled:opacity-50"
                    >
                      <Send size={13} />
                      <span>{sending ? "sealing letter..." : "send letter 💌"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Letter List */}
          <div className="space-y-4">
            {letters.length === 0 ? (
              <div className="neu-box p-12 text-center bg-[#FFFDF9] border-2 border-dashed border-[#2C2824]/30 space-y-3">
                <div className="text-5xl animate-bounce">📬</div>
                <h3 className="font-display font-bold text-lg text-[#2C2824]">
                  the mailbox is empty
                </h3>
                <p className="font-hand text-lg text-[#7A7269]">
                  be the first to leave a cute love note or voice memo...
                </p>
              </div>
            ) : (
              letters.map((l) => (
                <LetterCard
                  key={l.id}
                  letter={l}
                  profiles={profiles}
                  currentUserId={user?.id}
                  onRead={markRead}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
