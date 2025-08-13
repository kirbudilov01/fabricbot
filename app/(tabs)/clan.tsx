'use client'

import Image from 'next/image'

export default function ClanTab() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20" data-id="tab-clan">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">FABRICBOT ECOSYSTEM</h1>
        </div>

        {/* Main Image */}
        <div className="mb-8">
          <Image
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Ecosystem"
            width={600}
            height={200}
            className="w-full h-48 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="card p-8 text-center">
          <p className="text-xl font-semibold text-gray-900 mb-4" data-id="ecosystem-text">
            Soon we will tell you how to use this, but for now it's on pause.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We are working on creating a unique ecosystem for creators and entrepreneurs. 
            Stay tuned for updates!
          </p>
          
          <div className="bg-warning-50 text-warning-600 px-6 py-3 rounded-2xl font-semibold inline-block">
            On Pause
          </div>
        </div>
      </div>
    </div>
  )
}