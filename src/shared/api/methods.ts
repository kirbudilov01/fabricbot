import { get, post, put, del } from './client';
import type { PageSettings, Category, Product, Deal } from '../lib/store';

// Storage key for localStorage
const STORAGE_KEY = 'fbc.owner.config';

// Helper to get data from localStorage
const getStorageData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return null;
  }
};

// Helper to save data to localStorage
const setStorageData = (data: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to write to localStorage:', error);
    throw new Error('Failed to save data');
  }
};

// Generate unique ID
const generateId = () => Date.now().toString();

// Page Settings API
export const getPageSettings = async (): Promise<PageSettings> => {
  // TODO: Replace with real API call
  // return get<PageSettings>('/api/page-settings');
  
  const data = getStorageData();
  return data?.pageSettings || {
    publicName: 'KIRILL BUDILOV',
    bio: 'Full-stack developer and creative professional',
    slug: 'kirill_budilov',
  };
};

export const savePageSettings = async (settings: Partial<PageSettings>): Promise<PageSettings> => {
  // TODO: Replace with real API call
  // return put<PageSettings>('/api/page-settings', settings);
  
  const data = getStorageData() || {};
  const updatedSettings = { ...data.pageSettings, ...settings };
  
  setStorageData({
    ...data,
    pageSettings: updatedSettings,
  });
  
  return updatedSettings;
};

// Categories API
export const listCategories = async (): Promise<Category[]> => {
  // TODO: Replace with real API call
  // return get<Category[]>('/api/categories');
  
  const data = getStorageData();
  return data?.categories || [];
};

export const createCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
  // TODO: Replace with real API call
  // return post<Category>('/api/categories', categoryData);
  
  const data = getStorageData() || {};
  const newCategory: Category = {
    ...categoryData,
    id: generateId(),
  };
  
  const categories = data.categories || [];
  const updatedCategories = [...categories, newCategory];
  
  setStorageData({
    ...data,
    categories: updatedCategories,
  });
  
  return newCategory;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
  // TODO: Replace with real API call
  // return put<Category>(`/api/categories/${id}`, updates);
  
  const data = getStorageData() || {};
  const categories = data.categories || [];
  
  const categoryIndex = categories.findIndex((cat: Category) => cat.id === id);
  if (categoryIndex === -1) {
    throw new Error('Category not found');
  }
  
  const updatedCategory = { ...categories[categoryIndex], ...updates };
  const updatedCategories = [...categories];
  updatedCategories[categoryIndex] = updatedCategory;
  
  setStorageData({
    ...data,
    categories: updatedCategories,
  });
  
  return updatedCategory;
};

export const deleteCategory = async (id: string): Promise<void> => {
  // TODO: Replace with real API call
  // return del(`/api/categories/${id}`);
  
  const data = getStorageData() || {};
  const categories = data.categories || [];
  
  const updatedCategories = categories.filter((cat: Category) => cat.id !== id);
  
  setStorageData({
    ...data,
    categories: updatedCategories,
  });
};

// Products API
export const listProducts = async (): Promise<Product[]> => {
  // TODO: Replace with real API call
  // return get<Product[]>('/api/products');
  
  const data = getStorageData();
  const categories = data?.categories || [];
  
  // Flatten all products from all categories and subcategories
  const allProducts: Product[] = [];
  categories.forEach((category: Category) => {
    category.subcategories.forEach((subcategory) => {
      allProducts.push(...subcategory.products);
    });
  });
  
  return allProducts;
};

export const createProduct = async (productData: Omit<Product, 'id'> & { categoryId: string; subcategoryId: string }): Promise<Product> => {
  // TODO: Replace with real API call
  // return post<Product>('/api/products', productData);
  
  const { categoryId, subcategoryId, ...productInfo } = productData;
  const data = getStorageData() || {};
  const categories = data.categories || [];
  
  const newProduct: Product = {
    ...productInfo,
    id: generateId(),
  };
  
  const updatedCategories = categories.map((category: Category) => {
    if (category.id === categoryId) {
      return {
        ...category,
        subcategories: category.subcategories.map((subcategory) => {
          if (subcategory.id === subcategoryId) {
            return {
              ...subcategory,
              products: [...subcategory.products, newProduct],
            };
          }
          return subcategory;
        }),
      };
    }
    return category;
  });
  
  setStorageData({
    ...data,
    categories: updatedCategories,
  });
  
  return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  // TODO: Replace with real API call
  // return put<Product>(`/api/products/${id}`, updates);
  
  const data = getStorageData() || {};
  const categories = data.categories || [];
  
  let updatedProduct: Product | null = null;
  
  const updatedCategories = categories.map((category: Category) => ({
    ...category,
    subcategories: category.subcategories.map((subcategory) => ({
      ...subcategory,
      products: subcategory.products.map((product: Product) => {
        if (product.id === id) {
          updatedProduct = { ...product, ...updates };
          return updatedProduct;
        }
        return product;
      }),
    })),
  }));
  
  if (!updatedProduct) {
    throw new Error('Product not found');
  }
  
  setStorageData({
    ...data,
    categories: updatedCategories,
  });
  
  return updatedProduct;
};

export const deleteProduct = async (id: string): Promise<void> => {
  // TODO: Replace with real API call
  // return del(`/api/products/${id}`);
  
  const data = getStorageData() || {};
  const categories = data.categories || [];
  
  const updatedCategories = categories.map((category: Category) => ({
    ...category,
    subcategories: category.subcategories.map((subcategory) => ({
      ...subcategory,
      products: subcategory.products.filter((product: Product) => product.id !== id),
    })),
  }));
  
  setStorageData({
    ...data,
    categories: updatedCategories,
  });
};

// Deals API
export const createDeal = async (dealData: Omit<Deal, 'id'>): Promise<Deal> => {
  // TODO: Replace with real API call
  // return post<Deal>('/api/deals', dealData);
  
  const data = getStorageData() || {};
  const newDeal: Deal = {
    ...dealData,
    id: generateId(),
  };
  
  const deals = data.deals || [];
  const updatedDeals = [...deals, newDeal];
  
  setStorageData({
    ...data,
    deals: updatedDeals,
  });
  
  return newDeal;
};

export const listDeals = async (status?: string): Promise<Deal[]> => {
  // TODO: Replace with real API call
  // const query = status ? `?status=${status}` : '';
  // return get<Deal[]>(`/api/deals${query}`);
  
  const data = getStorageData();
  const deals = data?.deals || [];
  
  if (status) {
    return deals.filter((deal: Deal) => deal.status === status);
  }
  
  return deals;
};

export const confirmDeal = async (id: string): Promise<Deal> => {
  // TODO: Replace with real API call
  // return put<Deal>(`/api/deals/${id}/confirm`);
  
  const data = getStorageData() || {};
  const deals = data.deals || [];
  
  const dealIndex = deals.findIndex((deal: Deal) => deal.id === id);
  if (dealIndex === -1) {
    throw new Error('Deal not found');
  }
  
  const updatedDeal = { ...deals[dealIndex], status: 'released' as const };
  const updatedDeals = [...deals];
  updatedDeals[dealIndex] = updatedDeal;
  
  setStorageData({
    ...data,
    deals: updatedDeals,
  });
  
  return updatedDeal;
};