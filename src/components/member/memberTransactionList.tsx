'use client';

import { ArrowDownToLine, ArrowUpFromLine, Wallet } from 'lucide-react';
import { Transaction } from '@/types/memberTypes/member';

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  showEmpty?: boolean;
}

export default function TransactionList({ transactions, title = 'Recent Transactions', showEmpty = true }: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    if (!showEmpty) return null;
    
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {title && <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>}
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {title && <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>}

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
                  <ArrowDownToLine className={`w-6 h-6 text-green-600`} />
                ) : (
                  <ArrowUpFromLine className={`w-6 h-6 text-red-600`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{txn.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(txn.createdAt).toLocaleDateString()} • {new Date(txn.createdAt).toLocaleTimeString()}
                </p>
                {txn.reference && (
                  <p className="text-xs text-gray-400 mt-1">Ref: {txn.reference}</p>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className={`text-xl font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {txn.type === 'credit' ? '+' : '-'}₦{txn.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 capitalize">{txn.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}