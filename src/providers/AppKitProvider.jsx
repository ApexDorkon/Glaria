// src/providers/AppKitProvider.jsx
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// 1. Setup query client
const queryClient = new QueryClient();

// 2. Set your project ID
const projectId = '94a07e2d8f850185ce64445ef3f68573';

// 3. Metadata (customize for your app)
const metadata = {
  name: 'Glaria',
  description: 'GLARIA Web3 App',
  url: 'https://glaria.xyz', // must match your deployed domain!
  icons: ['https://glaria.xyz/favicon.png'],
};

// 4. Networks
const networks = [mainnet, arbitrum];

// 5. Setup Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

// 6. Create AppKit Modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}