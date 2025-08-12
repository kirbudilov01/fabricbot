import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Plus, CreditCard as Edit, Trash2, X, ChevronDown, ChevronRight, Save, Eye, EyeOff, Image as ImageIcon, GripVertical, Link2, Copy, Users } from 'lucide-react-native';
import { useAppData } from '@/src/shared/lib/store';
import * as api from '@/src/shared/api/methods';
import type { Category, Subcategory, Product, PageSettings, PaymentLink } from '@/src/shared/lib/store';
import { LinkItemSkeleton } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';

export default function PageSetupTab() {
  const {
    data,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    addProduct,
    updateProduct,
    updatePageSettings,
    addLink,
    deleteLink
  } = useAppData();

  const { categories, pageSettings, links } = data;

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);
  
  // Modals
  const [pageSettingsModal, setPageSettingsModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [subcategoryModal, setSubcategoryModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  const [personalLinksModal, setPersonalLinksModal] = useState(false);
  const [createLinkModal, setCreateLinkModal] = useState(false);
  
  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{ subcategory: Subcategory; categoryId: string } | null>(null);
  const [editingProduct, setEditingProduct] = useState<{ product: Product; categoryId: string; subcategoryId: string } | null>(null);
  
  // Form data
  const [tempPageSettings, setTempPageSettings] = useState<PageSettings>(pageSettings);
  const [categoryForm, setCategoryForm] = useState({ name: '', visible: true });
  const [subcategoryForm, setSubcategoryForm] = useState({ name: '', categoryId: '' });
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    description: '',
    coverUrl: '',
    categoryId: '',
    subcategoryId: ''
  });

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
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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

  const toggleCategoryVisibility = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      updateCategory(categoryId, { visible: !category.visible });
    }
  };

  const handleSavePageSettings = () => {
    api.savePageSettings(tempPageSettings)
      .then((updatedSettings) => {
        updatePageSettings(updatedSettings);
        setPageSettingsModal(false);
      })
      .catch(() => {
        // Toast will be shown by API client error handling
      });
  };

  const handleAddCategory = () => {
    setCategoryForm({ name: '', visible: true });
    setEditingCategory(null);
    setCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({ name: category.name, visible: category.visible });
    setEditingCategory(category);
    setCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) return;

    if (editingCategory) {
      api.updateCategory(editingCategory.id, { 
        name: categoryForm.name, 
        visible: categoryForm.visible 
      })
        .then((updatedCategory) => {
          updateCategory(editingCategory.id, updatedCategory);
          setCategoryModal(false);
        })
        .catch(() => {
          // Toast will be shown by API client error handling
        });
    } else {
      api.createCategory({
        name: categoryForm.name,
        visible: categoryForm.visible,
        subcategories: []
      })
        .then((newCategory) => {
          addCategory(newCategory);
          setCategoryModal(false);
        })
        .catch(() => {
          // Toast will be shown by API client error handling
        });
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category and all its content?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            api.deleteCategory(categoryId)
              .then(() => {
                deleteCategory(categoryId);
              })
              .catch(() => {
                // Toast will be shown by API client error handling
              });
          }
        }
      ]
    );
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSubcategoryForm({ name: '', categoryId });
    setEditingSubcategory(null);
    setSubcategoryModal(true);
  };

  const handleSaveSubcategory = () => {
    if (!subcategoryForm.name.trim()) return;

    if (editingSubcategory) {
      updateSubcategory(
        editingSubcategory.categoryId,
        editingSubcategory.subcategory.id,
        { name: subcategoryForm.name }
      );
    } else {
      addSubcategory(subcategoryForm.categoryId, {
        name: subcategoryForm.name,
        products: []
      });
    }
    setSubcategoryModal(false);
  };

  const handleAddProduct = (categoryId: string, subcategoryId: string) => {
    setProductForm({
      title: '',
      price: '',
      description: '',
      coverUrl: '',
      categoryId,
      subcategoryId
    });
    setEditingProduct(null);
    setProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.title.trim() || !productForm.price.trim()) return;

    if (editingProduct) {
      api.updateProduct(editingProduct.product.id, {
        title: productForm.title,
        price: productForm.price,
        description: productForm.description,
        coverUrl: productForm.coverUrl
      })
        .then((updatedProduct) => {
          updateProduct(
            editingProduct.categoryId,
            editingProduct.subcategoryId,
            editingProduct.product.id,
            updatedProduct
          );
          setProductModal(false);
        })
        .catch(() => {
          // Toast will be shown by API client error handling
        });
    } else {
      api.createProduct({
        title: productForm.title,
        price: productForm.price,
        description: productForm.description,
        coverUrl: productForm.coverUrl,
        categoryId: productForm.categoryId,
        subcategoryId: productForm.subcategoryId
      })
        .then((newProduct) => {
          addProduct(productForm.categoryId, productForm.subcategoryId, newProduct);
          setProductModal(false);
        })
        .catch(() => {
          // Toast will be shown by API client error handling
        });
    }
  };

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
    <SafeAreaView style={styles.container} data-id="tab-page-setup">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Configure My Page</Text>
          <Text style={styles.subtitle}>Manage your profile and products</Text>
        </View>

        {/* Main Actions */}
        <View style={styles.mainActionsSection}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => {
              setTempPageSettings(pageSettings);
              setPageSettingsModal(true);
            }}
            data-id="btn-configure-page"
          >
            <View style={styles.actionCardLeft}>
              <View style={[styles.actionCardIcon, { backgroundColor: '#EBF4FF' }]}>
                <Settings size={24} color="#3B82F6" strokeWidth={2} />
              </View>
              <View style={styles.actionCardInfo}>
                <Text style={styles.actionCardTitle}>Page Settings</Text>
                <Text style={styles.actionCardSubtitle}>Name, bio, and profile settings</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => setPersonalLinksModal(true)}
            data-id="links-mode-view"
          >
            <View style={styles.actionCardLeft}>
              <View style={[styles.actionCardIcon, { backgroundColor: '#F0FDF4' }]}>
                <Link2 size={24} color="#10B981" strokeWidth={2} />
              </View>
              <View style={styles.actionCardInfo}>
                <Text style={styles.actionCardTitle}>Personal Links</Text>
                <Text style={styles.actionCardSubtitle}>Generate custom referral links</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
        {/* Payment History Section */}
        <View style={styles.paymentHistorySection}>
          <Text style={styles.sectionTitle}>Payment Receipt + Referral Payout</Text>
          
          {isLoadingHistory ? (
            <View style={styles.historyList} data-id="list-links">
              <LinkItemSkeleton />
              <LinkItemSkeleton />
              <LinkItemSkeleton />
            </View>
          ) : data.deals.length > 0 ? (
            <View style={styles.historyList} data-id="list-links">
              {data.deals.map((deal) => (
                <View key={deal.id} style={styles.historyItem}>
                  <View style={styles.historyContent}>
                    <View style={styles.historyLeft}>
                      <Text style={styles.historyTitle}>{deal.title || 'Deal'}</Text>
                      <Text style={styles.historyAmount}>{deal.amountFBC} FBC</Text>
                      <Text style={styles.historyDate}>{deal.date}</Text>
                      <View style={styles.historyUsers}>
                        <Text style={styles.historyPaidBy}>Paid by @user</Text>
                        {deal.refUsername && (
                          <Text style={styles.historyReferral}>Referral {deal.refUsername}</Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.historyRight}>
                      <View style={[
                        styles.historyStatusChip,
                        { backgroundColor: deal.status === 'released' ? '#F0FDF4' : '#FEF3C7' }
                      ]}>
                        <Text style={[
                          styles.historyStatusText,
                          { color: deal.status === 'released' ? '#10B981' : '#D97706' }
                        ]}>
                          {deal.status === 'released' ? 'Payment received' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyHistory} data-id="list-links">
              <EmptyState 
                type="links" 
                onAction={() => setCreateLinkModal(true)}
                actionText="Create payment link"
              />
            </View>
          )}
        </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories & Products</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory} data-id="cfg-btn-add-category">
              <Plus size={20} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.addButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>

          <View data-id="cfg-list-categories">
            {categories.map((category) => {
              const isCategoryExpanded = expandedCategories.includes(category.id);

              return (
                <View key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <TouchableOpacity
                      style={styles.categoryTitleContainer}
                      onPress={() => toggleCategory(category.id)}
                    >
                      <Text style={styles.categoryTitle}>{category.name}</Text>
                      {isCategoryExpanded ? (
                        <ChevronDown size={20} color="#6b7280" strokeWidth={2} />
                      ) : (
                        <ChevronRight size={20} color="#6b7280" strokeWidth={2} />
                      )}
                    </TouchableOpacity>
                    
                    <View style={styles.categoryActions}>
                      <TouchableOpacity
                        style={styles.visibilityButton}
                        onPress={() => toggleCategoryVisibility(category.id)}
                      >
                        {category.visible ? (
                          <Eye size={18} color="#10B981" strokeWidth={2} />
                        ) : (
                          <EyeOff size={18} color="#9CA3AF" strokeWidth={2} />
                        )}
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditCategory(category)}
                      >
                        <Edit size={18} color="#6B7280" strokeWidth={2} />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={18} color="#EF4444" strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {isCategoryExpanded && (
                    <View style={styles.subcategoriesContainer}>
                      <TouchableOpacity
                        style={styles.addSubcategoryButton}
                        onPress={() => handleAddSubcategory(category.id)}
                      >
                        <Plus size={16} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.addSubcategoryText}>Add Subcategory</Text>
                      </TouchableOpacity>

                      {category.subcategories.map((subcategory) => {
                        const isSubcategoryExpanded = expandedSubcategories.includes(subcategory.id);

                        return (
                          <View key={subcategory.id} style={styles.subcategoryCard}>
                            <TouchableOpacity
                              style={styles.subcategoryHeader}
                              onPress={() => toggleSubcategory(subcategory.id)}
                            >
                              <Text style={styles.subcategoryTitle}>{subcategory.name}</Text>
                              {isSubcategoryExpanded ? (
                                <ChevronDown size={18} color="#9CA3AF" strokeWidth={2} />
                              ) : (
                                <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} />
                              )}
                            </TouchableOpacity>

                            {isSubcategoryExpanded && (
                              <View style={styles.productsContainer}>
                                <TouchableOpacity
                                  style={styles.addProductButton}
                                  onPress={() => handleAddProduct(category.id, subcategory.id)}
                                  data-id="cfg-btn-add-product"
                                >
                                  <Plus size={14} color="#9CA3AF" strokeWidth={2} />
                                  <Text style={styles.addProductText}>Add Product</Text>
                                </TouchableOpacity>

                                <View data-id="cfg-list-products">
                                  {subcategory.products.length > 0 ? (
                                    subcategory.products.map((product) => (
                                      <View key={product.id} style={styles.productCard}>
                                        <View style={styles.productInfo}>
                                          <Text style={styles.productTitle}>{product.title}</Text>
                                          <Text style={styles.productPrice}>{product.price} FBC</Text>
                                        </View>
                                        <View style={styles.productActions}>
                                          <TouchableOpacity
                                            style={styles.editProductButton}
                                            onPress={() => {
                                              setProductForm({
                                                title: product.title,
                                                price: product.price,
                                                description: product.description,
                                                coverUrl: product.coverUrl || '',
                                                categoryId: category.id,
                                                subcategoryId: subcategory.id
                                              });
                                              setEditingProduct({ product, categoryId: category.id, subcategoryId: subcategory.id });
                                              setProductModal(true);
                                            }}
                                          >
                                            <Edit size={16} color="#6B7280" strokeWidth={2} />
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    ))
                                  ) : (
                                    <View style={styles.emptyProducts}>
                                      <EmptyState 
                                        type="products" 
                                        onAction={() => handleAddProduct(category.id, subcategory.id)}
                                        actionText="Add product"
                                      />
                                    </View>
                                  )}
                                </View>
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
          </View>
        </View>
      </ScrollView>

      {/* Page Settings Modal */}
      <Modal
        visible={pageSettingsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Page Settings</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPageSettingsModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Public Name</Text>
              <TextInput
                style={styles.textInput}
                value={tempPageSettings.publicName}
                onChangeText={(text) => setTempPageSettings({ ...tempPageSettings, publicName: text })}
                placeholder="Your public name"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={tempPageSettings.bio}
                onChangeText={(text) => setTempPageSettings({ ...tempPageSettings, bio: text })}
                placeholder="Tell about yourself"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Username/Slug</Text>
              <TextInput
                style={styles.textInput}
                value={tempPageSettings.slug}
                onChangeText={(text) => setTempPageSettings({ ...tempPageSettings, slug: text })}
                placeholder="username"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSavePageSettings}>
              <Save size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Personal Links Modal */}
      <Modal
        visible={personalLinksModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Personal Links</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setPersonalLinksModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.createLinkButton}
              onPress={() => setCreateLinkModal(true)}
            >
              <Plus size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.createLinkButtonText}>Create New Link</Text>
            </TouchableOpacity>

            <ScrollView style={styles.linksContainer}>
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
            </ScrollView>
          </View>
        </View>
      </Modal>

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
          </View>
        </View>
      </Modal>
      {/* Category Modal */}
      <Modal
        visible={categoryModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setCategoryModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Category Name</Text>
              <TextInput
                style={styles.textInput}
                value={categoryForm.name}
                onChangeText={(text) => setCategoryForm({ ...categoryForm, name: text })}
                placeholder="Enter category name"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCategory}>
              <Save size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.saveButtonText}>
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Subcategory Modal */}
      <Modal
        visible={subcategoryModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Subcategory</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSubcategoryModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Subcategory Name</Text>
              <TextInput
                style={styles.textInput}
                value={subcategoryForm.name}
                onChangeText={(text) => setSubcategoryForm({ ...subcategoryForm, name: text })}
                placeholder="Enter subcategory name"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSubcategory}>
              <Save size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Add Subcategory</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Product Modal */}
      <Modal
        visible={productModal}
        animationType="slide"
        transparent={true}
        data-id="cfg-modal-product"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setProductModal(false)}
              >
                <X size={24} color="#6b7280" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Product Title</Text>
                <TextInput
                  style={styles.textInput}
                  value={productForm.title}
                  onChangeText={(text) => setProductForm({ ...productForm, title: text })}
                  placeholder="Enter product title"
                  data-id="cfg-input-title"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Price (FBC)</Text>
                <TextInput
                  style={styles.textInput}
                  value={productForm.price}
                  onChangeText={(text) => setProductForm({ ...productForm, price: text })}
                  placeholder="0.00"
                  keyboardType="numeric"
                  data-id="cfg-input-price-fbc"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={productForm.description}
                  onChangeText={(text) => setProductForm({ ...productForm, description: text })}
                  placeholder="Product description"
                  multiline
                  numberOfLines={4}
                  data-id="cfg-input-desc"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Cover Image URL (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={productForm.coverUrl}
                  onChangeText={(text) => setProductForm({ ...productForm, coverUrl: text })}
                  placeholder="https://example.com/image.jpg"
                  data-id="cfg-input-cover"
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProduct}>
                <Save size={20} color="#ffffff" strokeWidth={2} />
                <Text style={styles.saveButtonText}>
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Text>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  mainActionsSection: {
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionCardInfo: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  actionCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoriesSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
    marginLeft: 4,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginRight: 8,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visibilityButton: {
    padding: 8,
    marginRight: 4,
  },
  editButton: {
    padding: 8,
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  subcategoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  addSubcategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  addSubcategoryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  subcategoryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  subcategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  subcategoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  productsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  addProductText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProductButton: {
    padding: 6,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  createLinkButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  createLinkButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  linksContainer: {
    maxHeight: 400,
  },
  linkCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  linkDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  linkProduct: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 11,
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
  disabledButton: {
    backgroundColor: '#d1d5db',
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
  paymentHistorySection: {
    marginBottom: 32,
  },
  historyList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  historyContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
  },
  historyLeft: {
    flex: 1,
    marginRight: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  historyUsers: {
    gap: 4,
  },
  historyPaidBy: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  historyReferral: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyStatusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyHistory: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyProducts: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    marginTop: 8,
  },
});