import { useReadContract, useWriteContract, WagmiConfig } from 'wagmi'
import { wagmiContractConfig } from '../utils/contract'


export function useGetAllCandidates() {
  const result = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getAllCandidates',
    args: [],
  });
  return result;
}


export async function voteCandidate(candidate_address: string): Promise<string | undefined> {
  const { writeContractAsync } = useWriteContract();
  try {
    const hash = await writeContractAsync({
      ...wagmiContractConfig,
      functionName: "vote",
      args: [candidate_address]
    });
    return hash;
  } catch (error) {
    // Optionally, handle/throw error
    return undefined;
  }
}

export function parseBytes32String(bytes32: string): string {
  if (!bytes32) return '';
  try {
    // Remove trailing zeros
    const hex = bytes32.replace(/^0x/, '');
    const trimmed = hex.replace(/(00)+$/, '');
    return Buffer.from(trimmed, 'hex').toString();
  } catch {
    return bytes32;
  }
}



