'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerProfile, JourneyStatus, MatchmakerNote, SentMatchRecord } from '@/types/customer';
import { ASSIGNED_CUSTOMERS, CANDIDATE_POOL } from '@/data/dummyProfiles';

export interface MatchmakerUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface MatchmakerContextType {
  user: MatchmakerUser | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  customers: CustomerProfile[];
  candidatePool: CustomerProfile[];
  selectedCustomer: CustomerProfile | null;
  setSelectedCustomer: (customer: CustomerProfile | null) => void;
  updateCustomerJourneyStatus: (customerId: string, status: JourneyStatus) => void;
  addCustomerNote: (customerId: string, text: string, category?: MatchmakerNote['category']) => void;
  recordSentMatch: (customerId: string, matchRecord: SentMatchRecord) => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  resetAllData: () => void;
}

const MatchmakerContext = createContext<MatchmakerContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'tdc_matchmaker_user';
const LOCAL_STORAGE_CUSTOMERS_KEY = 'tdc_matchmaker_customers';
const LOCAL_STORAGE_API_KEY = 'tdc_matchmaker_api_key';

export function MatchmakerProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MatchmakerUser | null>(null);
  const [customers, setCustomers] = useState<CustomerProfile[]>(ASSIGNED_CUSTOMERS);
  const [candidatePool] = useState<CustomerProfile[]>(CANDIDATE_POOL);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customApiKey, setCustomApiKeyState] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Pre-fill demo user for fast instant preview
        const defaultUser: MatchmakerUser = {
          name: 'Priya Sharma',
          email: 'priya@thedatecrew.com',
          role: 'Lead Matchmaker & Relationship Director',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        };
        setUser(defaultUser);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(defaultUser));
      }

      const savedCustomers = localStorage.getItem(LOCAL_STORAGE_CUSTOMERS_KEY);
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }

      const savedApiKey = localStorage.getItem(LOCAL_STORAGE_API_KEY);
      if (savedApiKey) {
        setCustomApiKeyState(savedApiKey);
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save customers to LocalStorage whenever updated
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_CUSTOMERS_KEY, JSON.stringify(customers));
      } catch (e) {
        console.error('Failed to save customers to local storage:', e);
      }
    }
  }, [customers, isLoaded]);

  const login = (username: string, pass: string): boolean => {
    const trimmedUser = username.trim().toLowerCase();
    
    // Sample credential matches or allow general login
    let loggedInUser: MatchmakerUser;
    if (trimmedUser.includes('priya') || trimmedUser === 'matchmaker@thedatecrew.com') {
      loggedInUser = {
        name: 'Priya Sharma',
        email: 'priya@thedatecrew.com',
        role: 'Lead Matchmaker & Relationship Director',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      };
    } else if (trimmedUser.includes('admin')) {
      loggedInUser = {
        name: 'Aditya Oberoi',
        email: 'aditya@thedatecrew.com',
        role: 'VP Matchmaking Operations',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      };
    } else {
      loggedInUser = {
        name: username.split('@')[0] || 'TDC Matchmaker',
        email: username.includes('@') ? username : `${username}@thedatecrew.com`,
        role: 'Certified Matchmaker',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
    }

    setUser(loggedInUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(loggedInUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    setSelectedCustomerId(null);
  };

  const setCustomApiKey = (key: string) => {
    setCustomApiKeyState(key);
    localStorage.setItem(LOCAL_STORAGE_API_KEY, key);
  };

  const updateCustomerJourneyStatus = (customerId: string, newStatus: JourneyStatus) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          const autoNote: MatchmakerNote = {
            id: `note-${Date.now()}`,
            author: user?.name || 'Matchmaker',
            text: `Status transitioned from "${c.statusTag}" to "${newStatus}".`,
            timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
            category: 'General',
          };
          return {
            ...c,
            statusTag: newStatus,
            notes: [autoNote, ...c.notes],
          };
        }
        return c;
      })
    );
  };

  const addCustomerNote = (
    customerId: string,
    text: string,
    category: MatchmakerNote['category'] = 'Call'
  ) => {
    const newNote: MatchmakerNote = {
      id: `note-${Date.now()}`,
      author: user?.name || 'Matchmaker',
      text,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      category,
    };

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          return {
            ...c,
            notes: [newNote, ...c.notes],
          };
        }
        return c;
      })
    );
  };

  const recordSentMatch = (customerId: string, matchRecord: SentMatchRecord) => {
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === customerId) {
          const autoNote: MatchmakerNote = {
            id: `note-${Date.now()}`,
            author: user?.name || 'Matchmaker',
            text: `Dispatched formal introduction email for ${matchRecord.matchName}.`,
            timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
            category: 'Meeting',
          };
          return {
            ...c,
            statusTag: c.statusTag === 'Active Matching' ? 'Introductions Sent' : c.statusTag,
            sentMatches: [matchRecord, ...c.sentMatches],
            notes: [autoNote, ...c.notes],
          };
        }
        return c;
      })
    );
  };

  const resetAllData = () => {
    setCustomers(ASSIGNED_CUSTOMERS);
    localStorage.removeItem(LOCAL_STORAGE_CUSTOMERS_KEY);
    setSelectedCustomerId(null);
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || null;

  const setSelectedCustomer = (customer: CustomerProfile | null) => {
    setSelectedCustomerId(customer ? customer.id : null);
  };

  return (
    <MatchmakerContext.Provider
      value={{
        user,
        login,
        logout,
        customers,
        candidatePool,
        selectedCustomer,
        setSelectedCustomer,
        updateCustomerJourneyStatus,
        addCustomerNote,
        recordSentMatch,
        customApiKey,
        setCustomApiKey,
        resetAllData,
      }}
    >
      {children}
    </MatchmakerContext.Provider>
  );
}

export function useMatchmaker() {
  const context = useContext(MatchmakerContext);
  if (!context) {
    throw new Error('useMatchmaker must be used within a MatchmakerProvider');
  }
  return context;
}
