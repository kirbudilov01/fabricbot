"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { 
  ArrowLeft, Plus, CreditCard as Edit, Trash2, X, 
  ChevronDown, ChevronRight, Save, Eye, EyeOff 
} from "lucide-react";
import { useState } from "react";

export default function ConfigurePage() {
  const router = useRouter();
  const [platform] = useState(() => {
    if (typeof navigator !== "undefined") {
      return /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "ios" : "web";
    }
    return "server";
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Configure Page</h1>
      </div>

      {/* Example image */}
      <div className="mb-4">
        <Image
          src="/placeholder.png"
          alt="Example"
          width={300}
          height={200}
          className="rounded-lg border"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded">
          <Plus className="w-4 h-4" /> Add
        </button>
        <button className="flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded">
          <Save className="w-4 h-4" /> Save
        </button>
      </div>

      {/* Debug platform */}
      <div className="mt-4 text-sm text-gray-500">
        Platform: {platform}
      </div>
    </div>
  );
}
