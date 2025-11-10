import { useReadContract, useWriteContract } from 'wagmi';
import { wagmiContractConfig } from '../utils/contract';
import { Address } from 'viem';

export function useContractWrite() {
  const { writeContractAsync } = useWriteContract();

  const addCandidates = async (name: string, candidateAddress: Address): Promise<string | undefined> => {
    try {
      const hash = await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'addCandidates',
        args: [name, candidateAddress],
      });
      return hash;
    } catch {
      return undefined;
    }
  };

  const setAdmin = async (admin: Address): Promise<string | undefined> => {
    try {
      return await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'setAdmin',
        args: [admin],
      });
    } catch {
      return undefined;
    }
  };

  const setInec = async (newInec: Address): Promise<string | undefined> => {
    try {
      return await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'setInec',
        args: [newInec],
      });
    } catch {
      return undefined;
    }
  };

  const closeElection = async (): Promise<string | undefined> => {
    try {
      return await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'closeElection',
        args: [],
      });
    } catch {
      return undefined;
    }
  };

  const reopenElection = async (): Promise<string | undefined> => {
    try {
      return await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'reopenElection',
        args: [],
      });
    } catch {
      return undefined;
    }
  };

  const registerVoter = async (voter: Address, voterId: string): Promise<string | undefined> => {
    try {
      return await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'registerVoter',
        args: [voter, `0x${Buffer.from(voterId, 'utf8').toString('hex')}`],
      });
    } catch {
      return undefined;
    }
  };

  const setAddr = async (addr: Address, voterId: string): Promise<string | undefined> => {
    try {
      return await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'setaddr',
        args: [addr, `0x${Buffer.from(voterId, 'utf8').toString('hex')}`],
      });
    } catch {
      return undefined;
    }
  };

  const registerBatchCandidates = async (
    candidates: Array<{ name: string; candidate_address: Address }>
  ): Promise<string | undefined> => {
    try {
      const formatted = candidates.map(c => ({
        name: `0x${Buffer.from(c.name, 'utf8').toString('hex').padEnd(64, '0')}` as `0x${string}`,
        votes: 0,
        candidate_address: c.candidate_address,
      }));

      return await writeContractAsync({
        ...wagmiContractConfig,
        functionName: 'registerBatchCandidates',
        args: [formatted],
      });
    } catch {
      return undefined;
    }
  };

  return {
    addCandidates,
    setAdmin,
    setInec,
    closeElection,
    reopenElection,
    registerVoter,
    setAddr,
    registerBatchCandidates,
  };
}