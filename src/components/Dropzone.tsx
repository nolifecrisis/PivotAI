// src/components/Dropzone.tsx
import React, { useCallback, useState } from "react";

type Props = {
  onText: (text: string) => void;
  label?: string;
  sublabel?: string;
  className?: string;
};

export default function Dropzone({ onText, label, sublabel, className = "" }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);

  const reset = () => {
    setBusy(false);
    setProgress(0);
  };

  const doUpload = async (file: File) => {
    setBusy(true);
    setProgress(10);
    try {
      const form = new FormData();
      form.append("file", file);
      setProgress(25);

      const res = await fetch("/api/extract", { method: "POST", body: form }).catch(() => null);
      setProgress(60);

      if (!res || !res.ok) {
        reset();
        alert("Upload failed. Please try another file or paste text.");
        return;
      }
      const data = await res.json();
      setProgress(100);
      onText(data.text || "");
    } finally {
      setTimeout(() => reset(), 500);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) await doUpload(f);
  }, []);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) await doUpload(f);
  };

  return (
    <div className={className}>
      {label ? <h3 className="text-xl font-bold text-gray-900">{label}</h3> : null}
      {sublabel ? <p className="text-gray-600 mt-1">{sublabel}</p> : null}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={
          "mt-3 rounded-xl border-2 border-dashed p-6 text-center cursor-pointer " +
          (dragOver ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white")
        }
        onClick={() => (document.getElementById("dz-input") as HTMLInputElement)?.click()}
      >
        <input
          id="dz-input"
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          className="hidden"
          onChange={handleSelect}
        />
        <p className="text-gray-800">
          Drag & drop your resume here, or <span className="text-indigo-700 underline">browse</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">PDF, DOCX, DOC, or TXT up to 25MB</p>

        {/* Progress */}
        {busy ? (
          <div className="mt-4 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-2 bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
