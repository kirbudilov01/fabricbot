'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Search, Users, ChevronRight, CreditCard, X, CheckCircle, StickyNote, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppData } from '@/lib/store'
import * as api from '@/src/shared/api/methods'
import { OfferCardSkeleton, PersonCardSkeleton } from '@/components/SkeletonLoader'
import EmptyState from '@/components/EmptyState'

// Mock data for featured offers
const featuredOffers = [
  {
    id: '1',
    title: 'Logo Design Special',
    description: 'Professional logo design with 3 concepts',
    price: '50',
    author: 'Creative Studio',
    coverUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Website Development',
    description: 'Full-stack website with modern design',
    price: '200',
    author: 'Dev Team Pro',
    coverUrl: 'https://images.pexels.com/photos/326502/pexels-photo-326502.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'SMM Campaign',
    description: 'Social media marketing for your business',
    price: '100',
    author: 'Marketing Experts',
    coverUrl: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    title: 'Brand Identity Package',
    description: 'Complete brand identity with logo, colors, fonts',
    price: '150',
    author: 'Brand Studio',
    coverUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    title: 'Mobile App Design',
    description: 'UI/UX design for mobile applications',
    price: '300',
    author: 'App Designers',
    coverUrl: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
]

// Mock data for recent people
const recentPeople = [
  {
    id: '1',
    name: 'KIRILL BUDILOV',
    username: 'kirbudilov',
    bio: 'Founder Trendvi and creator of AI solutions for bloggers',
    avatar: 'https://yt3.ggpht.com/k3Pn64o9Ge84P_xduTdgOwbtQR8JnOj2lbpL00BpURbRX38Wq4YU0dDbNnkVL6iiUciH2eg06w=s88-c-k-c0x00ffffff-no-rj',
    rating: 4.9,
    completedOrders: 127,
    trustLevel: '29 ♥',
    categories: ['Development', 'Design'],
  },
  {
    id: '2',
    name: 'Maria Developer',
    username: 'maria_dev',
    bio: 'Full-stack developer specializing in React and Node.js',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    trustLevel: '4 ♥',
    completedOrders: 89,
    categories: ['Development', 'Web'],
  },
  {
    id: '3',
    name: 'Ivan Writer',
    username: 'ivan_writer',
    bio: 'Content writer and copywriter for digital marketing',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    trustLevel: '6 ♥',
    completedOrders: 156,
    categories: ['Writing', 'Marketing'],
  },
]

export default function MainFeedTab() {
  const router = useRouter()
  const { data, addDeal } = useAppData()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [payModal, setPayModal] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [paymentNote, setPaymentNote] = useState('')
  const [isLoadingOffers, setIsLoadingOffers] = useState(false)
  const [isLoadingPeople, setIsLoadingPeople] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const handlePersonPress = (person: any) => {
    router.push(`/my-page?userId=${person.id}&username=${person.username}`)
  }

  const handleOfferPay = (offer: any) => {
    setSelectedOffer(offer)
    setPayModal(true)
  }

  const handleProceedToPay = () => {
    if (agreeTerms && selectedOffer) {
      api.createDeal({
        productId: selectedOffer.id,
        title: selectedOffer.title,
        amountFBC: selectedOffer.price,
        role: 'creator',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      })
        .then((newDeal) => {
          addDeal(newDeal)
          setPayModal(false)
          setPaymentSuccess(true)
          setAgreeTerms(false)
          setPaymentNote('')
        })
        .catch(() => {
          // Toast will be shown by API client error handling
        })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50" data-id="tab-home">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">EARN WITH OTHERS</h1>
          <p className="text-gray-600">Get referral links to other people's products and earn together</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto" data-id="home-search">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services or creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Featured Offers */}
        <section className="mb-12" data-id="home-deals">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">Now is featured</h2>
          {isLoadingOffers ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              <OfferCardSkeleton />
              <OfferCardSkeleton />
              <OfferCardSkeleton />
            </div>
          ) : featuredOffers.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto pb-4">
              {featuredOffers.map((offer) => (
                <div key={offer.id} className="flex-shrink-0 w-80 card p-0 overflow-hidden" data-id={`offer-${offer.id}`}>
                  <Image
                    src={offer.coverUrl}
                    alt={offer.title}
                    width={320}
                    height={120}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{offer.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500">by {offer.author}</span>
                      <span className="font-bold text-success-500">{offer.price} FBC</span>
                    </div>
                    <button
                      onClick={() => handleOfferPay(offer)}
                      className="w-full btn-primary py-2 text-sm"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8">
              <EmptyState type="deals" />
            </div>
          )}
        </section>

        {/* Recent People */}
        <section data-id="home-list-new">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Creators</h2>
            <button className="text-primary-500 font-medium hover:text-primary-600">
              See all
            </button>
          </div>
          {isLoadingPeople ? (
            <div className="space-y-4">
              <PersonCardSkeleton />
              <PersonCardSkeleton />
            </div>
          ) : recentPeople.length > 0 ? (
            <div className="space-y-4">
              {recentPeople.map((person) => (
                <div
                  key={person.id}
                  onClick={() => handlePersonPress(person)}
                  className="card p-6 flex items-center cursor-pointer hover:shadow-md transition-shadow"
                  data-id={`person-${person.id}`}
                >
                  <Image
                    src={person.avatar}
                    alt={person.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{person.name}</h3>
                      <span className="bg-primary-50 text-primary-600 px-2 py-1 rounded-lg text-sm font-medium">
                        {person.trustLevel}
                      </span>
                    </div>
                    <p className="text-primary-500 text-sm mb-2">@{person.username}</p>
                    <p className="text-gray-600 text-sm mb-3">{person.bio}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{person.completedOrders} orders</span>
                      <div className="flex gap-2">
                        {person.categories.slice(0, 2).map((category, index) => (
                          <span
                            key={index}
                            className="bg-primary-50 text-primary-600 px-2 py-1 rounded text-xs"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8">
              <EmptyState type="creators" />
            </div>
          )}
        </section>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Pay Confirmation Modal */}
      {payModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-6 pb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">You are about to send</h3>
              <button
                onClick={() => setPayModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {selectedOffer && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">{selectedOffer.price} FBC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-semibold">{selectedOffer.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient:</span>
                    <span className="font-semibold">{selectedOffer.author}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <StickyNote className="w-4 h-4 text-gray-500 mr-2" />
                    <label className="text-sm font-medium text-gray-700">Note (optional)</label>
                  </div>
                  <textarea
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Add a note for this payment..."
                    rows={2}
                    className="input resize-none"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="agree-terms" className="ml-3 text-gray-700">
                    I agree with the terms
                  </label>
                </div>

                <button
                  onClick={handleProceedToPay}
                  disabled={!agreeTerms}
                  className={`w-full py-4 rounded-xl font-semibold transition-colors ${
                    agreeTerms
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  data-id="btn-proceed-pay"
                >
                  Proceed to pay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment created</h3>
            <p className="text-gray-600 mb-8">awaiting confirmation</p>
            <button
              onClick={() => {
                setPaymentSuccess(false)
                setSelectedOffer(null)
              }}
              className="btn-primary"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}