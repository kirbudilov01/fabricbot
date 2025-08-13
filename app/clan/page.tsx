'use client'

import Image from 'next/image'

export default function ClanPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-gray-900">FabricBot</h1>
              <div className="hidden md:flex space-x-6">
                <a href="/" className="text-gray-600 hover:text-gray-900">Discover</a>
                <a href="/clan" className="text-primary-600 font-medium">Clan</a>
                <a href="/balance" className="text-gray-600 hover:text-gray-900">Balance</a>
                <a href="/links" className="text-gray-600 hover:text-gray-900">Setup</a>
                <a href="/account" className="text-gray-600 hover:text-gray-900">Profile</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">FABRICBOT ECOSYSTEM</h1>
        </div>

        {/* Main Image */}
        <div className="mb-12">
          <Image
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Ecosystem"
            width={600}
            height={300}
            className="w-full h-64 object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Content */}
        <div className="card p-8 text-center">
          <p className="text-xl font-semibold text-gray-900 mb-6">
            Soon we will tell you how to use this, but for now it's on pause.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed">
            We are working on creating a unique ecosystem for creators and entrepreneurs. 
            Stay tuned for updates!
          </p>
          
          <div className="bg-warning-50 text-warning-600 px-6 py-3 rounded-2xl font-semibold inline-block">
            On Pause
          </div>
        </div>
      </main>
    </div>
  )
}