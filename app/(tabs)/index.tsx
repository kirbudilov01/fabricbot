import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, Users, ChevronRight, CreditCard, X, CircleCheck as CheckCircle, StickyNote, MessageCircle } from 'lucide-react-native';
import { ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAppData } from '@/src/shared/lib/store';
import * as api from '@/src/shared/api/methods';
import { OfferCardSkeleton, PersonCardSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

interface TelegramUser {
  id: number;
  tg_id: string;
  username?: string;
  display_name?: string;
  referral_code: string;
  created_at: string;
}

interface AuthResponse {
  ok: boolean;
  user?: TelegramUser;
  last_joined?: TelegramUser[];
  error?: string;
}

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
  {
    id: '6',
    title: 'SEO Optimization',
    description: 'Complete SEO audit and optimization',
    price: '120',
    author: 'SEO Experts',
    coverUrl: 'https://images.pexels.com/photos/270637/pexels-photo-270637.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '7',
    title: 'Content Writing',
    description: 'Professional content for your website',
    price: '80',
    author: 'Content Writers',
    coverUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '8',
    title: 'Video Production',
    description: 'Professional video editing and production',
    price: '250',
    author: 'Video Pro',
    coverUrl: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '9',
    title: 'Photography Session',
    description: 'Professional photo shoot for your business',
    price: '180',
    author: 'Photo Studio',
    coverUrl: 'https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '10',
    title: 'Consulting Session',
    description: 'Business strategy and growth consulting',
    price: '90',
    author: 'Business Consultant',
    coverUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

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
  {
    id: '4',
    name: 'Kate Photographer',
    username: 'kate_photo',
    bio: 'Professional photographer for events and portraits',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    trustLevel: '7 ♥',
    completedOrders: 203,
    categories: ['Photography', 'Events'],
  },
  {
    id: '5',
    name: 'Dmitry Video',
    username: 'dmitry_video',
    bio: 'Video editor and motion graphics specialist',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    trustLevel: '4 ♥',
    completedOrders: 74,
    categories: ['Video', 'Animation'],
  },
];

export default function MainFeedTab() {
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const { data, addDeal } = useAppData();
  const { pageSettings } = data;
  
  // Telegram Auth State
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [lastJoined, setLastJoined] = useState<TelegramUser[]>([]);
  const [authError, setAuthError] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // Existing state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [payModal, setPayModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentNote, setPaymentNote] = useState('');
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Telegram Auth Function
  const authenticateWithTelegram = async () => {
    try {
      setIsAuthLoading(true);
      setAuthError('');

      // Get initData from Telegram WebApp
      const initData = window.Telegram?.WebApp?.initData || '';
      
      if (!initData) {
        throw new Error('No Telegram initData found');
      }

      // Send POST request to backend
      const response = await fetch('https://fabricbot-backend1.vercel.app/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      });

      const data: AuthResponse = await response.json();

      if (data.ok && data.user) {
        setUser(data.user);
        setLastJoined(data.last_joined || []);
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Initialize Telegram WebApp and authenticate
  useEffect(() => {
    // Initialize Telegram WebApp
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
    }

    // Authenticate with backend
    authenticateWithTelegram();
  }, []);

  const handlePersonPress = (person: any) => {
    // Navigate to person's page with their data
    router.push({
      pathname: '/my-page',
      params: {
        userId: person.id,
        username: person.username,
        name: person.name,
        bio: person.bio,
        avatar: person.avatar,
      },
    });
  };

  const handleOfferPay = (offer: any) => {
    setSelectedOffer(offer);
    setPayModal(true);
  };

  const handleProceedToPay = () => {
    if (agreeTerms && selectedOffer) {
      // Create deal via API
      api.createDeal({
        productId: selectedOffer.id,
        title: selectedOffer.title,
        amountFBC: selectedOffer.price,
        role: 'creator',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      })
        .then((newDeal) => {
          // Update local store
          addDeal(newDeal);
          
          setPayModal(false);
          setPaymentSuccess(true);
          setAgreeTerms(false);
          setPaymentNote('');
        })
        .catch(() => {
          // Toast will be shown by API client error handling
        });
    }
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const renderOfferItem = ({ item }: { item: any }) => (
    <View key={item.id} style={styles.offerCard} data-id={`offer-${item.id}`}>
      <Image source={{ uri: item.coverUrl }} style={styles.offerImage} />
      <View style={styles.offerContent}>
        <Text style={styles.offerTitle}>{item.title}</Text>
        <Text style={styles.offerDescription}>{item.description}</Text>
        <View style={styles.offerFooter}>
          <Text style={styles.offerAuthor}>by {item.author}</Text>
          <Text style={styles.offerPrice}>{item.price} FBC</Text>
        </View>
        <TouchableOpacity 
          style={styles.offerPayButton}
          onPress={() => {}}
        >
          <Text style={styles.offerPayButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.personCard}
      onPress={() => handlePersonPress(item)}
      data-id={`person-${item.id}`}
    >
      <Image source={{ uri: item.avatar }} style={styles.personAvatar} />
      <View style={styles.personInfo}>
        <View style={styles.personHeader}>
          <Text style={styles.personName}>{item.name}</Text>
          <Text style={styles.trustNumber}>{item.trustLevel}</Text>
        </View>
        <Text style={styles.personUsername}>@{item.username}</Text>
        <Text style={styles.personBio} numberOfLines={2}>
          {item.bio}
        </Text>
        <View style={styles.personStats}>
          <Text style={styles.statsText}>{item.completedOrders} orders</Text>
          <View style={styles.categoriesContainer}>
            {item.categories.slice(0, 2).map((category: string, index: number) => (
              <View key={index} style={styles.categoryTag}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
    </TouchableOpacity>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserDisplayName = (user: TelegramUser) => {
    return user.display_name || user.username || user.tg_id;
  };

  // Show loading state
  if (isAuthLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Authenticating with Telegram...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (authError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{authError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={authenticateWithTelegram}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} data-id="tab-home">
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + 24 }
        ]}
        scrollEventThrottle={16}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
      >
        {/* Telegram Auth Info */}
        {user && (
          <View style={styles.authSection}>
            <Text style={styles.authTitle}>Welcome to FabricBot!</Text>
            <View style={styles.userInfo}>
              <Text style={styles.userInfoLabel}>Logged in as:</Text>
              <Text style={styles.userInfoValue}>{getUserDisplayName(user)}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userInfoLabel}>Your referral code:</Text>
              <Text style={styles.referralCode}>{user.referral_code}</Text>
            </View>
            
            {lastJoined.length > 0 && (
              <View style={styles.lastJoinedSection}>
                <Text style={styles.lastJoinedTitle}>Last 7 users joined:</Text>
                {lastJoined.map((joinedUser, index) => (
                  <View key={joinedUser.id} style={styles.joinedUserItem}>
                    <Text style={styles.joinedUserName}>
                      {index + 1}. {getUserDisplayName(joinedUser)}
                    </Text>
                    <Text style={styles.joinedUserDate}>
                      {formatDate(joinedUser.created_at)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>EARN WITH OTHERS</Text>
          <Text style={styles.subtitle}>Get referral links to other people's products and earn together</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar} data-id="home-search">
            <Search size={20} color="#9CA3AF" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services or creators..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Featured Offers */}
        <View style={styles.offersSection} data-id="home-deals">
          <Text style={styles.offersSectionTitle}>Now is featured</Text>
          {isLoadingOffers ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offersScrollContainer}
            >
              <OfferCardSkeleton />
              <OfferCardSkeleton />
              <OfferCardSkeleton />
            </ScrollView>
          ) : featuredOffers.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offersScrollContainer}
            >
              {featuredOffers.map((item) => renderOfferItem({ item }))}
            </ScrollView>
          ) : (
            <View style={styles.emptyOffersContainer}>
              <EmptyState type="deals" />
            </View>
          )}
        </View>

        {/* Recent People */}
        <View style={styles.section} data-id="home-list-new">
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Creators</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {isLoadingPeople ? (
            <View>
              <PersonCardSkeleton />
              <PersonCardSkeleton />
              <PersonCardSkeleton />
            </View>
          ) : recentPeople.length > 0 ? (
            <View>
              {recentPeople.map((item) => renderPersonItem({ item }))}
            </View>
          ) : (
            <EmptyState type="creators" />
          )}
        </View>
      </ScrollView>

      {/* Scroll to Top Button (Web Only) */}
      {Platform.OS === 'web' && showScrollTop && (
        <TouchableOpacity
          style={styles.scrollToTopButton}
          onPress={scrollToTop}
        >
          <ChevronUp size={24} color="#ffffff" strokeWidth={2} />
        </TouchableOpacity>
      )}

      {/* Pay Confirmation Modal */}
      <Modal
        visible={payModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.payModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>You are about to send</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPayModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {selectedOffer && (
              <View style={styles.payContent}>
                <View style={styles.paySummary}>
                  <View style={styles.payRow}>
                    <Text style={styles.payLabel}>Amount:</Text>
                    <Text style={styles.payValue}>{selectedOffer.price} FBC</Text>
                  </View>
                  <View style={styles.payRow}>
                    <Text style={styles.payLabel}>Product:</Text>
                    <Text style={styles.payValue}>{selectedOffer.title}</Text>
                  </View>
                  <View style={styles.payRow}>
                    <Text style={styles.payLabel}>Recipient:</Text>
                    <Text style={styles.payValue}>{selectedOffer.author}</Text>
                  </View>
                </View>

                <View style={styles.noteSection}>
                  <View style={styles.noteHeader}>
                    <StickyNote size={16} color="#6b7280" strokeWidth={2} />
                    <Text style={styles.noteLabel}>Note (optional)</Text>
                  </View>
                  <TextInput
                    style={styles.noteInput}
                    value={paymentNote}
                    onChangeText={setPaymentNote}
                    placeholder="Add a note for this payment..."
                    multiline
                    numberOfLines={2}
                  />
                </View>

                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => setAgreeTerms(!agreeTerms)}
                >
                  <View style={[styles.checkbox, agreeTerms && styles.checkedBox]}>
                    {agreeTerms && <CheckCircle size={16} color="#ffffff" strokeWidth={2} />}
                  </View>
                  <Text style={styles.termsText}>I agree with the terms</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.proceedButton, !agreeTerms && styles.disabledButton]}
                  onPress={handleProceedToPay}
                  disabled={!agreeTerms}
                  data-id="btn-proceed-pay"
                >
                  <Text style={[styles.proceedButtonText, !agreeTerms && styles.disabledButtonText]}>
                    Proceed to pay
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Payment Success Modal */}
      <Modal
        visible={paymentSuccess}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <CheckCircle size={64} color="#10B981" strokeWidth={2} />
            <Text style={styles.successTitle}>Payment created</Text>
            <Text style={styles.successSubtitle}>awaiting confirmation</Text>
            
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setPaymentSuccess(false);
                setSelectedOffer(null);
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  authSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfoLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
  referralCode: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '700',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lastJoinedSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  lastJoinedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  joinedUserItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  joinedUserName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  joinedUserDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  seeAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  offersSection: {
    marginBottom: 32,
  },
  offersSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  offersScrollContainer: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  emptyOffersContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  offerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    width: 280,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  offerImage: {
    width: '100%',
    height: 120,
  },
  offerContent: {
    padding: 16,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  offerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerAuthor: {
    fontSize: 12,
    color: '#9ca3af',
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
  },
  offerPayButton: {
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    minHeight: 36,
  },
  offerPayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  personCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  personAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  personInfo: {
    flex: 1,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  personName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
  },
  trustContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  personUsername: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 6,
  },
  personBio: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  personStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  categoryTag: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3B82F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  payContent: {
    padding: 24,
  },
  paySummary: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  payLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  payValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  noteSection: {
    marginBottom: 24,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  noteInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    textAlignVertical: 'top',
    minHeight: 60,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  termsText: {
    fontSize: 16,
    color: '#1f2937',
  },
  proceedButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    minHeight: 56,
  },
  proceedButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
  },
  disabledButtonText: {
    color: '#9ca3af',
  },
  successModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 40,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  doneButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 18,
    minHeight: 56,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
});