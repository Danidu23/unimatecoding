import React, { useState } from 'react';
import { Package } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function MyReports() {
  const [activeTab, setActiveTab] = useState('lost');

  const tabs = [
    { id: 'lost', label: 'Lost Items' },
    { id: 'found', label: 'Found Items' },
    { id: 'claims', label: 'Claims' },
  ];

  const myLostItems = [
    { id: 101, name: 'Black Leather Wallet', date: 'Oct 20, 2023', status: 'Pending' },
    { id: 102, name: 'Calculus Textbook', date: 'Sep 15, 2023', status: 'Returned' },
  ];

  const myFoundItems = [
    { id: 201, name: 'Keys with Lanyard', date: 'Oct 22, 2023', status: 'Matched' },
  ];

  const myClaims = [
    { id: 301, name: 'Apple AirPods Pro', date: 'Oct 25, 2023', status: 'Approved' },
    { id: 302, name: 'Blue Hydroflask', date: 'Oct 18, 2023', status: 'Rejected' },
  ];

  const renderContent = () => {
    let list = [];
    if (activeTab === 'lost') list = myLostItems;
    if (activeTab === 'found') list = myFoundItems;
    if (activeTab === 'claims') list = myClaims;

    if (list.length === 0) {
      return (
        <Card className="p-12 text-center flex flex-col items-center justify-center bg-[#162032] mt-6">
          <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center mb-4">
            <Package className="text-slate-500 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No records found</h3>
          <p className="text-slate-400 max-w-sm">You haven't submitted any {activeTab} yet.</p>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {list.map(item => (
          <Card key={item.id} hover className="flex items-center p-5 bg-[#162032]">
            <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center shrink-0 border border-white/5 mr-4">
              <Package size={20} className="text-gold" />
            </div>
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="font-semibold text-white truncate">{item.name}</h4>
              <p className="text-xs text-slate-400 mt-1">{item.date}</p>
            </div>
            <div>
              <Badge status={item.status}>{item.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-8 min-h-[70vh] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Reports</h1>
        <p className="text-slate-400">Track the status of your lost items, found reports, and claims.</p>
      </div>

      <div className="border-b border-white/10 flex gap-6 overflow-x-auto select-none no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-sm font-medium transition-colors whitespace-nowrap relative ${
              activeTab === tab.id ? 'text-gold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold rounded-t-full"></span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {renderContent()}
      </div>

      <div className="pt-10 flex justify-center mt-auto">
        <a href="/" className="text-slate-500 hover:text-gold transition-colors text-sm">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
