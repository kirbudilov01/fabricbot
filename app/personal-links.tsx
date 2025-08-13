'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Copy, Trash2, X, Save } from 'lucide-react';

interface LinkItem {
  id: string;
  username: string;
  productId: string;
  productTitle: string;
  link: string;
  createdAt: string;
}

export default function PersonalLinksPage() {
  const router = useRouter();

  // mock data store
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [createModal, setCreateModal] = useState(false);
  const [linkForm, setLinkForm] = useState({
    username: '',
    productId: '',
    productTitle: '',
    customProductTitle: '',
    customPrice: '',
    referralUsername: '',
    referralAmount: '',
    isCustomProduct: false,
  });

  const products = [
    { id: '1', title: 'Product 1' },
    { id: '2', title: 'Product 2' },
  ];

  const handleCreate = () => {
    if (!linkForm.username.trim() || (!linkForm.productId && !linkForm.customProductTitle.trim())) return;
    const productTitle = linkForm.isCustomProduct ? linkForm.customProductTitle : linkForm.productTitle;
    const productId = linkForm.isCustomProduct ? `custom-${Date.now()}` : linkForm.productId;
    setLinks(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        username: linkForm.username,
        productId,
        productTitle,
        link: `https://t.me/your_bot?startapp=product=${productId}&ref=${linkForm.username.replace('@', '')}`,
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
    setCreateModal(false);
    setLinkForm({
      username: '',
      productId: '',
      productTitle: '',
      customProductTitle: '',
      customPrice: '',
      referralUsername: '',
      referralAmount: '',
      isCustomProduct: false,
    });
  };

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    alert(`Link copied: ${link}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this link?')) {
      setLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <button onClick={() => router.back()} className="p-2 rounded hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Personal Links</h1>
        <div className="w-8" />
      </div>

      {/* Create Button */}
      <div className="p-4">
        <button
          onClick={() => setCreateModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-3 rounded-lg shadow"
        >
          <Plus className="w-5 h-5" /> Create New Link
        </button>
      </div>

      {/* Links List */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Your Links</h2>
        {links.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {links.map(link => (
              <div key={link.id} className="flex justify-between items-center p-4 border-b last:border-b-0">
                <div>
                  <div className="flex justify-between">
                    <span className="text-blue-600 font-medium">{link.username}</span>
                    <span className="text-xs text-gray-500">{link.createdAt}</span>
                  </div>
                  <div className="text-gray-800">{link.productTitle}</div>
                  <div className="text-xs text-gray-500 truncate">{link.link}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleCopy(link.link)} className="p-2 hover:bg-gray-100 rounded">
                    <Copy className="w-4 h-4 text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(link.id)} className="p-2 hover:bg-gray-100 rounded">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow text-center text-gray-500">
            No links yet. Click "Create New Link" to add one.
          </div>
        )}
      </div>

      {/* Create Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Create Personal Link</h2>
              <button onClick={() => setCreateModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <label className="block mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              value={linkForm.username}
              onChange={e => setLinkForm({ ...linkForm, username: e.target.value })}
              placeholder="@username"
            />

            <label className="block mb-2 text-sm font-medium">Referral Username (optional)</label>
            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              value={linkForm.referralUsername}
              onChange={e => setLinkForm({ ...linkForm, referralUsername: e.target.value })}
              placeholder="@referral_user"
            />

            <label className="block mb-2 text-sm font-medium">Referral Amount (optional)</label>
            <input
              type="number"
              className="w-full border rounded p-2 mb-4"
              value={linkForm.referralAmount}
              onChange={e => setLinkForm({ ...linkForm, referralAmount: e.target.value })}
              placeholder="10.00"
            />

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!linkForm.isCustomProduct}
                  onChange={() => setLinkForm({ ...linkForm, isCustomProduct: false })}
                />
                Select from existing products
              </label>
              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input
                  type="radio"
                  checked={linkForm.isCustomProduct}
                  onChange={() => setLinkForm({ ...linkForm, isCustomProduct: true })}
                />
                Create custom product
              </label>
            </div>

            {!linkForm.isCustomProduct ? (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Select Product</label>
                <div className="border rounded max-h-32 overflow-y-auto">
                  {products.map(p => (
                    <div
                      key={p.id}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        linkForm.productId === p.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() =>
                        setLinkForm({ ...linkForm, productId: p.id, productTitle: p.title })
                      }
                    >
                      {p.title}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <label className="block mb-2 text-sm font-medium">Custom Product Title</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 mb-4"
                  value={linkForm.customProductTitle}
                  onChange={e => setLinkForm({ ...linkForm, customProductTitle: e.target.value })}
                />

                <label className="block mb-2 text-sm font-medium">Custom Price (FBC)</label>
                <input
                  type="number"
                  className="w-full border rounded p-2 mb-4"
                  value={linkForm.customPrice}
                  onChange={e => setLinkForm({ ...linkForm, customPrice: e.target.value })}
                />
              </>
            )}

            <button
              onClick={handleCreate}
              disabled={!linkForm.username.trim() || (!linkForm.productId && !linkForm.customProductTitle.trim())}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded ${
                !linkForm.username.trim() || (!linkForm.productId && !linkForm.customProductTitle.trim())
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Save className="w-5 h-5" /> Create Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
