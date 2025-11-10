'use client';

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useIsAdmin, useInec, useElectionOngoing } from '../hooks/UseVote';
import { useContractWrite } from '../hooks/UseWriteContract';
import { Address } from 'viem';

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  
  const {
    addCandidates,
    setAdmin,
    setInec,
    closeElection,
    reopenElection,
    registerVoter,
    setAddr,
    registerBatchCandidates,
  } = useContractWrite();
  // ------------------------------------------------------------------
  // 1. READ HOOKS – they all return `undefined` while loading
  // ------------------------------------------------------------------
  const { data: isUserAdmin, refetch: refetchAdmin } = useIsAdmin(address!);
  const { data: inecAddress } = useInec();
  const { data: electionOngoing, refetch: refetchElection } = useElectionOngoing();

  // ------------------------------------------------------------------
  // 2. LOCAL UI STATE
  // ------------------------------------------------------------------
  const [candidateName, setCandidateName] = useState('');
  const [candidateAddr, setCandidateAddr] = useState('');
  const [batchCandidates, setBatchCandidates] = useState<{ name: string; address: string }[]>(
    [{ name: '', address: '' }]
  );
  const [newAdmin, setNewAdmin] = useState('');
  const [newInec, setNewInec] = useState('');
  const [voterAddr, setVoterAddr] = useState('');
  const [voterId, setVoterId] = useState('');
  const [addrToSet, setAddrToSet] = useState('');
  const [addrVoterId, setAddrVoterId] = useState('');

  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);

  console.log("found address", address)
  console.log('inec address', newInec)
  console.log("new inec and address result", address==newInec)
  // ------------------------------------------------------------------
  // 3. REFETCH WHEN WALLET CONNECTS
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isConnected && address) {
      refetchAdmin();
      refetchElection();
    }
  }, [isConnected, address, refetchAdmin, refetchElection]);

  // ------------------------------------------------------------------
  // 4. TX HANDLERS (unchanged – only UI feedback added)
  // ------------------------------------------------------------------
  const handleTx = async <T,>(fn: () => Promise<T | undefined>, onSuccess?: () => void) => {
    setTxStatus('pending');
    const hash = await fn();
    if (hash) {
      setTxStatus('success');
      setTxHash(hash as string);
      onSuccess?.();
    } else {
      setTxStatus('error');
    }
    setTimeout(() => setTxStatus('idle'), 4000);
  };

  // ------------------------------------------------------------------
  // 5. EARLY‑RETURN UI – **identical markup on server & client**
  // ------------------------------------------------------------------

  // 5a – Wallet not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Please connect your wallet.</p>
      </div>
    );
  }

  // 5b – Still loading admin status (isUserAdmin === undefined)
  //     → we *must* render the exact same HTML the server would send
  if (isUserAdmin === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 animate-pulse">Loading admin status...</p>
      </div>
    );
  }

  // 5c – Not an admin
  if (inecAddress != address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600 mb-2">Access Denied</p>
          <p className="text-gray-700">You are not an admin.</p>
          <p className="text-sm text-gray-500 mt-4">
            Current INEC: {inecAddress ? `${inecAddress.slice(0, 6)}...${inecAddress.slice(-4)}` : '...'}
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // 6. ADMIN DASHBOARD (same as before, only tiny UI tweaks)
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">
            Connected: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{address}</span>
          </p>
          <p className="text-sm text-green-600 mt-2">You have admin privileges.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* ---------- Add Single Candidate ---------- */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Add Candidate</h2>
            <input
              placeholder="Name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              placeholder="0x..."
              value={candidateAddr}
              onChange={(e) => setCandidateAddr(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <button
              onClick={() =>
                handleTx(
                  () => addCandidates(candidateName, candidateAddr as Address) ,
                  () => {
                    setCandidateName('');
                    setCandidateAddr('');
                  }
                )
              }
              disabled={txStatus === 'pending'}
              className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded disabled:opacity-50"
            >
              {txStatus === 'pending' ? 'Adding...' : 'Add Candidate'}
            </button>
          </div>

          {/* ---------- Set Admin ---------- */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Set Admin</h2>
            <input
              placeholder="New Admin Address"
              value={newAdmin}
              onChange={(e) => setNewAdmin(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <button
              onClick={() => handleTx(() => setAdmin(newAdmin as Address), () => setNewAdmin(''))}
              disabled={txStatus === 'pending'}
              className="w-full cursor-pointer bg-purple-600 text-white py-2 rounded disabled:opacity-50 "
            >
              {txStatus === 'pending' ? 'Setting...' : 'Set Admin'}
            </button>
          </div>

          {/* ---------- Set INEC ---------- */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Set INEC</h2>
            <p className="text-sm text-gray-600 mb-2">
              Current: {inecAddress ? `${inecAddress.slice(0, 6)}...${inecAddress.slice(-4)}` : '...'}
            </p>
            <input
              placeholder="New INEC Address"
              value={newInec}
              onChange={(e) => setNewInec(e.target.value)}
              className="w-full p-2 border rounded mb-3"
            />
            <button
              onClick={() => handleTx(() => setInec(newInec as Address), () => setNewInec(''))}
              disabled={txStatus === 'pending'}
              className="w-full cursor-pointer bg-indigo-600 text-white py-2 rounded disabled:opacity-50 "
            >
              {txStatus === 'pending' ? 'Setting...' : 'Set INEC'}
            </button>
          </div>

          {/* ---------- Election Control ---------- */}
          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">Election Control</h2>
            <p className="text-sm mb-3">
              Status:{' '}
              <span className={electionOngoing ? 'text-green-600' : 'text-red-600'}>
                {electionOngoing === undefined ? '...' : electionOngoing ? 'ONGOING' : 'CLOSED'}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleTx(closeElection, refetchElection)}
                disabled={!electionOngoing || txStatus === 'pending'}
                className="flex-1 cursor-pointer bg-orange-600 text-white py-2 rounded disabled:opacity-50 "
              >
                Close
              </button>
              <button
                onClick={() => handleTx(reopenElection, refetchElection)}
                disabled={electionOngoing || txStatus === 'pending'}
                className="flex-1 cursor-pointer bg-teal-600 text-white py-2 rounded  disabled:opacity-50 "
              >
                Reopen
              </button>
            </div>
          </div>

          {/* ---------- Register Voter ---------- */}
          <div className="bg-white p-5 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Register Voter</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                placeholder="Voter Address"
                value={voterAddr}
                onChange={(e) => setVoterAddr(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                placeholder="Voter ID (e.g. V12345)"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={() =>
                handleTx(
                  () => registerVoter(voterAddr as Address, voterId) ,
                  () => {
                    setVoterAddr('');
                    setVoterId('');
                  }
                )
              }
              disabled={txStatus === 'pending'}
              className="mt-3 w-full cursor-pointer bg-green-600 text-white py-2 rounded disabled:opacity-50"
            >
              {txStatus === 'pending' ? 'Registering...' : 'Register Voter'}
            </button>
          </div>

          {/* ---------- Set Addr (Legacy) ---------- */}
          <div className="bg-white p-5 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Set Address (Legacy)</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                placeholder="Address"
                value={addrToSet}
                onChange={(e) => setAddrToSet(e.target.value)}
                className="p-2 border rounded"
              />
              <input
                placeholder="Voter ID"
                value={addrVoterId}
                onChange={(e) => setAddrVoterId(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <button
              onClick={() =>
                handleTx(
                  () => setAddr(addrToSet as Address, addrVoterId) ,
                  () => {
                    setAddrToSet('');
                    setAddrVoterId('');
                  }
                )
              }
              disabled={txStatus === 'pending'}
              className="mt-3 w-full cursor-pointer bg-yellow-600 text-white py-2 rounded disabled:opacity-50"
            >
              {txStatus === 'pending' ? 'Setting...' : 'Set Address'}
            </button>
          </div>

          {/* ---------- Batch Register ---------- */}
          <div className="bg-white p-5 rounded-lg shadow md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Batch Register Candidates</h2>
            <div className="space-y-2 mb-3">
              {batchCandidates.map((c, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-2">
                  <input
                    placeholder="Name"
                    value={c.name}
                    onChange={(e) => {
                      const copy = [...batchCandidates];
                      copy[i].name = e.target.value;
                      setBatchCandidates(copy);
                    }}
                    className="p-2 border rounded"
                  />
                  <input
                    placeholder="0x..."
                    value={c.address}
                    onChange={(e) => {
                      const copy = [...batchCandidates];
                      copy[i].address = e.target.value;
                      setBatchCandidates(copy);
                    }}
                    className="p-2 border rounded"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setBatchCandidates([...batchCandidates, { name: '', address: '' }])}
                className="flex-1 bg-gray-200 cursor-pointer text-gray-700 py-2 rounded text-sm"
               >
                + Add Row
              </button>
              <button
                onClick={() =>
                  handleTx(() => {
                    const valid = batchCandidates.filter((c) => c.name && c.address) ;
                    return registerBatchCandidates(
                      valid.map((c) => ({ name: c.name, candidate_address: c.address as Address }))
                    );
                  }, () => setBatchCandidates([{ name: '', address: '' }]))
                }
                disabled={txStatus === 'pending'}
                className="flex-1 cursor-pointer bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
              >
                {txStatus === 'pending' ? 'Registering...' : 'Register Batch'}
              </button>
            </div>
          </div>
        </div>

        {/* ---------- TX STATUS ---------- */}
        {txStatus !== 'idle' && (
          <div
            className={`mt-6 p-4 rounded-lg text-white font-medium text-center ${
              txStatus === 'success' ? 'bg-green-600' : txStatus === 'error' ? 'bg-red-600' : 'bg-gray-600'
            }`}
          >
            {txStatus === 'success' && txHash && (
              <p>
                Success!{' '}
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View on Explorer
                </a>
              </p>
            )}
            {txStatus === 'error' && 'Transaction failed.'}
            {txStatus === 'pending' && 'Processing...'}
          </div>
        )}
      </div>
    </div>
  );
}