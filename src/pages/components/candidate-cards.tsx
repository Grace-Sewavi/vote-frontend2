import React, { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { wagmiContractConfig } from '../utils/contract';

interface Candidate {
  name: string;
  votes: any;
  candidate_address: string;
}

interface CandidateCardsProps {
  candidates: Candidate[] | undefined;
  isLoading: boolean;
  error: any;
  parseBytes32String: (bytes32: string) => string;
}

const CandidateCards: React.FC<CandidateCardsProps> = ({ candidates, isLoading, error, parseBytes32String }) => {
  const { writeContractAsync } = useWriteContract();
  const [loadingIdx, setLoadingIdx] = useState<number | null>(null);
  const [successIdx, setSuccessIdx] = useState<number | null>(null);
  const [errorIdx, setErrorIdx] = useState<number | null>(null);

  const handleVote = async (candidate_address: string, ix: number) => {
    setLoadingIdx(ix);
    setSuccessIdx(null);
    setErrorIdx(null);
    try {
      await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'castVote',
        args: [candidate_address],
      });
      setSuccessIdx(ix);
    } catch (err) {
      setErrorIdx(ix);
    }
    setLoadingIdx(null);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {isLoading ? (
        <div className="text-lg">Loading...</div>
      ) : error ? (
        <div className="text-lg text-red-500">Error</div>
      ) : candidates && Array.isArray(candidates) ? (
        candidates.length > 0 ? (
          candidates.map((candidate, ix) => (
            <div
              key={ix}
              className="flex flex-col bg-white border border-black/30 rounded-xl p-4 min-w-[260px] max-w-xs shadow hover:shadow-lg transition-all"
            >
              <div className="mb-1 font-bold text-gray-800 text-lg">
                {parseBytes32String(candidate.name)}
              </div>
              <div className="mb-1 flex items-center gap-2">
                <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{candidate.candidate_address}</span>
              </div>
              <div className="mb-3 text-indigo-700 font-semibold">
                Votes: {candidate.votes?.toString()}
              </div>
              <button
                type="button"
                disabled={loadingIdx === ix}
                onClick={() => handleVote(candidate.candidate_address, ix)}
                className={
                  `bg-black px-4 py-2 rounded-md cursor-pointer text-white font-bold transition ` +
                  (loadingIdx === ix ? 'opacity-60 cursor-wait' : 'hover:bg-indigo-800')
                }
              >
                {loadingIdx === ix
                  ? 'Voting...'
                  : successIdx === ix
                    ? 'Voted!'
                    : errorIdx === ix
                      ? 'Error'
                      : 'Vote'}
              </button>
            </div>
          ))
        ) : (
          <div>No candidates found.</div>
        )
      ) : (
        <div>No data</div>
      )}
    </div>
  );
};

export default CandidateCards;
