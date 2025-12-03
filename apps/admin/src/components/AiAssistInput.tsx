import React, { useState } from "react";

interface AiAssistInputProps {
  onAssist: (text: string) => Promise<string>;
  placeholder?: string;
  label?: string;
}

export default function AiAssistInput({
  onAssist,
  placeholder = "请输入描述词...",
  label = "AI 辅助录入",
}: AiAssistInputProps) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssist = async () => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const result = await onAssist(value);
      setValue(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {label && (
        <label className="block mb-2 text-lg font-medium">{label}</label>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button
          onClick={handleAssist}
          disabled={loading}
          className="px-4 py-2 rounded-xl shadow bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "生成中..." : "AI 辅助录入"}
        </button>
      </div>
    </div>
  );
}
