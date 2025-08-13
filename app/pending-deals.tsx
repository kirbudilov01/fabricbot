'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, User, Users, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function PendingDeals() {
  const router = useRouter();
  const [deals] = useState([
    { id: 1, name: 'Deal 1', status: 'pending', users: 3 },
    { id: 2, name: 'Deal 2', status: 'approved', users: 5 },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">Pending Deals</h1>
      </div>

      {/* Deals List */}
      <div className="space-y-2">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{deal.name}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                {deal.status === 'pending' && <Clock size={14} />}
                {deal.status === 'approved' && <CheckCircle size={14} />}
                {deal.status}
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Users size={16} /> {deal.users}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
