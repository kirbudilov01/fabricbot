'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Copy,
  CreditCard,
  X,
  CheckCircle,
  Users,
  ChevronRight,
  StickyNote,
  MessageCircle
} from 'lucide-react';

export default function MyPage() {
  const router = useRouter();
  const [value, setValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">My Page</h1>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Type something..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      {/* Example buttons */}
      <div className="flex gap-2 flex-wrap">
        <button className="p-2 border rounded flex items-center gap-1">
          <Copy size={16} /> Copy
        </button>
        <button className="p-2 border rounded flex items-center gap-1">
          <CreditCard size={16} /> Pay
        </button>
        <button className="p-2 border rounded flex items-center gap-1">
          <CheckCircle size={16} /> Confirm
        </button>
        <button className="p-2 border rounded flex items-center gap-1">
          <Users size={16} /> Users
        </button>
        <button className="p-2 border rounded flex items-center gap-1">
          <StickyNote size={16} /> Note
        </button>
        <button className="p-2 border rounded flex items-center gap-1">
          <MessageCircle size={16} /> Chat
        </button>
      </div>

      {/* Arrows */}
      <div className="flex gap-2 mt-4">
        <ChevronDown />
        <ChevronUp />
        <ChevronRight />
        <X />
      </div>
    </div>
  );
}
