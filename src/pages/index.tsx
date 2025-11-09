"use client"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useReadContract, useWriteContract } from 'wagmi';
import { wagmiContractConfig } from './utils/contract';
import { useGetAllCandidates, parseBytes32String } from './hooks/UseVote';
import CandidateCards from './components/candidate-cards';

const Home: NextPage = () => {
  const { data: candidates, isLoading, error } = useGetAllCandidates();

  return (
    <div className="w-full flex flex-col p-4 bg-gray-50 min-h-screen">
      <div className="w-full justify-end flex mb-4">
        <ConnectButton />
      </div>
      <h1 className="text-2xl font-semibold mb-6 text-center">Candidates</h1>
      <CandidateCards
        candidates={candidates}
        isLoading={isLoading}
        error={error}
        parseBytes32String={parseBytes32String}
      />
    </div>
  );
};

export default Home;
