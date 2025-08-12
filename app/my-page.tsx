import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, ChevronUp, Copy, CreditCard, X, CircleCheck as CheckCircle, Users, ChevronRight, StickyNote } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/src/shared/lib/store';

export default function MyPageScreen() {
  const router = useRouter();
  const { data, addDeal } = useAppData();
  const { categories, pageSettings } = data;
  
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [payModal, setPayModal] = useState(false);
  const [refLinkModal, setRefLinkModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [refUsername, setRefUsername] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  // Get referral from URL params (mock)
  const referralUser = '@alex_designer'; // This would come from URL params

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubcategory = (subcategoryId: string) => {
    setExpandedSubcategories(prev => 
      prev.includes(subcategoryId) 
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handlePay = (product: any) => {
    setSelectedProduct(product);
    setPayModal(true);
  };

  const handleGetRefLink = (product: any) => {
    setSelectedProduct(product);
    setRefUsername(pageSettings.slug ? `@${pageSettings.slug}` : '');
    setRefLinkModal(true);
  };

  const handleProceedToPay = () => {
    if (agreeTerms) {
      // Add deal to store
      addDeal({
        productId: selectedProduct.id,
        title: selectedProduct.title,
        amountFBC: selectedProduct.price,
        refUsername: referralUser || undefined,
        role: 'creator',
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      });
      
      setPayModal(false);
      setPaymentSuccess(true);
      setAgreeTerms(false);
      setPaymentNote('');
    }
  };

  const handleCopyRefLink = () => {
    const refParam = refUsername ? `&ref=${refUsername}` : '';
    const link = `t.me/your_bot?startapp=product=${selectedProduct.id}${refParam}`;
    // In real app, copy to clipboard
    console.log('Copied link:', link);
    alert(`Link copied: ${link}`);
  };

  const visibleCategories = categories.filter(c => c.visible);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Page</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Referral Badge */}
        {referralUser && (
          <View style={styles.referralBadge} data-id="badge-ref">
            <Users size={16} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.referralText}>Referral: {referralUser}</Text>
          </View>
        )}

        {/* Page Info */}
        <View style={styles.pageInfo}>
          <Text style={styles.pageName}>{pageSettings.publicName}</Text>
          <Text style={styles.pageBio}>{pageSettings.bio}</Text>
        </View>

        {/* Categories */}
        {visibleCategories.map((category) => {
          const isCategoryExpanded = expandedCategories.includes(category.id);

          return (
            <View key={category.id} style={styles.categorySection}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category.id)}
              >
                <Text style={styles.categoryTitle}>{category.name}</Text>
                {isCategoryExpanded ? (
                  <ChevronUp size={20} color="#6b7280" strokeWidth={2} />
                ) : (
                  <ChevronDown size={20} color="#6b7280" strokeWidth={2} />
                )}
              </TouchableOpacity>

              {isCategoryExpanded && (
                <View style={styles.subcategoriesContainer}>
                  {category.subcategories.map((subcategory) => {
                    const isSubcategoryExpanded = expandedSubcategories.includes(subcategory.id);

                    return (
                      <View key={subcategory.id} style={styles.subcategorySection}>
                        <TouchableOpacity
                          style={styles.subcategoryHeader}
                          onPress={() => toggleSubcategory(subcategory.id)}
                        >
                          <Text style={styles.subcategoryTitle}>{subcategory.name}</Text>
                          <ChevronRight size={18} color="#9ca3af" strokeWidth={2} />
                        </TouchableOpacity>

                        {isSubcategoryExpanded && (
                          <View style={styles.productsContainer}>
                            {subcategory.products.map((product) => (
                              <TouchableOpacity
                                key={product.id}
                                style={styles.productItem}
                                onPress={() => setSelectedProduct(product)}
                              >
                                <Text style={styles.productTitle}>{product.title}</Text>
                                <Text style={styles.productPrice}>{product.price} FBC</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Product Details Modal */}
      <Modal
        visible={!!selectedProduct && !payModal && !refLinkModal}
        animationType="slide"
        transparent={true}
        data-id="product-details"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Product Details</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedProduct(null)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {selectedProduct && (
              <ScrollView>
                {selectedProduct.coverUrl ? (
                  <Image source={{ uri: selectedProduct.coverUrl }} style={styles.detailsCover} />
                ) : (
                  <View style={styles.detailsCoverPlaceholder}>
                    <Text style={styles.detailsCoverText}>No Image</Text>
                  </View>
                )}
                
                <View style={styles.detailsContent}>
                  <Text style={styles.detailsTitle}>{selectedProduct.title}</Text>
                  <Text style={styles.detailsDescription}>{selectedProduct.description}</Text>
                  <Text style={styles.detailsPrice}>{selectedProduct.price} FBC</Text>
                  
                  <View style={styles.detailsActions}>
                    <TouchableOpacity
                      style={styles.detailsPayButton}
                      onPress={() => handlePay(selectedProduct)}
                      data-id="btn-pay"
                    >
                      <CreditCard size={20} color="#ffffff" strokeWidth={2} />
                      <Text style={styles.detailsPayButtonText}>Pay</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.detailsRefButton}
                      onPress={() => handleGetRefLink(selectedProduct)}
                      data-id="btn-get-ref-link"
                    >
                      <Copy size={20} color="#3B82F6" strokeWidth={2} />
                      <Text style={styles.detailsRefButtonText}>Get referral link</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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

            {selectedProduct && (
              <View style={styles.payContent}>
                <View style={styles.paySummary}>
                  <View style={styles.payRow}>
                    <Text style={styles.payLabel}>Amount:</Text>
                    <Text style={styles.payValue}>{selectedProduct.price} FBC</Text>
                  </View>
                  <View style={styles.payRow}>
                    <Text style={styles.payLabel}>Product:</Text>
                    <Text style={styles.payValue}>{selectedProduct.title}</Text>
                  </View>
                  <View style={styles.payRow}>
                    <Text style={styles.payLabel}>Recipient:</Text>
                    <Text style={styles.payValue}>{pageSettings.publicName}</Text>
                  </View>
                  {referralUser && (
                    <View style={styles.payRow}>
                      <Text style={styles.payLabel}>Referral:</Text>
                      <Text style={styles.payValue}>{referralUser}</Text>
                    </View>
                  )}
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
                setSelectedProduct(null);
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Get Referral Link Modal */}
      <Modal
        visible={refLinkModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.refModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Get Referral Link</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setRefLinkModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.refContent}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>@referral_username (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={refUsername}
                  onChangeText={setRefUsername}
                  placeholder="@username"
                  data-id="input-ref-username"
                />
              </View>

              <TouchableOpacity
                style={styles.copyLinkButton}
                onPress={handleCopyRefLink}
                data-id="btn-copy-ref-link"
              >
                <Copy size={20} color="#ffffff" strokeWidth={2} />
                <Text style={styles.copyLinkButtonText}>Copy link</Text>
              </TouchableOpacity>

              {selectedProduct && (
                <View style={styles.linkPreview}>
                  <Text style={styles.linkPreviewLabel}>Link preview:</Text>
                  <Text style={styles.linkPreviewText}>
                    t.me/your_bot?startapp=product={selectedProduct.id}
                    {refUsername && `&ref=${refUsername}`}
                  </Text>
                </View>
              )}
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSpacer: {
    width: 44,
  },
  referralBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
  },
  referralText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
  },
  pageInfo: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  pageName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  pageBio: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  categorySection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  subcategoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subcategorySection: {
    marginTop: 12,
  },
  subcategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  subcategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  productsContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  productItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10B981',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  detailsModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
  detailsCover: {
    width: '100%',
    height: 200,
  },
  detailsCoverPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCoverText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  detailsContent: {
    padding: 24,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 32,
  },
  detailsActions: {
    gap: 16,
  },
  detailsPayButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    minHeight: 56,
  },
  detailsPayButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  detailsRefButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#3B82F6',
    minHeight: 56,
  },
  detailsRefButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 8,
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