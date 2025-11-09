import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Voting app',
  projectId: 'test-project-id',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

console.log('Using wagmi config:', config);
