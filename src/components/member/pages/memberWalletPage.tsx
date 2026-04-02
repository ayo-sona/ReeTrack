'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, Check, CreditCard, Building, ArrowUpFromLine, AlertCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const C = {
  teal:     '#0D9488',
  snow:     '#F9FAFB',
  white:    '#FFFFFF',
  ink:      '#1F2937',
  coolGrey: '#9CA3AF',
  border:   '#E5E7EB',
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface MockWallet { balance: number; accountNumber: string; bankName: string; }
interface MockTransaction { id: string; type: 'credit' | 'debit'; amount: number; description: string; status: 'completed' | 'pending' | 'failed'; createdAt: string; }

function QuickActionCard({ icon, title, description, onClick }: any) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        width: '100%', padding: '24px', background: C.white, borderRadius: '12px',
        border: `1px solid ${hovered ? C.teal : C.border}`,
        boxShadow: hovered ? '0 8px 24px rgba(13,148,136,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
        textAlign: 'left', cursor: 'pointer',
        transition: 'border-color 300ms, box-shadow 300ms',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <div style={{
        width: '44px', height: '44px', borderRadius: '10px',
        background: hovered ? 'rgba(13,148,136,0.1)' : C.snow,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '12px', color: C.teal, transition: 'background 300ms',
      }}>
        {icon}
      </div>
      <p style={{ fontWeight: 700, fontSize: '15px', color: C.ink, marginBottom: '4px' }}>{title}</p>
      <p style={{ fontWeight: 400, fontSize: '13px', color: C.coolGrey, lineHeight: 1.5 }}>{description}</p>
    </motion.button>
  );
}

export default function WalletPage() {
  const [wallet] = useState<MockWallet>({ balance: 0, accountNumber: '0000000000', bankName: 'ReeTrack Wallet' });
  const [transactions] = useState<MockTransaction[]>([]);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpMethod, setTopUpMethod] = useState<'card' | 'transfer'>('transfer');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopUp = () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) return;
    setShowTopUp(false);
    setTopUpAmount('');
    alert('Top-up feature coming soon!');
  };

  return (
    <div style={{ minHeight: '100vh', background: C.snow, fontFamily: 'Nunito, sans-serif', padding: '32px 24px 96px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        input::placeholder { color: #9CA3AF; }
      `}</style>

      <div style={{ maxWidth: '880px', margin: '0 auto' }}>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontWeight: 800, fontSize: '32px', color: C.ink, letterSpacing: '-0.4px' }}>Wallet</h1>
          <p style={{ fontWeight: 400, fontSize: '15px', color: C.coolGrey, marginTop: '4px' }}>Manage your balance and transactions</p>
        </motion.div>

        {/* Beta notice */}
        {/* <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          style={{ display: 'flex', gap: '12px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '24px' }}
        >
          <AlertCircle size={18} style={{ color: C.teal, flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '14px', color: C.ink, marginBottom: '4px' }}>Wallet Feature Coming Soon</p>
            <p style={{ fontWeight: 400, fontSize: '13px', color: C.coolGrey, lineHeight: 1.6 }}>
              Virtual wallet, top-up, and transaction features are in development.
            </p>
          </div>
        </motion.div> */}

        {/* Balance card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} style={{ position: 'relative', background: C.teal, borderRadius: '16px', padding: '36px', marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '-6px', background: `linear-gradient(135deg, rgba(13,148,136,0.5), rgba(13,148,136,0.2))`, filter: 'blur(28px)', opacity: 0.7, zIndex: 0 }} />
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)', borderRadius: '16px' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Available Balance
                </p>
                <h2 style={{ fontWeight: 800, fontSize: '44px', color: C.white, letterSpacing: '-1px', lineHeight: 1 }}>
                  ₦{wallet.balance.toLocaleString()}
                </h2>
              </div>

              {/* Coral CTA with glow */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: '-4px', borderRadius: '12px',
                  background: `linear-gradient(to right, rgba(240,101,67,0.5), rgba(240,101,67,0.3), rgba(240,101,67,0.5))`,
                  filter: 'blur(14px)', opacity: 0.8, zIndex: 0,
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Button variant="default" onClick={() => setShowTopUp(true)}>
                    <Plus size={16} /> Top Up
                  </Button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '16px', backdropFilter: 'blur(8px)' }}>
                <p style={{ fontWeight: 600, fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account Number</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontWeight: 700, fontSize: '20px', color: C.white, letterSpacing: '1px' }}>{wallet.accountNumber}</p>
                  <button onClick={() => handleCopy(wallet.accountNumber)}
                    style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '6px', color: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '16px', backdropFilter: 'blur(8px)' }}>
                <p style={{ fontWeight: 600, fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bank Name</p>
                <p style={{ fontWeight: 700, fontSize: '20px', color: C.white }}>{wallet.bankName}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}
        >
          <Link href="/member/subscriptions" style={{ textDecoration: 'none' }}>
            <QuickActionCard icon={<CreditCard size={20} />} title="Pay Subscription" description="Use wallet balance for subscriptions" />
          </Link>
          <QuickActionCard icon={<Plus size={20} />} title="Add Money" description="Top up your wallet balance" onClick={() => setShowTopUp(true)} />
          <Link href="/member/payments" style={{ textDecoration: 'none' }}>
            <QuickActionCard icon={<ArrowUpFromLine size={20} />} title="Payment History" description="View all your payments" />
          </Link>
        </motion.div>

        {/* Transactions */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
          style={{ background: C.white, borderRadius: '16px', padding: '32px', border: `1px solid ${C.border}`, marginBottom: '24px' }}
        >
          <h3 style={{ fontWeight: 700, fontSize: '18px', color: C.teal, marginBottom: '24px' }}>Recent Transactions</h3>
          {transactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: C.snow, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Wallet size={28} style={{ color: C.coolGrey }} />
              </div>
              <p style={{ fontWeight: 700, fontSize: '16px', color: C.ink, marginBottom: '6px' }}>No transactions yet</p>
              <p style={{ fontWeight: 400, fontSize: '14px', color: C.coolGrey, maxWidth: '300px', margin: '0 auto', lineHeight: 1.6 }}>
                Your wallet transactions will appear here once you start using your wallet.
              </p>
            </div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
          style={{ background: C.white, borderRadius: '16px', padding: '28px 32px', border: `1px solid ${C.border}` }}
        >
          <h3 style={{ fontWeight: 700, fontSize: '16px', color: C.teal, marginBottom: '16px' }}>Wallet Features (Coming Soon)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              'Virtual account number for easy bank transfers',
              'Instant top-up via debit card or bank transfer',
              'Pay for subscriptions directly from wallet balance',
              'Real-time transaction notifications',
              'Transaction history and downloadable statements',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.teal, marginTop: '7px', flexShrink: 0 }} />
                <p style={{ fontWeight: 400, fontSize: '14px', color: C.ink, lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top-up modal */}
      <AnimatePresence>
        {showTopUp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(31,41,55,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 50 }}
            onClick={(e) => e.target === e.currentTarget && setShowTopUp(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: C.white, borderRadius: '16px', padding: '36px', maxWidth: '420px', width: '100%', boxShadow: '0 24px 48px rgba(0,0,0,0.15)' }}
            >
              <h3 style={{ fontWeight: 800, fontSize: '22px', color: C.ink, marginBottom: '8px' }}>Top Up Wallet</h3>
              <p style={{ fontWeight: 400, fontSize: '14px', color: C.coolGrey, marginBottom: '28px' }}>Choose a method and enter your amount.</p>

              {/* Method */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {(['transfer', 'card'] as const).map((method) => (
                  <button key={method} onClick={() => setTopUpMethod(method)} style={{
                    flex: 1, padding: '16px', borderRadius: '8px',
                    border: `2px solid ${topUpMethod === method ? C.teal : C.border}`,
                    background: topUpMethod === method ? 'rgba(13,148,136,0.06)' : C.white,
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    color: topUpMethod === method ? C.teal : C.coolGrey,
                    fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: '14px',
                    transition: 'all 300ms',
                  }}>
                    {method === 'transfer' ? <Building size={22} /> : <CreditCard size={22} />}
                    {method === 'transfer' ? 'Bank Transfer' : 'Debit Card'}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 600, fontSize: '14px', color: C.ink, display: 'block', marginBottom: '6px' }}>Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, fontSize: '15px', color: C.coolGrey }}>₦</span>
                  <input
                    type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)}
                    onFocus={() => setAmountFocused(true)} onBlur={() => setAmountFocused(false)}
                    placeholder="0.00" min="0"
                    style={{
                      width: '100%', paddingLeft: '32px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px',
                      borderRadius: '8px', border: `1px solid ${amountFocused ? C.teal : C.border}`,
                      boxShadow: amountFocused ? `0 0 0 3px rgba(13,148,136,0.12)` : 'none',
                      fontFamily: 'Nunito, sans-serif', fontWeight: 600, fontSize: '16px', color: C.ink,
                      background: C.white, outline: 'none', transition: 'border-color 300ms, box-shadow 300ms', minHeight: '48px',
                    }}
                  />
                </div>
              </div>

              {/* Notice */}
              <div style={{ display: 'flex', gap: '10px', background: C.snow, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '12px 14px', marginBottom: '28px' }}>
                <AlertCircle size={16} style={{ color: C.teal, flexShrink: 0, marginTop: '1px' }} />
                <p style={{ fontWeight: 400, fontSize: '13px', color: C.coolGrey, lineHeight: 1.5 }}>This is a prototype. Real payment gateway integration coming soon.</p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Button variant="outline" className="flex-1" onClick={() => setShowTopUp(false)}>
                  Cancel
                </Button>
                {/* Coral CTA with glow */}
                <div style={{ position: 'relative', flex: 1 }}>
                  <div style={{
                    position: 'absolute', inset: '-4px', borderRadius: '12px',
                    background: `linear-gradient(to right, rgba(240,101,67,0.4), rgba(240,101,67,0.2), rgba(240,101,67,0.4))`,
                    filter: 'blur(12px)',
                    opacity: !topUpAmount || parseFloat(topUpAmount) <= 0 ? 0.2 : 0.7,
                    transition: 'opacity 300ms', zIndex: 0,
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <Button
                      variant="default" className="w-full"
                      disabled={!topUpAmount || parseFloat(topUpAmount) <= 0}
                      onClick={handleTopUp}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}