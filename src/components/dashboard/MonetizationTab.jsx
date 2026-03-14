import React, { useState, useEffect } from 'react'
import { CiBank } from "react-icons/ci";
import { FaMoneyBillWave, FaEdit, FaTrash, FaArrowUp} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MonetizationTab = () => {

// Monetization States
// Initialize state from localStorage
const [paymentMethods, setPaymentMethods] = useState(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('lumeblog_payment_methods');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
});

const isDarkMode = true;
const [isFormOpen, setIsFormOpen] = useState(false);
const [editingId, setEditingId] = useState(null);
const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '' });

// Every time paymentMethods changes, save the new list to localStorage
useEffect(() => {
  localStorage.setItem('lumeblog_payment_methods', JSON.stringify(paymentMethods));
}, [paymentMethods]);

const handleSavePayment = (e) => {
  e.preventDefault();
  
  if (editingId) {
    // Update existing method
    setPaymentMethods(methods => methods.map(m => 
      m.id === editingId 
        ? { ...m, bankName: bankForm.bankName, accountNumber: bankForm.accountNumber, last4: bankForm.accountNumber.slice(-4) || '0000' }
        : m
    ));
  } else {
    // Add new method
    if (paymentMethods.length >= 3) return;
    setPaymentMethods([...paymentMethods, {
      id: Date.now(),
      type: 'Bank Transfer',
      bankName: bankForm.bankName,
      accountNumber: bankForm.accountNumber,
      last4: bankForm.accountNumber.slice(-4) || '0000',
      status: paymentMethods.length === 0 ? 'Active' : 'Pending' // First one is active, others pending like screenshot
    }]);
  }
  
  // Reset form
  setIsFormOpen(false);
  setEditingId(null);
  setBankForm({ bankName: '', accountNumber: '' });
};

const handleEditClick = (method) => {
  setBankForm({ bankName: method.bankName, accountNumber: method.accountNumber || '' });
  setEditingId(method.id);
  setIsFormOpen(true);
};

const handleDeleteClick = (id) => {
  setPaymentMethods(methods => methods.filter(m => m.id !== id));
};

const handleCancelForm = () => {
  setIsFormOpen(false);
  setEditingId(null);
  setBankForm({ bankName: '', accountNumber: '' });
};
// Mock Data for the UI
const monetizationMetrics = [
  { 
    title: 'TOTAL EARNED',
    value: '$1,284',
    valueColor: 'text-green-500',
    detail: '+18% vs last month',
    detailColor: 'text-[#22c55e]'
  },
  { 
    title: 'PENDING',
    value: '$342',
    valueColor: 'text-yellow-400',
    detail: 'Clears in ~3 days',
    detailColor: 'text-gray-400'
  },
  { 
    title: 'THIS MONTH',
    value: '$487',
    valueColor: 'text-white',
    detail: '+5% vs Feb',
    detailColor: 'text-[#22c55e]'
  },
  { 
    title: 'SUBSCRIBERS',
    value: '124',
    valueColor: 'text-white',
    detail: '+12 new this week',
    detailColor: 'text-[#22c55e]'
  }
];

const transactions = [
  { date: 'Feb 18, 2025', desc: 'Subscription — @johndoe', type: 'Credit', amount: '+$9.99', status: 'Completed' },
  { date: 'Feb 15, 2025', desc: 'Tip — @sarah_k', type: 'Credit', amount: '+$25.00', status: 'Completed' },
  { date: 'Feb 12, 2025', desc: 'Ad Revenue — February', type: 'Credit', amount: '+$142.50', status: 'Pending' },
  { date: 'Feb 10, 2025', desc: 'Withdrawal to GTBank', type: 'Debit', amount: '-$200.00', status: 'Completed' },
  { date: 'Feb 05, 2025', desc: 'Subscription — @mark_b', type: 'Credit', amount: '+$9.99', status: 'Completed' }
];
// --- Mock Data for the Chart ---
const revenueData = [
  { month: 'Sep', revenue: 120 },
  { month: 'Oct', revenue: 210 },
  { month: 'Nov', revenue: 180 },
  { month: 'Dec', revenue: 320 },
  { month: 'Jan', revenue: 250 },
  { month: 'Feb', revenue: 487 }
];

 return (
  <>
    {/* Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {monetizationMetrics.map((metric, i) => (
        <div key={i} className="bg-white dark:bg-[#13171F] p-6 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-green-300 dark:hover:border-green-100 shadow-lg transition-colors">
          <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
            {metric.title}
          </h3>
          <div className={`text-3xl font-bold mb-2 text-gray-900 dark:text-white ${metric.valueColor}`}>
            {metric.value}
          </div>
          <div className={`text-xs font-medium ${metric.detailColor} flex items-center gap-1`}>
            {metric.detailColor === 'text-[#22c55e]' && <span><FaArrowUp /></span>}
            {metric.detail}
          </div>
        </div>
      ))}
    </div>

    {/* Middle Section: Chart & Payout Methods */}
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      
      {/* Chart Area - 3/5 width */}
      <div className="lg:col-span-2 bg-white dark:bg-[#13171F] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-lg flex flex-col min-h-[300px] transition-colors">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Monthly Revenue</h3>
        <div className="flex-1 border-b border-gray-200 dark:border-gray-800/50 mb-4 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#ffffff10" : "#e5e7eb"} vertical={false} />
              
              <XAxis 
                dataKey="month" 
                stroke={isDarkMode ? "#6b7280" : "#9ca3af"} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              
              <YAxis 
                stroke={isDarkMode ? "#6b7280" : "#9ca3af"} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `$${value}`}
                dx={-10}
              />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDarkMode ? '#0B0F15' : '#ffffff', 
                  border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: isDarkMode ? '#fff' : '#111827'
                }}
                itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                formatter={(value) => [`$${value}`, 'Revenue']}
              />
              
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#22c55e" 
                strokeWidth={3} 
                dot={{ r: 4, fill: isDarkMode ? '#13171F' : '#ffffff', stroke: '#22c55e', strokeWidth: 2 }} 
                activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout Methods Area - 2/5 width */}
      <div className="lg:col-span-3 bg-white dark:bg-[#13171F] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-lg flex flex-col transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payout Methods</h3>
          <span className="text-xs text-gray-500 font-medium">
            {paymentMethods.length}/3 Added
          </span>
        </div>
        
        <div className="flex-1 space-y-4">
          
          {/* Empty State Instructions */}
          {paymentMethods.length === 0 && !isFormOpen && (
            <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-300 dark:border-gray-800 border-dashed">
              Add any payment method of your choice using the button below. <br/>
              <span className="text-yellow-600 dark:text-yellow-500 mt-2 block text-xs">Note: You can only add up to 3 payment methods!</span>
            </div>
          )}

          {/* List of Saved Payment Methods */}
          {!isFormOpen && paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl group hover:border-green-500 dark:hover:border-green-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-gray-200 dark:bg-black p-3 rounded-2xl text-green-600 dark:text-green-500">
                  <CiBank size={18} />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white text-sm font-medium">{method.type}</h4>
                  <p className="text-xs text-gray-500">•••• {method.last4} · {method.bankName}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${
                  method.status === 'Active' ? 'bg-[#1A8749]/10 text-[#22c55e]' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                }`}>
                  {method.status}
                </span>
                
                {/* Edit/Delete Actions */}
                <div className="flex gap-3">
                  <button onClick={() => handleEditClick(method)} className="text-gray-400 hover:text-[#22c55e] transition-colors">
                    <FaEdit size={12} />
                  </button>
                  <button onClick={() => handleDeleteClick(method.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add / Edit Form */}
          {isFormOpen && (
            <form onSubmit={handleSavePayment} className="p-5 bg-gray-50 dark:bg-white/[0.02] border border-[#22c55e]/30 rounded-xl space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Bank Name</label>
                <input 
                  required
                  type="text" 
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                  className="w-full bg-white dark:bg-[#0B0F15] text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-gray-800 focus:border-[#22c55e] dark:focus:border-[#22c55e] focus:outline-none text-sm transition-colors"
                  placeholder="e.g. GTBank"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Account Number</label>
                <input 
                  required
                  type="text" 
                  maxLength="12"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                  className="w-full bg-white dark:bg-[#0B0F15] text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-gray-800 focus:border-[#22c55e] dark:focus:border-[#22c55e] focus:outline-none text-sm transition-colors"
                  placeholder="0000000000"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCancelForm} className="flex-1 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-200 dark:bg-white/5 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-[#1A8749] text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors">
                  {editingId ? 'Update Details' : 'Save Details'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Add Button */}
        {!isFormOpen && paymentMethods.length < 3 && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="mt-4 w-full py-4 border border-green-600 border-dashed rounded-xl text-sm font-semibold text-green-600 hover:text-green-700 dark:hover:text-white hover:border-green-700 dark:hover:border-green-800 hover:bg-green-50 dark:hover:bg-white/[0.02] transition-all"
          >
            + Add Payout Method
          </button>
        )}
      </div>
    </div>

    {/* Bottom Section: Transaction History */}
    <div className="bg-white dark:bg-[#13171F] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-lg transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</h3>
        <button className="flex items-center gap-2 bg-[#1A8749] text-white px-5 py-2.5 rounded-lg hover:bg-green-600 transition-all text-sm font-bold shadow-lg shadow-green-900/20">
          <FaMoneyBillWave size={16} /> Withdraw
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800">
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Date</th>
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Description</th>
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Type</th>
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Amount</th>
              <th className="pb-4 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="py-4 text-sm text-gray-600 dark:text-gray-400">{tx.date}</td>
                <td className="py-4 text-sm text-gray-900 dark:text-white font-medium">{tx.desc}</td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                    tx.type === 'Credit' ? 'text-[#22c55e] bg-[#1A8749]/10' : 'text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-500/10'
                  }`}>
                    {tx.type}
                  </span>
                </td>
                <td className={`py-4 text-sm font-bold ${
                  tx.amount.startsWith('+') ? 'text-[#22c55e]' : 'text-red-600 dark:text-red-500'
                }`}>
                  {tx.amount}
                </td>
                <td className="py-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                    tx.status === 'Completed' ? 'border-[#22c55e]/30 text-[#22c55e]' : 'border-yellow-500/30 text-yellow-600 dark:text-yellow-500'
                  }`}>
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);
}

export default MonetizationTab