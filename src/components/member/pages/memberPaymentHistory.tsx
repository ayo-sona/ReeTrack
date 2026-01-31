'use client';

import { useState } from 'react';
import { Download, Search, Check, X, Clock, CreditCard, Wallet as WalletIcon, Building } from 'lucide-react';
import { usePayments } from '@/hooks/memberHook/useMember';

export default function PaymentHistoryPage() {
  const { data: payments, isLoading } = usePayments();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | 'wallet' | 'card' | 'transfer'>('all');

  const filteredPayments = payments?.filter((payment) => {
    const matchesSearch = payment.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <Check className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'wallet': return <WalletIcon className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'transfer': return <Building className="w-4 h-4" />;
      default: return null;
    }
  };

  const handleDownloadReceipt = (paymentId: string) => {
    // TODO: Implement receipt download
    console.log('Downloading receipt for payment:', paymentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600 mt-1">View and download receipts for all your payments</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by organization, plan, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Status Filter */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'success', 'pending', 'failed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as 'all' | 'success' | 'pending' | 'failed')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Method Filter */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'wallet', 'card', 'transfer'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setMethodFilter(method as 'all' | 'wallet' | 'card' | 'transfer')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        methodFilter === method
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-white rounded-xl border border-gray-100"></div>
              </div>
            ))}
          </div>
        ) : filteredPayments && filteredPayments.length > 0 ? (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Payment Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {payment.organizationName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{payment.organizationName}</h3>
                        <p className="text-sm text-gray-600">{payment.planName}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                            {getMethodIcon(payment.paymentMethod)}
                            {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₦{payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400 mt-1">Ref: {payment.reference}</p>
                    </div>

                    {payment.status === 'success' && payment.receiptUrl && (
                      <button
                        onClick={() => handleDownloadReceipt(payment.id)}
                        className="p-3 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                        title="Download Receipt"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery || statusFilter !== 'all' || methodFilter !== 'all' 
                ? 'No payments found' 
                : 'No payment history yet'}
            </h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== 'all' || methodFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Your payment history will appear here'}
            </p>
          </div>
        )}

        {/* Summary Card */}
        {filteredPayments && filteredPayments.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{filteredPayments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{filteredPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Successful</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredPayments.filter(p => p.status === 'success').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}