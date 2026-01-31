'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { CAMPAIGNS, CampaignId } from '@/config/campaigns';
import Papa from 'papaparse';

// Types
interface Guest {
  id: number;
  name?: string;
  is_attending: boolean;
}

interface CampaignLog {
  campaign_id: string;
  channel: string;
  status: string;
}

interface Party {
  id: number;
  party_name: string;
  status: string;
  email?: string;
  phone?: string;
  admin_notes?: string;
  updated_at?: string;
  guests: Guest[];
  campaign_logs: CampaignLog[];
}

interface DashboardStats {
  totalParties: number;
  totalGuests: number;
  confirmedAttending: number;
  campaignSentCount: number;
}

// Extended guest type for editing (includes optional id for new guests)
interface EditableGuest {
  id?: number;
  name: string;
}

interface CsvRow {
  'Party Name': string;
  'Email'?: string;
  'Phone'?: string;
  'Guest Name': string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Wedding Date: September 4, 2026 at 12:00 PM
const WEDDING_DATE = new Date('2026-09-04T12:00:00');

function useCountdown(targetDate: Date): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

// Helper: Check if phone is US-based (+1)
function isUSPhone(phone: string | undefined): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, '');
  return cleaned.startsWith('+1') || (cleaned.startsWith('1') && cleaned.length === 11);
}

export default function AdminDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const countdown = useCountdown(WEDDING_DATE);

  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignId>('save-the-date');
  const [stats, setStats] = useState<DashboardStats>({
    totalParties: 0,
    totalGuests: 0,
    confirmedAttending: 0,
    campaignSentCount: 0,
  });

  // Modal State (Add/Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [partyName, setPartyName] = useState('');
  const [partyEmail, setPartyEmail] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [guests, setGuests] = useState<EditableGuest[]>([{ name: '' }]);
  const [saving, setSaving] = useState(false);

  // CSV Upload State
  const [uploading, setUploading] = useState(false);

  const fetchParties = async () => {
    const { data, error } = await supabase
      .from('parties')
      .select(`
        *,
        guests (id, name, is_attending),
        campaign_logs (campaign_id, channel, status)
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    if (data) {
      const allParties = data as Party[];
      let guestCount = 0;
      let attendingCount = 0;
      let sentCount = 0;

      allParties.forEach(party => {
        if (party.guests) {
          guestCount += party.guests.length;
          attendingCount += party.guests.filter(g => g.is_attending).length;
        }

        const isSent = party.campaign_logs?.some(
          l => l.campaign_id === selectedCampaign && l.status === 'sent'
        );
        if (isSent) sentCount++;
      });

      setStats({
        totalParties: allParties.length,
        totalGuests: guestCount,
        confirmedAttending: attendingCount,
        campaignSentCount: sentCount,
      });

      setParties(allParties);
    }
  };

  useEffect(() => {
    if (!loading) fetchParties();
  }, [selectedCampaign]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push('/admin/login');
        return;
      }
      await fetchParties();
      setLoading(false);
    };

    checkAuthAndFetch();
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const handleSendNotification = async (partyId: number) => {
    const party = parties.find(p => p.id === partyId);
    const campaignLabel = CAMPAIGNS.find(c => c.id === selectedCampaign)?.label || selectedCampaign;
    const confirmed = window.confirm(
      `Send "${campaignLabel}" to ${party?.party_name || 'this party'}?`
    );
    if (!confirmed) return;

    setSendingId(partyId);
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partyId, campaignId: selectedCampaign }),
      });

      const result = await res.json();

      if (res.ok) {
        await fetchParties();
      } else {
        alert(`Failed: ${result.error}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error sending notification');
    } finally {
      setSendingId(null);
    }
  };

  // ============================================
  // DELETE PARTY
  // ============================================
  const handleDeleteParty = async (party: Party) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${party.party_name}" and all ${party.guests.length} guest(s)? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(party.id);

    try {
      // First delete campaign_logs for this party
      await supabase.from('campaign_logs').delete().eq('party_id', party.id);

      // Then delete guests
      const { error: guestsError } = await supabase
        .from('guests')
        .delete()
        .eq('party_id', party.id);

      if (guestsError) throw guestsError;

      // Finally delete the party
      const { error: partyError } = await supabase
        .from('parties')
        .delete()
        .eq('id', party.id);

      if (partyError) throw partyError;

      await fetchParties();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete party');
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================
  // OPEN MODAL (Add or Edit)
  // ============================================
  const openAddModal = () => {
    setEditingParty(null);
    setPartyName('');
    setPartyEmail('');
    setPartyPhone('');
    setGuests([{ name: '' }]);
    setShowModal(true);
  };

  const openEditModal = (party: Party) => {
    setEditingParty(party);
    setPartyName(party.party_name);
    setPartyEmail(party.email || '');
    setPartyPhone(party.phone || '');
    setGuests(
      party.guests.length > 0
        ? party.guests.map(g => ({ id: g.id, name: g.name || '' }))
        : [{ name: '' }]
    );
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingParty(null);
    setPartyName('');
    setPartyEmail('');
    setPartyPhone('');
    setGuests([{ name: '' }]);
  };

  // ============================================
  // GUEST HANDLERS
  // ============================================
  const handleAddGuest = () => {
    setGuests([...guests, { name: '' }]);
  };

  const handleRemoveGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const handleGuestNameChange = (index: number, value: string) => {
    const updated = [...guests];
    updated[index].name = value;
    setGuests(updated);
  };

  // ============================================
  // SAVE PARTY (Create or Update)
  // ============================================
  const handleSaveParty = async () => {
    if (!partyName.trim()) {
      alert('Party name is required');
      return;
    }

    const validGuests = guests.filter(g => g.name.trim());
    if (validGuests.length === 0) {
      alert('At least one guest name is required');
      return;
    }

    setSaving(true);

    try {
      if (editingParty) {
        // ========== UPDATE MODE ==========
        const oldEmail = editingParty.email?.trim() || '';
        const oldPhone = editingParty.phone?.trim() || '';
        const newEmail = partyEmail.trim();
        const newPhone = partyPhone.trim();
        const emailChanged = newEmail && newEmail !== oldEmail;
        const phoneChanged = newPhone && newPhone !== oldPhone;

        // Collect campaigns that were previously sent on changed channels
        // so we can re-send to the updated contact info after saving.
        const campaignsToResend = new Set<string>();

        if (emailChanged) {
          const sentEmailLogs = editingParty.campaign_logs?.filter(
            l => l.channel === 'email' && l.status === 'sent'
          ) || [];
          sentEmailLogs.forEach(l => campaignsToResend.add(l.campaign_id));

          // Clear stale email logs so status resets to "Not Sent"
          await supabase
            .from('campaign_logs')
            .delete()
            .eq('party_id', editingParty.id)
            .eq('channel', 'email');
        }

        if (phoneChanged) {
          const sentSmsLogs = editingParty.campaign_logs?.filter(
            l => l.channel === 'sms' && l.status === 'sent'
          ) || [];
          sentSmsLogs.forEach(l => campaignsToResend.add(l.campaign_id));

          // Clear stale SMS logs so status resets to "Not Sent"
          await supabase
            .from('campaign_logs')
            .delete()
            .eq('party_id', editingParty.id)
            .eq('channel', 'sms');
        }

        // Update party info
        const { error: partyError } = await supabase
          .from('parties')
          .update({
            party_name: partyName.trim(),
            email: newEmail || null,
            phone: newPhone || null,
          })
          .eq('id', editingParty.id);

        if (partyError) throw partyError;

        // Handle guests: Update existing, insert new, delete removed
        const existingGuestIds = editingParty.guests.map(g => g.id);
        const currentGuestIds = validGuests.filter(g => g.id).map(g => g.id!);

        // Delete removed guests
        const guestsToDelete = existingGuestIds.filter(id => !currentGuestIds.includes(id));
        if (guestsToDelete.length > 0) {
          await supabase.from('guests').delete().in('id', guestsToDelete);
        }

        // Update existing guests
        for (const guest of validGuests.filter(g => g.id)) {
          await supabase
            .from('guests')
            .update({ name: guest.name.trim() })
            .eq('id', guest.id!);
        }

        // Insert new guests
        const newGuests = validGuests.filter(g => !g.id);
        if (newGuests.length > 0) {
          await supabase.from('guests').insert(
            newGuests.map(g => ({
              party_id: editingParty.id,
              name: g.name.trim(),
              is_attending: false,
            }))
          );
        }

        // Re-send notifications for campaigns that were previously delivered
        // to the old contact info, now targeting the updated email/phone.
        if (campaignsToResend.size > 0) {
          const resendResults: string[] = [];
          for (const campaignId of Array.from(campaignsToResend)) {
            try {
              const res = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ partyId: editingParty.id, campaignId }),
              });
              const result = await res.json();
              if (res.ok) {
                const label = CAMPAIGNS.find(c => c.id === campaignId)?.label || campaignId;
                resendResults.push(`${label}: sent`);
              } else {
                resendResults.push(`${campaignId}: ${result.error || 'failed'}`);
              }
            } catch {
              resendResults.push(`${campaignId}: network error`);
            }
          }
          alert(`Contact info updated. Re-sent ${campaignsToResend.size} campaign(s):\n${resendResults.join('\n')}`);
        }
      } else {
        // ========== CREATE MODE ==========
        const { data: partyData, error: partyError } = await supabase
          .from('parties')
          .insert({
            party_name: partyName.trim(),
            email: partyEmail.trim() || null,
            phone: partyPhone.trim() || null,
            status: 'pending',
          })
          .select('id')
          .single();

        if (partyError || !partyData) {
          throw new Error(partyError?.message || 'Failed to create party');
        }

        const guestInserts = validGuests.map(g => ({
          party_id: partyData.id,
          name: g.name.trim(),
          is_attending: false,
        }));

        const { error: guestsError } = await supabase.from('guests').insert(guestInserts);
        if (guestsError) throw guestsError;
      }

      closeModal();
      await fetchParties();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to save party');
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // CSV UPLOAD
  // ============================================
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data;
          if (rows.length === 0) {
            alert('CSV is empty');
            return;
          }

          const partyMap = new Map<string, { email?: string; phone?: string; guests: string[] }>();

          rows.forEach(row => {
            const keys = Object.keys(row);
            const nameKey = keys.find(k => k.toLowerCase().includes('party')) || 'Party Name';
            const emailKey = keys.find(k => k.toLowerCase().includes('email')) || 'Email';
            const phoneKey = keys.find(k => k.toLowerCase().includes('phone')) || 'Phone';
            const guestKey = keys.find(k => k.toLowerCase().includes('guest')) || 'Guest Name';

            const rowData = row as unknown as Record<string, string>;
            const csvPartyName = rowData[nameKey]?.trim();
            const guestName = rowData[guestKey]?.trim();
            const rawEmail = rowData[emailKey]?.trim();
            const rawPhone = rowData[phoneKey]?.trim();

            if (!csvPartyName || !guestName) return;

            if (!partyMap.has(csvPartyName)) {
              partyMap.set(csvPartyName, {
                email: undefined,
                phone: undefined,
                guests: [],
              });
            }

            const entry = partyMap.get(csvPartyName)!;
            if (rawEmail && !entry.email) entry.email = rawEmail;
            if (rawPhone && !entry.phone) entry.phone = rawPhone;
            entry.guests.push(guestName);
          });

          let insertedParties = 0;
          let insertedGuests = 0;

          for (const [csvPartyName, partyInfo] of Array.from(partyMap.entries())) {
            const { data: partyData, error: partyError } = await supabase
              .from('parties')
              .insert({
                party_name: csvPartyName,
                email: partyInfo.email || null,
                phone: partyInfo.phone || null,
                status: 'pending',
              })
              .select('id')
              .single();

            if (partyError || !partyData) {
              console.error(`Failed to insert party ${csvPartyName}:`, partyError);
              continue;
            }

            insertedParties++;

            const guestInserts = partyInfo.guests.map(name => ({
              party_id: partyData.id,
              name,
              is_attending: false,
            }));

            const { error: guestsError } = await supabase.from('guests').insert(guestInserts);

            if (guestsError) {
              console.error(`Failed to insert guests for ${csvPartyName}:`, guestsError);
            } else {
              insertedGuests += guestInserts.length;
            }
          }

          alert(`Imported ${insertedParties} parties with ${insertedGuests} guests`);
          await fetchParties();
        } catch (err) {
          console.error('CSV processing error:', err);
          alert('Failed to process CSV');
        } finally {
          setUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      error: (err) => {
        console.error('CSV parse error:', err);
        alert('Failed to parse CSV');
        setUploading(false);
      },
    });
  };

  // Helper: Check campaign status per channel
  const getChannelStatus = (party: Party, channel: 'email' | 'sms') => {
    return party.campaign_logs?.some(
      l => l.campaign_id === selectedCampaign && l.channel === channel && l.status === 'sent'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <p className="font-serif text-[#1B3B28] animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  const currentCampaignLabel = CAMPAIGNS.find(c => c.id === selectedCampaign)?.label;

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1B3B28] p-6 md:p-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-[#D4A845] mb-2">Campaign Manager</h1>
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Current Focus: <span className="font-bold text-[#1B3B28]">{currentCampaignLabel}</span>
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-1 text-center">
            <div className="px-3 py-2">
              <p className="font-serif text-2xl md:text-3xl text-[#1B3B28]">{countdown.days}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Days</p>
            </div>
            <span className="font-serif text-xl text-[#D4A845]">:</span>
            <div className="px-3 py-2">
              <p className="font-serif text-2xl md:text-3xl text-[#1B3B28]">{String(countdown.hours).padStart(2, '0')}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Hrs</p>
            </div>
            <span className="font-serif text-xl text-[#D4A845]">:</span>
            <div className="px-3 py-2">
              <p className="font-serif text-2xl md:text-3xl text-[#1B3B28]">{String(countdown.minutes).padStart(2, '0')}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Min</p>
            </div>
            <span className="font-serif text-xl text-[#D4A845]">:</span>
            <div className="px-3 py-2">
              <p className="font-serif text-2xl md:text-3xl text-[#1B3B28]">{String(countdown.seconds).padStart(2, '0')}</p>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">Sec</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value as CampaignId)}
            className="px-4 py-2 border border-[#D4A845] rounded bg-white text-[#1B3B28] text-sm focus:outline-none"
          >
            {CAMPAIGNS.map(c => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-[#1B3B28]/20 rounded hover:bg-[#1B3B28] hover:text-white transition-colors text-sm uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded shadow-sm border-t-4 border-[#D4A845]">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Parties</p>
            <p className="font-serif text-3xl md:text-4xl">{stats.totalParties}</p>
          </div>
          <div className="bg-white p-6 rounded shadow-sm border-t-4 border-[#1B3B28]">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Guests</p>
            <p className="font-serif text-3xl md:text-4xl">{stats.totalGuests}</p>
          </div>
          <div className="bg-white p-6 rounded shadow-sm border-t-4 border-green-600">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Attending</p>
            <p className="font-serif text-3xl md:text-4xl">{stats.confirmedAttending}</p>
          </div>
          <div className="bg-white p-6 rounded shadow-sm border-t-4 border-blue-500">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
              {currentCampaignLabel} Sent
            </p>
            <p className="font-serif text-3xl md:text-4xl">
              {stats.campaignSentCount} <span className="text-base text-gray-400">/ {stats.totalParties}</span>
            </p>
          </div>
        </div>

        {/* Guest Management Toolbar */}
        <div className="bg-white rounded shadow-sm p-4 mb-4 flex flex-wrap items-center gap-4 border border-gray-100">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Guest Management:</span>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#1B3B28] text-white text-sm font-bold rounded hover:bg-[#2a5a3f] transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Add Party
          </button>

          <label className="px-4 py-2 border border-[#D4A845] text-[#D4A845] text-sm font-bold rounded hover:bg-[#D4A845] hover:text-white transition-colors cursor-pointer flex items-center gap-2">
            {uploading ? 'Uploading...' : 'Upload CSV'}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          <span className="text-xs text-gray-400">
            CSV format: Party Name, Email, Phone, Guest Name
          </span>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#1B3B28] text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-medium">Party Name</th>
                  <th className="p-4 font-medium">Guests</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {parties.map((party) => {
                  const emailSent = getChannelStatus(party, 'email');
                  const smsSent = getChannelStatus(party, 'sms');
                  const hasEmail = !!party.email;
                  const hasPhone = !!party.phone;
                  const hasUSPhone = isUSPhone(party.phone);
                  const hasAnyContact = hasEmail || hasPhone;
                  const allSent = (hasEmail ? emailSent : true) && (hasUSPhone ? smsSent : true) && hasAnyContact;

                  return (
                    <tr key={party.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-[#1B3B28]">{party.party_name}</td>
                      <td className="p-4">
                        {party.guests.length}{' '}
                        <span className="text-gray-400">
                          ({party.guests.filter(g => g.is_attending).length} yes)
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={hasEmail ? 'opacity-100' : 'opacity-30'}
                            title={party.email || 'No email'}
                          >
                            {emailSent ? (
                              <span className="text-green-600">&#x2709;&#x2713;</span>
                            ) : (
                              <span>&#x2709;</span>
                            )}
                          </span>

                          {hasPhone && !hasUSPhone ? (
                            <span
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium"
                              title={`International: ${party.phone}`}
                            >
                              Intl
                            </span>
                          ) : (
                            <span
                              className={hasUSPhone ? 'opacity-100' : 'opacity-30'}
                              title={party.phone || 'No phone'}
                            >
                              {smsSent ? (
                                <span className="text-green-600">&#x1F4F1;&#x2713;</span>
                              ) : (
                                <span>&#x1F4F1;</span>
                              )}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {!hasAnyContact ? (
                          <span className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-red-100 text-red-600">
                            No Contact
                          </span>
                        ) : allSent ? (
                          <span className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700">
                            Sent
                          </span>
                        ) : emailSent || (hasUSPhone && smsSent) ? (
                          <span className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700">
                            Partial
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
                            Not Sent
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <button
                            onClick={() => openEditModal(party)}
                            className="text-[#D4A845] hover:text-[#b88f35] transition-colors text-lg"
                            title="Edit Party"
                          >
                            ✏️
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteParty(party)}
                            disabled={deletingId === party.id}
                            className="text-red-500 hover:text-red-700 transition-colors text-lg disabled:opacity-50"
                            title="Delete Party"
                          >
                            {deletingId === party.id ? '...' : '🗑️'}
                          </button>

                          {/* Send Button */}
                          {!hasAnyContact ? (
                            <span className="text-xs font-bold text-red-300 cursor-not-allowed uppercase px-2">
                              No Contact
                            </span>
                          ) : allSent ? (
                            <span className="text-xs font-bold text-gray-400 cursor-not-allowed uppercase px-2">
                              Sent
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSendNotification(party.id)}
                              disabled={sendingId === party.id}
                              className="px-3 py-1 bg-[#D4A845] text-white text-xs font-bold uppercase rounded hover:bg-[#b88f35] transition-colors disabled:opacity-50 ml-2"
                            >
                              {sendingId === party.id ? 'Sending...' : 'Send'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {parties.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      No parties found. Add one using the toolbar above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Party Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-serif text-2xl text-[#1B3B28]">
                {editingParty ? 'Edit Party' : 'Add New Party'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Party Name *
                </label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="e.g., The Smith Family"
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#D4A845]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={partyEmail}
                    onChange={(e) => setPartyEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#D4A845]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={partyPhone}
                    onChange={(e) => setPartyPhone(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#D4A845]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
                  Guests *
                </label>
                <div className="space-y-2">
                  {guests.map((guest, index) => (
                    <div key={guest.id || `new-${index}`} className="flex gap-2">
                      <input
                        type="text"
                        value={guest.name}
                        onChange={(e) => handleGuestNameChange(index, e.target.value)}
                        placeholder={`Guest ${index + 1} name`}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded focus:outline-none focus:border-[#D4A845]"
                      />
                      {guests.length > 1 && (
                        <button
                          onClick={() => handleRemoveGuest(index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddGuest}
                  className="mt-2 text-sm text-[#D4A845] hover:underline"
                >
                  + Add another guest
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-gray-200 rounded hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveParty}
                disabled={saving}
                className="px-6 py-2 bg-[#1B3B28] text-white rounded hover:bg-[#2a5a3f] transition-colors text-sm font-bold disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingParty ? 'Update Party' : 'Save Party'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
