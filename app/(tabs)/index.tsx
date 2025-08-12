import React, { useState } from 'react';
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
import { Search, Star, Users, ChevronRight, CreditCard, X, CircleCheck as CheckCircle, StickyNote } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/src/shared/lib/store';
import * as api from '@/src/shared/api/methods';
import { OfferCardSkeleton, PersonCardSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';

// Mock data for featured offers
const featuredOffers = [
  {
    id: '1',
    title: 'Logo Design Special',
    description: 'Professional logo design with 3 concepts',
    price: '50',
    discount: '20%',
    author: 'Creative Studio',
    coverUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    title: 'Website Development',
    description: 'Full-stack website with modern design',
    price: '200',
    discount: '15%',
    author: 'Dev Team Pro',
    coverUrl: 'https://images.pexels.com/photos/326502/pexels-photo-326502.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    title: 'SMM Campaign',
    description: 'Social media marketing for your business',
    price: '100',
    discount: '10%',
    author: 'Marketing Experts',
    coverUrl: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

// Mock data for recent people
const recentPeople = [
  {
    id: '1',
    name: 'KIRILL BUDILOV',
    username: 'kirill_budilov',
    bio: 'Full-stack developer and creative professional',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.9,
    completedOrders: 127,
    categories: ['Development', 'Design'],
  },
  {
    id: '2',
    name: 'Maria Developer',
    username: 'maria_dev',
    bio: 'Full-stack developer specializing in React and Node.js',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.8,
    completedOrders: 89,
    categories: ['Development', 'Web'],
  },
  {
    id: '3',
    name: 'Ivan Writer',
    username: 'ivan_writer',
    bio: 'Content writer and copywriter for digital marketing',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.7,
    completedOrders: 156,
    categories: ['Writing', 'Marketing'],
  },
  {
    id: '4',
    name: 'Kate Photographer',
    username: 'kate_photo',
    bio: 'Professional photographer for events and portraits',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.9,
    completedOrders: 203,
    categories: ['Photography', 'Events'],
  },
  {
    id: '5',
    name: 'Dmitry Video',
    username: 'dmitry_video',
    bio: 'Video editor and motion graphics specialist',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4.6,
    completedOrders: 74,
    categories: ['Video', 'Animation'],
  },
];

export default function MainFeedTab() {
  const router = useRouter();
  const { data, addDeal } = useAppData();
  const { pageSettings } = data;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [payModal, setPayModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentNote, setPaymentNote] = useState('');
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [isLoadingPeople, setIsLoadingPeople] = useState(false);

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

  const renderOfferItem = ({ item }: { item: any }) => (
    <View style={styles.offerCard} data-id={`offer-${item.id}`}>
      <Image source={{ uri: item.coverUrl }} style={styles.offerImage} />
      <View style={styles.offerContent}>
        <View style={styles.offerHeader}>
          <Text style={styles.offerTitle}>{item.title}</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}</Text>
          </View>
        </View>
        <Text style={styles.offerDescription}>{item.description}</Text>
        <View style={styles.offerFooter}>
          <Text style={styles.offerAuthor}>by {item.author}</Text>
          <Text style={styles.offerPrice}>{item.price} FBC</Text>
        </View>
        <TouchableOpacity 
          style={styles.offerPayButton}
          onPress={() => handleOfferPay(item)}
        >
          <CreditCard size={16} color="#ffffff" strokeWidth={2} />
          <Text style={styles.offerPayButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.personCard}
      onPress={() => handlePersonPress(item)}
      data-id={`person-${item.id}`}
    >
      <Image source={{ uri: item.avatar }} style={styles.personAvatar} />
      <View style={styles.personInfo}>
        <View style={styles.personHeader}>
          <Text style={styles.personName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#F59E0B" strokeWidth={2} fill="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
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

  return (
    <SafeAreaView style={styles.container} data-id="tab-main-feed">
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Find the best creators and services</Text>
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
        <View style={styles.section} data-id="home-deals">
          <Text style={styles.sectionTitle}>Featured Offers</Text>
          {isLoadingOffers ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.offersContainer}>
              <OfferCardSkeleton />
              <OfferCardSkeleton />
              <OfferCardSkeleton />
            </ScrollView>
          ) : featuredOffers.length > 0 ? (
            <FlatList
              data={featuredOffers}
              renderItem={renderOfferItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.offersContainer}
            />
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
            <FlatList
              data={recentPeople}
              renderItem={renderPersonItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <EmptyState type="creators" />
          )}
        </View>
      </ScrollView>

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
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
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
  offersContainer: {
    paddingLeft: 16,
    paddingRight: 8,
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
    marginRight: 16,
    width: 280,
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
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    minHeight: 36,
  },
  offerPayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 6,
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
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
  refModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  refContent: {
    padding: 24,
  },
  formField: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
    color: '#1f2937',
  },
  copyLinkButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 24,
    minHeight: 56,
  },
  copyLinkButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  linkPreview: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  linkPreviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  linkPreviewText: {
    fontSize: 14,
    color: '#1f2937',
    fontFamily: 'monospace',
  },
});