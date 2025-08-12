import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  coverUrl?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  visible: boolean;
  subcategories: Subcategory[];
}

export interface PageSettings {
  publicName: string;
  bio?: string;
  slug?: string;
  projectTonAddress?: string;
}

export interface PaymentLink {
  id: string;
  username: string;
  productId: string;
  productTitle: string;
  link: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  productId?: string;
  title?: string;
  amountFBC: string;
  refUsername?: string;
  role: 'creator' | 'referral';
  status: 'pending' | 'released' | 'cancelled';
  date: string;
}

export interface LedgerEntry {
  id: string;
  kind: 'deposit' | 'release' | 'ref_bonus' | 'fee' | 'withdraw';
  amountFBC: string;
  date: string;
}

export interface AppData {
  categories: Category[];
  products: Product[];
  pageSettings: PageSettings;
  links: PaymentLink[];
  deals: Deal[];
  ledger: LedgerEntry[];
}

const STORAGE_KEY = 'fbc.owner.config';

const defaultData: AppData = {
  categories: [
    {
      id: '1',
      name: 'YOUTUBE HELP',
      visible: true,
      subcategories: [
        {
          id: '1-1',
          name: 'CONSULTATION',
          products: [
            {
              id: '1-1-1',
              title: 'YouTube Channel Strategy',
              price: '75',
              description: 'Complete consultation on YouTube channel development, content strategy, and audience growth.',
              coverUrl: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=400',
            }
          ]
        },
        {
          id: '1-2',
          name: 'CONTENT STRATEGY',
          products: [
            {
              id: '1-2-1',
              title: 'Content Planning & Strategy',
              price: '100',
              description: 'Comprehensive content strategy for YouTube including video ideas, posting schedule, SEO optimization.',
              coverUrl: 'https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=400',
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'AI AUTOMATION',
      visible: true,
      subcategories: [
        {
          id: '2-1',
          name: 'CHATBOT DEVELOPMENT',
          products: [
            {
              id: '2-1-1',
              title: 'Custom AI Chatbot',
              price: '200',
              description: 'Development of custom AI chatbot for your business with natural language processing.',
              coverUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
            }
          ]
        }
      ]
    }
  ],
  products: [],
  pageSettings: {
    publicName: 'KIRILL BUDILOV',
    bio: 'Full-stack developer and creative professional',
    slug: 'kirill_budilov',
  },
  links: [
    {
      id: '1',
      username: '@alex_designer',
      productId: '1-1-1',
      productTitle: 'YouTube Channel Strategy',
      link: 't.me/your_bot?startapp=product=1-1-1&ref=alex_designer',
      createdAt: '2025-01-15'
    },
    {
      id: '2',
      username: '@maria_dev',
      productId: '2-1-1',
      productTitle: 'Custom AI Chatbot',
      link: 't.me/your_bot?startapp=product=2-1-1&ref=maria_dev',
      createdAt: '2025-01-14'
    }
  ],
  deals: [
    {
      id: '1',
      productId: '1-1-1',
      title: 'YouTube Channel Strategy',
      amountFBC: '75',
      refUsername: '@alex_designer',
      role: 'creator',
      status: 'pending',
      date: '2025-01-16'
    },
    {
      id: '2',
      productId: '2-1-1',
      title: 'Custom AI Chatbot',
      amountFBC: '200',
      role: 'creator',
      status: 'released',
      date: '2025-01-15'
    }
  ],
  ledger: [
    {
      id: '1',
      kind: 'release',
      amountFBC: '200',
      date: '2025-01-15'
    },
    {
      id: '2',
      kind: 'ref_bonus',
      amountFBC: '15',
      date: '2025-01-15'
    }
  ]
};

let toastCallback: ((message: string, type: 'success' | 'error' | 'warning') => void) | null = null;

export function setToastCallback(callback: (message: string, type: 'success' | 'error' | 'warning') => void) {
  toastCallback = callback;
}

function showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
  if (toastCallback) {
    toastCallback(message, type);
  }
}

function loadData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with default data to ensure all fields exist
      return {
        ...defaultData,
        ...parsed,
        pageSettings: {
          ...defaultData.pageSettings,
          ...parsed.pageSettings
        }
      };
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
  }
  return defaultData;
}

function saveData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showToast('Saved');
  } catch (error) {
    console.error('Failed to save data to localStorage:', error);
    showToast('Failed to save', 'error');
  }
}

export function useAppData() {
  const [data, setData] = useState<AppData>(defaultData);

  useEffect(() => {
    const loadedData = loadData();
    setData(loadedData);
  }, []);

  const updateData = (updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const newData = updater(prev);
      saveData(newData);
      return newData;
    });
  };

  return {
    data,
    updateData,
    // Categories
    addCategory: (category: Omit<Category, 'id'>) => {
      updateData(prev => ({
        ...prev,
        categories: [...prev.categories, { ...category, id: Date.now().toString() }]
      }));
    },
    updateCategory: (id: string, updates: Partial<Category>) => {
      updateData(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === id ? { ...cat, ...updates } : cat
        )
      }));
    },
    deleteCategory: (id: string) => {
      updateData(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat.id !== id)
      }));
    },
    // Subcategories
    addSubcategory: (categoryId: string, subcategory: Omit<Subcategory, 'id'>) => {
      updateData(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === categoryId 
            ? { ...cat, subcategories: [...cat.subcategories, { ...subcategory, id: Date.now().toString() }] }
            : cat
        )
      }));
    },
    updateSubcategory: (categoryId: string, subcategoryId: string, updates: Partial<Subcategory>) => {
      updateData(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub.id === subcategoryId ? { ...sub, ...updates } : sub
                )
              }
            : cat
        )
      }));
    },
    // Products
    addProduct: (categoryId: string, subcategoryId: string, product: Omit<Product, 'id'>) => {
      updateData(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub.id === subcategoryId
                    ? { ...sub, products: [...sub.products, { ...product, id: Date.now().toString() }] }
                    : sub
                )
              }
            : cat
        )
      }));
    },
    updateProduct: (categoryId: string, subcategoryId: string, productId: string, updates: Partial<Product>) => {
      updateData(prev => ({
        ...prev,
        categories: prev.categories.map(cat => 
          cat.id === categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub.id === subcategoryId
                    ? {
                        ...sub,
                        products: sub.products.map(prod =>
                          prod.id === productId ? { ...prod, ...updates } : prod
                        )
                      }
                    : sub
                )
              }
            : cat
        )
      }));
    },
    // Page Settings
    updatePageSettings: (updates: Partial<PageSettings>) => {
      updateData(prev => ({
        ...prev,
        pageSettings: { ...prev.pageSettings, ...updates }
      }));
    },
    // Links
    addLink: (link: Omit<PaymentLink, 'id'>) => {
      updateData(prev => ({
        ...prev,
        links: [...prev.links, { ...link, id: Date.now().toString() }]
      }));
    },
    deleteLink: (id: string) => {
      updateData(prev => ({
        ...prev,
        links: prev.links.filter(link => link.id !== id)
      }));
    },
    // Deals
    addDeal: (deal: Omit<Deal, 'id'>) => {
      updateData(prev => ({
        ...prev,
        deals: [...prev.deals, { ...deal, id: Date.now().toString() }]
      }));
    },
    updateDeal: (id: string, updates: Partial<Deal>) => {
      updateData(prev => ({
        ...prev,
        deals: prev.deals.map(deal => 
          deal.id === id ? { ...deal, ...updates } : deal
        )
      }));
    },
    // Ledger
    addLedgerEntry: (entry: Omit<LedgerEntry, 'id'>) => {
      updateData(prev => ({
        ...prev,
        ledger: [...prev.ledger, { ...entry, id: Date.now().toString() }]
      }));
    }
  };
}