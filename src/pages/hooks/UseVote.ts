import { useReadContract, useWriteContract } from 'wagmi';
import { wagmiContractConfig } from '../utils/contract';
import { Address } from 'viem';

// === DATA CONVERSION UTILITIES ===

/**
 * Convert bytes32 to UTF-8 string, trimming null bytes
 */
export function parseBytes32String(bytes32: `0x${string}` | string): string {
  if (!bytes32 || bytes32 === '0x') return '';
  try {
    const hex = bytes32.startsWith('0x') ? bytes32.slice(2) : bytes32;
    const trimmed = hex.replace(/(00)+$/, '');
    return Buffer.from(trimmed, 'hex').toString('utf8');
  } catch {
    return bytes32;
  }
}

/**
 * Convert bytes (hex string) to UTF-8 string
 */
export function parseBytesToString(bytes: `0x${string}` | string): string {
  if (!bytes || bytes === '9x') return '';
  try {
    const hex = bytes.startsWith('0x') ? bytes.slice(2) : bytes;
    return Buffer.from(hex, 'hex').toString('utf8');
  } catch {
    return bytes;
  }
}

/**
 * Parse Candidates struct (single)
 */
export function parseCandidate(tuple: any): {
  name: string;
  votes: number;
  candidate_address: Address;
} {
  return {
    name: parseBytes32String(tuple.name),
    votes: Number(tuple.votes),
    candidate_address: tuple.candidate_address as Address,
  };
}

/**
 * Parse array of Candidates
 */
export function parseCandidatesArray(tuples: any[]): Array<{
  name: string;
  votes: number;
  candidate_address: Address;
}> {
  return tuples.map(parseCandidate);
}

/**
 * Parse UserData struct
 */
export function parseUserData(tuple: any): {
  age: number;
  hasVoted: boolean;
  _voterId: string;
  userAddress: Address;
} {
  return {
    age: Number(tuple.age),
    hasVoted: tuple.hasVoted,
    _voterId: parseBytesToString(tuple._voterId),
    userAddress: tuple.userAddress as Address,
  };
}

// === READ HOOKS ===

export function useGetAllCandidates() {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getAllCandidates',
    args: [],
  });

  const data = result.data ? parseCandidatesArray(((result as any).data)) : undefined;

  return { ...result, data };
}

export function useElectionOngoing() {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'electionOngoing',
    args: [],
  });
  return result;
}

export function useGetResults() {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getResults',
    args: [],
  });

  const data = result.data ? parseCandidate((result.data as any).winner) : undefined;

  return { ...result, data };
}

export function useGetVoterInfo(voter: Address) {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getVoterInfo',
    args: [voter],
    query: { enabled: !!voter },
  });

  const data = result.data ? parseUserData(result.data) : undefined;

  return { ...result, data };
}

export function useGetVotes(candidate: Address) {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getVotes',
    args: [candidate],
    query: { enabled: !!candidate },
  });

  const data = result.data ? BigInt(result.data as string) : undefined;

  return { ...result, data };
}

export function useGetAddr() {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getaddr',
    args: [],
  });

  const data = result.data ? parseUserData((result.data as any)._userdata) : undefined;

  return { ...result, data };
}

export function useInec() {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'inec',
    args: [],
  });

  return result;
}

export function useIsAdmin(admin: Address) {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'isAdmin',
    args: [admin],
    query: { enabled: !!admin },
  });

  return result;
}

// === WRITE FUNCTIONS ===

export async function addCandidates(name: string, candidateAddress: Address): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
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
}

export async function castVote(candidate: Address): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'castVote',
      args: [candidate],
    });
    return hash;
  } catch {
    return undefined;
  }
}

export async function closeElection(): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'closeElection',
      args: [],
    });
    return hash;
  } catch {
    return undefined;
  }
}

export async function reopenElection(): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'reopenElection',
      args: [],
    });
    return hash;
  } catch {
    return undefined;
  }
}

export async function setAdmin(admin: Address): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'setAdmin',
      args: [admin],
    });
    return hash;
  } catch {
    return undefined;
  }
}

export async function setInec(newInec: Address): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'setInec',
      args: [newInec],
    });
    return hash;
  } catch {
    return undefined;
  }
}

export async function registerVoter(voter: Address, voterId: string): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'registerVoter',
      args: [voter, `0x${Buffer.from(voterId, 'utf8').toString('hex')}`],
    });
    return hash;
  } catch {
    return undefined;
  }
}

export async function setAddr(addr: Address, voterId: string): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'setaddr',
      args: [addr, `0x${Buffer.from(voterId, 'utf8').toString('hex')}`],
    });
    return hash;
  } catch {
    return undefined;
  }
}

export async function registerBatchCandidates(
  candidates: Array<{ name: string; candidate_address: Address }>
): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const formatted = candidates.map(c => ({
      name: `0x${Buffer.from(c.name, 'utf8').toString('hex').padEnd(64, '0')}` as `0x${string}`,
      votes: 0,
      candidate_address: c.candidate_address,
    }));

    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: 'registerBatchCandidates',
      args: [formatted],
    });
    return hash;
  } catch {
    return undefined;
  }
}