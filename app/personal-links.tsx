import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Copy, Trash2, X, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/src/shared/lib/store';
import EmptyState from '@/components/EmptyState';

export default function PersonalLinksScreen() {
  const router = useRouter();
  const { data, addLink, deleteLink } = useAppData();
  const { categories, links } = data;

  const [createLinkModal, setCreateLinkModal] = useState(false);
  const [linkForm, setLinkForm] = useState({
    username: '',
    productId: '',
    productTitle: '',
    customProductTitle: '',
    customPrice: '',
    referralUsername: '',
    referralAmount: '',
    isCustomProduct: false
  });

  // Get all products for dropdown
  const getAllProducts = () => {
    const allProducts: { id: string; title: string }[] = [];
    categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        subcategory.products.forEach(product => {
          allProducts.push({ id: product.id, title: product.title });
        });
      });
    });
    return allProducts;
  };

  const handleCreatePersonalLink = () => {
    if (!linkForm.username.trim() || (!linkForm.productId && !linkForm.customProductTitle.trim())) return;

    const productTitle = linkForm.isCustomProduct ? linkForm.customProductTitle : linkForm.productTitle;
    const productId = linkForm.isCustomProduct ? `custom-${Date.now()}` : linkForm.productId;
    
    addLink({
      username: linkForm.username,
      productId: productId,
      productTitle: productTitle,
      link: `t.me/your_bot?startapp=product=${productId}&ref=${linkForm.username.replace('@', '')}`,
      createdAt: new Date().toISOString().split('T')[0]
    });
    
    setCreateLinkModal(false);
    setLinkForm({ 
      username: '', 
      productId: '', 
      productTitle: '',
      customProductTitle: '',
      customPrice: '',
      referralUsername: '',
      referralAmount: '',
      isCustomProduct: false
    });
  };

  const handleCopyLink = (link: string) => {
    // In real app, copy to clipboard
    Alert.alert('Copied', `Link copied: ${link}`);
  };

  const handleDeletePersonalLink = (linkId: string) => {
    Alert.alert(
      'Delete Link',
      'Are you sure you want to delete this personal link?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteLink(linkId)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        bounces={false}
        contentInsetAdjustmentBehavior="never"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Links</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Create Link Button */}
        <View style={styles.createSection}>
          <TouchableOpacity
            style={styles.createLinkButton}
            onPress={() => setCreateLinkModal(true)}
          >
            <Plus size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.createLinkButtonText}>Create New Link</Text>
          </TouchableOpacity>
        </View>

        {/* Links List */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Your Links</Text>
          
          {links.length > 0 ? (
            <View style={styles.linksContainer}>
              {links.map((link) => (
                <View key={link.id} style={styles.linkCard}>
                  <View style={styles.linkInfo}>
                    <View style={styles.linkHeader}>
                      <Text style={styles.linkUsername}>{link.username}</Text>
                      <Text style={styles.linkDate}>{link.createdAt}</Text>
                    </View>
                    <Text style={styles.linkProduct}>{link.productTitle}</Text>
                    <Text style={styles.linkUrl} numberOfLines={1}>{link.link}</Text>
                  </View>
                  <View style={styles.linkActions}>
                    <TouchableOpacity
                      style={styles.copyLinkButton}
                      onPress={() => handleCopyLink(link.link)}
                    >
                      <Copy size={16} color="#3B82F6" strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteLinkButton}
                      onPress={() => handleDeletePersonalLink(link.id)}
                    >
                      <Trash2 size={16} color="#EF4444" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <EmptyState 
                type="links" 
                onAction={() => setCreateLinkModal(true)}
                actionText="Create your first link"
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Link Modal */}
      <Modal
        visible={createLinkModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Personal Link</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCreateLinkModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  value={linkForm.username}
                  onChangeText={(text) => setLinkForm({ ...linkForm, username: text })}
                  placeholder="@username"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Referral Username (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={linkForm.referralUsername}
                  onChangeText={(text) => setLinkForm({ ...linkForm, referralUsername: text })}
                  placeholder="@referral_user"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Referral Amount (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={linkForm.referralAmount}
                  onChangeText={(text) => setLinkForm({ ...linkForm, referralAmount: text })}
                  placeholder="10.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.toggleSection}>
                <TouchableOpacity
                  style={styles.toggleOption}
                  onPress={() => setLinkForm({ ...linkForm, isCustomProduct: false })}
                >
                  <View style={[styles.radioButton, !linkForm.isCustomProduct && styles.radioButtonSelected]}>
                    {!linkForm.isCustomProduct && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.toggleText}>Select from existing products</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.toggleOption}
                  onPress={() => setLinkForm({ ...linkForm, isCustomProduct: true })}
                >
                  <View style={[styles.radioButton, linkForm.isCustomProduct && styles.radioButtonSelected]}>
                    {linkForm.isCustomProduct && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={styles.toggleText}>Create custom product</Text>
                </TouchableOpacity>
              </View>

              {!linkForm.isCustomProduct ? (
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>Select Product</Text>
                  <ScrollView style={styles.productSelector}>
                    {getAllProducts().map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        style={[
                          styles.productOption,
                          linkForm.productId === product.id && styles.selectedProductOption
                        ]}
                        onPress={() => setLinkForm({ 
                          ...linkForm, 
                          productId: product.id, 
                          productTitle: product.title 
                        })}
                      >
                        <Text style={[
                          styles.productOptionText,
                          linkForm.productId === product.id && styles.selectedProductOptionText
                        ]}>
                          {product.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              ) : (
                <>
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Custom Product Title</Text>
                    <TextInput
                      style={styles.textInput}
                      value={linkForm.customProductTitle}
                      onChangeText={(text) => setLinkForm({ ...linkForm, customProductTitle: text })}
                      placeholder="Enter custom product title"
                    />
                  </View>
                  
                  <View style={styles.formField}>
                    <Text style={styles.fieldLabel}>Custom Price (FBC)</Text>
                    <TextInput
                      style={styles.textInput}
                      value={linkForm.customPrice}
                      onChangeText={(text) => setLinkForm({ ...linkForm, customPrice: text })}
                      placeholder="0.00"
                      keyboardType="numeric"
                    />
                  </View>
                </>
              )}

              <TouchableOpacity 
                style={[
                  styles.saveButton,
                  (!linkForm.username.trim() || (!linkForm.productId && !linkForm.customProductTitle.trim())) && styles.disabledButton
                ]} 
                onPress={handleCreatePersonalLink}
                disabled={!linkForm.username.trim() || (!linkForm.productId && !linkForm.customProductTitle.trim())}
              >
                <Save size={20} color="#ffffff" strokeWidth={2} />
                <Text style={styles.saveButtonText}>Create Link</Text>
              </TouchableOpacity>
            </ScrollView>
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
  createSection: {
    padding: 16,
  },
  createLinkButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    minHeight: 56,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createLinkButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  linksSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  linksContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  linkInfo: {
    flex: 1,
    marginRight: 12,
  },
  linkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  linkUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  linkDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  linkProduct: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  linkActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyLinkButton: {
    padding: 8,
    marginRight: 4,
  },
  deleteLinkButton: {
    padding: 8,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  formField: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  toggleSection: {
    marginBottom: 16,
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3B82F6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    fontSize: 16,
    color: '#1f2937',
  },
  productSelector: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  productOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedProductOption: {
    backgroundColor: '#EBF4FF',
  },
  productOptionText: {
    fontSize: 14,
    color: '#1f2937',
  },
  selectedProductOptionText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
});