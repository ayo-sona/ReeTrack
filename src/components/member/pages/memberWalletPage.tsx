'use client';

import { useState } from 'react';
import { Wallet, Plus, Copy, Check, CreditCard, Building, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useWallet, useCreateWallet, useTopUpWallet, useTransactions } from '@/hooks/memberHook/useMember';

export default function WalletPage() {
  const { data: wallet, isLoading } = useWallet();
  const { data: transactions } = useTransactions();
  const createWallet = useCreateWallet();
  const topUpWallet = useTopUpWallet();

  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpMethod, setTopUpMethod] = useState<'card' | 'transfer'>('transfer');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateWallet = async () => {
    try {
      await createWallet.mutateAsync();
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
    
    try {
      await topUpWallet.mutateAsync({
        amount: parseFloat(topUpAmount),
        method: topUpMethod,
      });
      setShowTopUp(false);
      setTopUpAmount('');
    } catch (error) {
      console.error('Top-up failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Wallet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Get a virtual account number to easily manage your subscriptions and payments
            </p>
            <button
              onClick={handleCreateWallet}
              disabled={createWallet.isPending}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {createWallet.isPending ? 'Creating...' : 'Create Wallet'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your balance and transactions</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-emerald-100 text-sm mb-2">Available Balance</p>
              <h2 className="text-5xl font-bold">₦{wallet.balance.toLocaleString()}</h2>
            </div>
            <button
              onClick={() => setShowTopUp(true)}
              className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Top Up
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-emerald-100 text-sm mb-1">Account Number</p>
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">{wallet.accountNumber}</p>
                <button
                  onClick={() => handleCopy(wallet.accountNumber)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-emerald-100 text-sm mb-1">Bank Name</p>
              <p className="text-xl font-bold">{wallet.bankName}</p>
            </div>
          </div>
        </div>

        {/* Top-Up Modal */}
        {showTopUp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Top Up Wallet</h3>

              {/* Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setTopUpMethod('transfer')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    topUpMethod === 'transfer'
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-sm font-medium text-gray-900">Bank Transfer</p>
                </button>

                <button
                  onClick={() => setTopUpMethod('card')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    topUpMethod === 'card'
                      ? 'border-emerald-600 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                  <p className="text-sm font-medium text-gray-900">Debit Card</p>
                </button>
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowTopUp(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUp}
                  disabled={topUpWallet.isPending || !topUpAmount}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {topUpWallet.isPending ? 'Processing...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>

          {transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {txn.type === 'credit' ? (
                        <ArrowDownToLine className={`w-6 h-6 text-green-600`} />
                      ) : (
                        <ArrowUpFromLine className={`w-6 h-6 text-red-600`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{txn.description}</p>
                      <p className="text-sm text-gray-500">{new Date(txn.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'credit' ? '+' : '-'}₦{txn.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{txn.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}