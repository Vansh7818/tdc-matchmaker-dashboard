'use client';

import React, { useState } from 'react';
import { useMatchmaker } from '@/context/MatchmakerContext';
import { CustomerProfile, JourneyStatus } from '@/types/customer';
import { 
  Search, Filter, ShieldCheck, MapPin, Briefcase, GraduationCap, 
  Heart, Sparkles, MessageSquare, ArrowRight, LayoutGrid, Table as TableIcon,
  UserCheck, Calendar, IndianRupee
} from 'lucide-react';

const STATUS_COLORS: Record<JourneyStatus, { bg: string; text: string; dot: string }> = {
  'Onboarding': { bg: 'bg-amber-50', text: 'text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  'Verified': { bg: 'bg-blue-50', text: 'text-blue-800 border-blue-200', dot: 'bg-blue-500' },
  'Active Matching': { bg: 'bg-emerald-50', text: 'text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  'Introductions Sent': { bg: 'bg-purple-50', text: 'text-purple-800 border-purple-200', dot: 'bg-purple-500' },
  'First Date Scheduled': { bg: 'bg-rose-50', text: 'text-rose-800 border-rose-200', dot: 'bg-rose-500' },
  'Under Feedback': { bg: 'bg-indigo-50', text: 'text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' },
  'Courtship': { bg: 'bg-pink-50', text: 'text-pink-800 border-pink-200', dot: 'bg-pink-500' },
  'Matched': { bg: 'bg-emerald-100', text: 'text-emerald-900 border-emerald-300', dot: 'bg-emerald-600' },
  'On Hold': { bg: 'bg-slate-100', text: 'text-slate-700 border-slate-300', dot: 'bg-slate-400' },
};

export function CustomerListView() {
  const { customers, setSelectedCustomer } = useMatchmaker();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter logic
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.undergraduateCollege.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || c.statusTag === selectedStatus;
    const matchesGender = selectedGender === 'All' || c.gender === selectedGender;

    return matchesSearch && matchesStatus && matchesGender;
  });

  // Metrics
  const totalCount = customers.length;
  const activeMatchingCount = customers.filter(c => c.statusTag === 'Active Matching').length;
  const inPipelineCount = customers.filter(c => 
    ['Introductions Sent', 'First Date Scheduled', 'Under Feedback'].includes(c.statusTag)
  ).length;

  return (
    <div className="space-y-6">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Clients</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">High-touch portfolio</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-tdc-700 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active In Matching</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeMatchingCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Algorithm ready for pairings</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dates & Intros Active</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{inPipelineCount}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Active courtship cycle</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opposite Gender Pool</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">100+ Profiles</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Live vetted candidate database</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client name, city, company, or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tdc-600 focus:border-transparent text-slate-800"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-tdc-600"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male Clients</option>
            <option value="Female">Female Clients</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-tdc-600"
          >
            <option value="All">All Journey Stages</option>
            <option value="Active Matching">Active Matching</option>
            <option value="Verified">Verified</option>
            <option value="Introductions Sent">Introductions Sent</option>
            <option value="First Date Scheduled">First Date Scheduled</option>
            <option value="Under Feedback">Under Feedback</option>
            <option value="Onboarding">Onboarding</option>
            <option value="On Hold">On Hold</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Customer List Content */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <p className="text-slate-500 text-sm">No clients found matching the selected filters.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedStatus('All'); setSelectedGender('All'); }}
            className="mt-3 text-xs text-tdc-700 font-semibold hover:underline"
          >
            Reset search and filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((customer) => {
            const statusStyle = STATUS_COLORS[customer.statusTag] || STATUS_COLORS['Active Matching'];

            return (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-tdc-300 hover:shadow-lg hover:shadow-rose-950/5 transition-all duration-200 p-5 flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  
                  {/* Top Row: Avatar, Name, Age, Status */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={customer.photoUrl}
                          alt={`${customer.firstName} ${customer.lastName}`}
                          className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                        />
                        {customer.verifiedBadge && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-sm" title="Verified Biodata">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 group-hover:text-tdc-700 transition-colors">
                            {customer.firstName} {customer.lastName}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {customer.age} yrs • {customer.gender} • {customer.maritalStatus}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                      {customer.statusTag}
                    </span>
                  </div>

                  {/* Badges / Key Attributes */}
                  <div className="space-y-1.5 text-xs text-slate-600 my-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{customer.city}, {customer.country}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 truncate">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.designation} at <strong className="text-slate-800">{customer.currentCompany}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{customer.undergraduateCollege}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-emerald-700">{customer.incomeFormatted}</span>
                      <span className="text-slate-400">•</span>
                      <span>Height: {customer.heightFormatted.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Indian Matchmaking Tags */}
                  <div className="flex flex-wrap gap-1.5 my-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                      {customer.religion} ({customer.caste})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                      {customer.diet}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
                      Kids: {customer.wantKids}
                    </span>
                  </div>

                </div>

                {/* Footer: Quick Notes counter & Action CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-slate-400 text-xs">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{customer.notes.length} notes</span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-tdc-700 group-hover:translate-x-0.5 transition-transform">
                    Matchmaking View <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Age / Gender</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Profession & Income</th>
                  <th className="py-3 px-4">Marital Status</th>
                  <th className="py-3 px-4">Journey Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCustomers.map((customer) => {
                  const statusStyle = STATUS_COLORS[customer.statusTag] || STATUS_COLORS['Active Matching'];

                  return (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="hover:bg-rose-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <img
                          src={customer.photoUrl}
                          alt={customer.firstName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{customer.firstName} {customer.lastName}</p>
                          <p className="text-[11px] text-slate-500">{customer.religion} • {customer.diet}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{customer.age} yrs</span>
                        <p className="text-[11px] text-slate-500">{customer.gender}</p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{customer.city}</p>
                        <p className="text-[11px] text-slate-500">{customer.country}</p>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800 truncate max-w-[180px]">{customer.designation}</p>
                        <p className="text-[11px] font-semibold text-emerald-700">{customer.incomeFormatted}</p>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-700 font-medium">{customer.maritalStatus}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusStyle.bg} ${statusStyle.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                          {customer.statusTag}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCustomer(customer);
                          }}
                          className="text-xs font-bold text-tdc-700 hover:text-tdc-800 px-2.5 py-1.5 rounded-lg hover:bg-rose-100 transition-colors"
                        >
                          View & Match →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
