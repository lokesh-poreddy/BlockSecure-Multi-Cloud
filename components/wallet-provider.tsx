import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksNetwork, STACKS_TESTNET } from '@stacks/network';

export const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });
export const network = STACKS_TESTNET;

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'BlockSecure',
        icon: window.location.origin + '/placeholder-logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div>
      {children}
      {!userSession.isUserSignedIn() && (
        <Button 
          onClick={connectWallet}
          className="fixed bottom-4 right-4 z-50"
          variant="default"
        >
          Connect Leather Wallet
        </Button>
      )}
    </div>
  );
}