'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Plus, 
  Copy, 
  Check, 
  CreditCard, 
  Building, 
  ArrowDownToLine, 
  ArrowUpFromLine,
  AlertCircle 
} from 'lucide-react';

// Mock wallet interface (placeholder until backend implements)
interface MockWallet {
  balance: number;
  accountNumber: string;
  bankName: string;
}

// Mock transaction interface
interface MockTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export default function WalletPage() {
  // Mock wallet data
  const [wallet] = useState<MockWallet>({
    balance: 0,
    accountNumber: '0000000000',
    bankName: 'ReeTrack Wallet',
  });

  // Mock transactions
  const [transactions] = useState<MockTransaction[]>([]);

  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpMethod, setTopUpMethod] = useState<'card' | 'transfer'>('transfer');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopUp = () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
    
    // Mock top-up - just close modal
    setShowTopUp(false);
    setTopUpAmount('');
    
    // In real implementation, this would call API
    alert('Top-up feature coming soon! This will be connected to payment gateway.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your balance and transactions</p>
        </div>

        {/* Beta Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Wallet Feature Coming Soon</h3>
              <p className="text-sm text-blue-800">
                Virtual wallet, top-up, and transaction features are in development. Once the backend API is ready, you'll be able to fund your wallet and manage your balance here.
              </p>
            </div>
          </div>
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
                  title="Copy account number"
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
                    min="0"
                  />
                </div>
              </div>

              {/* Info Notice */}
              <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  This is a prototype. Real payment gateway integration coming soon.
                </p>
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
                  disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/member/subscriptions">
            <button className="w-full p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all text-left">
              <CreditCard className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Pay Subscription</h3>
              <p className="text-sm text-gray-600">Use wallet balance for subscriptions</p>
            </button>
          </Link>

          <button 
            onClick={() => setShowTopUp(true)}
            className="w-full p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all text-left"
          >
            <Plus className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Add Money</h3>
            <p className="text-sm text-gray-600">Top up your wallet balance</p>
          </button>

          <Link href="/member/payments">
            <button className="w-full p-6 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all text-left">
              <ArrowUpFromLine className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Payment History</h3>
              <p className="text-sm text-gray-600">View all your payments</p>
            </button>
          </Link>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Transactions</h3>

          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((txn) => (
                <div 
                  key={txn.id} 
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      txn.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {txn.type === 'credit' ? (
                        <ArrowDownToLine className="w-6 h-6 text-green-600" />
                      ) : (
                        <ArrowUpFromLine className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{txn.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className={`text-xl font-bold ${
                      txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
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
              <h3 className="font-semibold text-gray-900 mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-6">
                Your wallet transactions will appear here once you start using your wallet
              </p>
            </div>
          )}
        </div>

        {/* Features Info */}
        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="font-bold text-emerald-900 mb-3">Wallet Features (Coming Soon)</h3>
          <ul className="space-y-2 text-sm text-emerald-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Virtual account number for easy bank transfers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Instant top-up via debit card or bank transfer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Pay for subscriptions directly from wallet balance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Real-time transaction notifications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Transaction history and downloadable statements</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}