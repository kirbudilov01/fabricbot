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
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Edit, Trash2, X, ChevronDown, ChevronRight, Save, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/src/shared/lib/store';
import * as api from '@/src/shared/api/methods';
import type { Category, Subcategory, Product, PageSettings } from '@/src/shared/lib/store';
import EmptyState from '@/components/EmptyState';

export default function ConfigurePageScreen() {
  const router = useRouter();
  const {
    data,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    addProduct,
    updateProduct,
    updatePageSettings,
  } = useAppData();

  const { categories, pageSettings } = data;

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Modals
  const [pageSettingsModal, setPageSettingsModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [productModal, setProductModal] = useState(false);
  
  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<{ product: Product; categoryId: string; subcategoryId: string } | null>(null);
  
  // Form data
  const [tempPageSettings, setTempPageSettings] = useState<PageSettings>(pageSettings);
  const [categoryForm, setCategoryForm] = useState({ name: '', visible: true });
  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    description: '',
    coverUrl: '',
    categoryId: '',
    subcategoryId: ''
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCategoryVisibility = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      updateCategory(categoryId, { visible: !category.visible });
    }
  };

  // Get product count for a category
  const getCategoryProductCount = (category: Category) => {
    return category.subcategories.reduce((total, sub) => total + sub.products.length, 0);
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

  const handleDeleteProduct = (categoryId: string, subcategoryId: string, productId: string) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            api.deleteProduct(productId)
              .then(() => {
                // Update local store by removing the product
                updateCategory(categoryId, {
                  ...categories.find(cat => cat.id === categoryId)!,
                  subcategories: categories.find(cat => cat.id === categoryId)!.subcategories.map(sub =>
                    sub.id === subcategoryId
                      ? { ...sub, products: sub.products.filter(p => p.id !== productId) }
                      : sub
                  )
                });
              })
              .catch(() => {
                // Toast will be shown by API client error handling
              });
          }
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
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1f2937" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configure My Page</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{pageSettings.publicName}</Text>
            <Text style={styles.profileUsername}>@{pageSettings.slug}</Text>
            <Text style={styles.profileBio}>{pageSettings.bio}</Text>
            <Text style={styles.profileBio}>{pageSettings.bio}</Text>
          </View>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => {
              setTempPageSettings(pageSettings);
              setPageSettingsModal(true);
            }}
          >
            <Edit size={18} color="#3B82F6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories & Products</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddCategory} data-id="cfg-btn-add-category">
              <Plus size={20} color="#3B82F6" strokeWidth={2} />
              <Text style={styles.addButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>

          <View>
            {categories.map((category) => {
              const isCategoryExpanded = expandedCategories.includes(category.id);
              const productCount = getCategoryProductCount(category);

              return (
                <View key={category.id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <TouchableOpacity
                      style={styles.categoryTitleContainer}
                      onPress={() => toggleCategory(category.id)}
                    >
                      <View style={styles.categoryTitleRow}>
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                        <Text style={styles.productCount}>{productCount} products</Text>
                      </View>
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
                    <View style={styles.productsContainer}>
                      <View style={styles.productsHeader}>
                        <Text style={styles.productsTitle}>Products</Text>
                        <TouchableOpacity
                          style={styles.addProductButton}
                          onPress={() => {
                            // Use first subcategory or create one if none exists
                            const subcategoryId = category.subcategories[0]?.id || 'default';
                            handleAddProduct(category.id, subcategoryId);
                          }}
                          data-id="cfg-btn-add-product"
                        >
                          <Plus size={16} color="#3B82F6" strokeWidth={2} />
                          <Text style={styles.addProductText}>Add Product</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Flatten all products from all subcategories */}
                      {category.subcategories.flatMap(subcategory => 
                        subcategory.products.map(product => (
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
                              <TouchableOpacity
                                style={styles.deleteProductButton}
                                onPress={() => handleDeleteProduct(category.id, subcategory.id, product.id)}
                              >
                                <Trash2 size={16} color="#EF4444" strokeWidth={2} />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))
                      )}

                      {productCount === 0 && (
                        <View style={styles.emptyProducts}>
                          <EmptyState 
                            type="products" 
                            onAction={() => {
                              const subcategoryId = category.subcategories[0]?.id || 'default';
                              handleAddProduct(category.id, subcategoryId);
                            }}
                            actionText="Add your first product"
                          />
                        </View>
                      )}
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

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSavePageSettings}
              data-id="cfg-btn-save-page-settings"
            >
              <Save size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.saveButtonText}>Save Settings</Text>
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

            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={handleSaveCategory}
              data-id="cfg-btn-save-category"
            >
              <Save size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.saveButtonText}>
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Product Modal */}
      <Modal
        visible={productModal}
        animationType="slide"
        transparent={true}
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
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Cover Image URL (optional)</Text>
                <TextInput
                  style={styles.textInput}
                  value={productForm.coverUrl}
                  onChangeText={(text) => setProductForm({ ...productForm, coverUrl: text })}
                  placeholder="https://example.com/image.jpg"
                />
              </View>

              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSaveProduct}
                data-id="cfg-btn-save-product"
              >
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: '#3B82F6',
    marginBottom: 4,
  },
  profileBio: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  editProfileButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesSection: {
    margin: 16,
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
  categoryTitleRow: {
    flex: 1,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  productCount: {
    fontSize: 12,
    color: '#6b7280',
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
  productsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addProductText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#3B82F6',
    marginLeft: 4,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProductButton: {
    padding: 6,
    marginRight: 4,
  },
  deleteProductButton: {
    padding: 6,
  },
  emptyProducts: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
});