"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { NavBar } from "@/components/layout/NavBar";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import type { Memory } from "@/lib/supabase/types";
import { Plus, X, Upload, Camera, Calendar, Sparkles } from "lucide-react";

export default function MemoriesPage() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const supabase = createClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [memories, setMemories] = useState<Memory[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", memory_date: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<Memory | null>(null);

  const fetchMemories = async () => {
    const { data } = await supabase
      .from("memories")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMemories(data);
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addMemory = async () => {
    if (!user || !form.title.trim()) return;
    setAdding(true);
    let image_url: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `memories/${user.id}/${Date.now()}.${ext}`;
      const { data: uploadData } = await supabase.storage
        .from("memories")
        .upload(path, imageFile, { upsert: false });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("memories").getPublicUrl(path);
        image_url = urlData.publicUrl;
      }
    }

    await supabase.from("memories").insert({
      title: form.title.trim(),
      description: form.description.trim() || null,
      memory_date: form.memory_date || null,
      creator: user.id,
      image_url,
    });

    showToast("Memory saved to our scrapbook! 📸", { emoji: "📸", type: "love" });
    setForm({ title: "", description: "", memory_date: "" });
    setImageFile(null);
    setImagePreview(null);
    setShowAdd(false);
    setAdding(false);
    fetchMemories();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#FFCCD5] selection:text-[#2C2824]">
      <div>
        <NavBar />

        <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[#2C2824]/15">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BAE6FD] border-2 border-[#2C2824] shadow-[2px_2px_0px_#2C2824] text-xs font-display font-bold uppercase tracking-wider mb-2">
                <Camera size={12} />
                <span>Photo Scrapbook</span>
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2C2824]">
                memory archive 📸
              </h1>
              <p className="font-hand text-xl text-[#7A7269] mt-0.5">
                {memories.length} captured moment{memories.length !== 1 ? "s" : ""}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAdd(!showAdd)}
                className="neu-btn neu-btn-pink text-xs py-2 px-4 shadow-[3px_3px_0px_#2C2824]"
              >
                <Plus size={13} />
                <span>add memory</span>
              </button>
            )}
          </div>

          {/* Add Memory Modal/Box */}
          <AnimatePresence>
            {showAdd && isAdmin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="neu-box p-6 bg-[#BAE6FD] border-[2.5px] border-[#2C2824] space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display font-bold text-base text-[#2C2824] flex items-center gap-2">
                      <span>📸</span>
                      <span>preserve a new memory</span>
                    </h2>
                    <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-[#FAF5EE]">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="memory title (e.g. First date in the rain) *"
                      className="sm:col-span-2 border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                    />
                    <input
                      type="date"
                      value={form.memory_date}
                      onChange={(e) => setForm({ ...form, memory_date: e.target.value })}
                      className="border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none"
                    />
                    <div />
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="what happened? write the story..."
                      rows={3}
                      className="sm:col-span-2 border-2 border-[#2C2824] rounded-xl px-3 py-2 text-sm font-body bg-[#FFFDF9] focus:outline-none resize-none"
                    />

                    {/* Image Upload Area */}
                    <div className="sm:col-span-2">
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {imagePreview ? (
                        <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-[#2C2824]">
                          <Image src={imagePreview} alt="preview" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="absolute top-2 right-2 p-1 rounded-full bg-[#2C2824] text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          className="w-full border-2 border-dashed border-[#2C2824]/30 rounded-2xl py-6 flex flex-col items-center justify-center gap-1.5 hover:border-[#2C2824] bg-[#FFFDF9]/60 transition-colors"
                        >
                          <Upload size={20} className="text-[#7A7269]" />
                          <span className="font-hand text-base text-[#2C2824]">
                            click to choose a photo from your device
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={addMemory}
                      disabled={!form.title.trim() || adding}
                      className="neu-btn neu-btn-pink text-xs py-2 px-5 disabled:opacity-50"
                    >
                      <Camera size={13} />
                      <span>{adding ? "saving..." : "save memory 📸"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Polaroid Grid */}
          {memories.length === 0 ? (
            <div className="neu-box p-12 bg-[#FFFDF9] border-2 border-dashed border-[#2C2824]/20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-3xl bg-[#BAE6FD] border-2 border-[#2C2824] flex items-center justify-center text-3xl shadow-[3px_3px_0px_#2C2824]">
                📷
              </div>
              <p className="font-hand text-2xl text-[#2C2824]">our scrapbook is blank</p>
              <p className="font-body text-xs text-[#7A7269]">
                upload the first photo to start filling the archive 🌸
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {memories.map((m, i) => (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.03, rotate: 0 }}
                  className={`polaroid-card cursor-pointer ${
                    i % 4 === 0
                      ? "-rotate-1"
                      : i % 4 === 1
                      ? "rotate-2"
                      : i % 4 === 2
                      ? "-rotate-2"
                      : "rotate-1"
                  }`}
                  onClick={() => setSelected(m)}
                >
                  <div className="w-full h-36 sm:h-44 bg-[#FAF5EE] rounded border border-[#2C2824]/20 overflow-hidden relative flex items-center justify-center">
                    {m.image_url ? (
                      <Image src={m.image_url} alt={m.title} fill className="object-cover" />
                    ) : (
                      <span className="text-3xl opacity-30">📷</span>
                    )}
                  </div>
                  <h3 className="font-hand text-base text-center text-[#2C2824] mt-2 truncate">
                    {m.title}
                  </h3>
                  {m.memory_date && (
                    <p className="font-display font-bold text-[10px] text-center text-[#7A7269]">
                      {new Date(m.memory_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2C2824]/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="polaroid-card max-w-md w-full bg-[#FFFFFF] p-5 shadow-[8px_8px_0px_#2C2824]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-64 sm:h-80 bg-[#FAF5EE] rounded border border-[#2C2824]/20 overflow-hidden relative flex items-center justify-center">
                {selected.image_url ? (
                  <Image src={selected.image_url} alt={selected.title} fill className="object-cover" />
                ) : (
                  <span className="text-5xl opacity-30">📷</span>
                )}
              </div>

              <div className="mt-3 text-center space-y-1">
                <h2 className="font-hand text-2xl text-[#2C2824]">{selected.title}</h2>
                {selected.description && (
                  <p className="font-body text-xs text-[#7A7269] leading-relaxed">
                    {selected.description}
                  </p>
                )}
                {selected.memory_date && (
                  <p className="font-display font-bold text-[11px] text-[#2C2824]/60">
                    {new Date(selected.memory_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="neu-btn neu-btn-pink w-full mt-4 text-xs py-2"
              >
                close snapshot
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
