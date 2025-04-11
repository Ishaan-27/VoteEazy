import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { VotingContractService } from '../lib/contract';

interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  connectWallet: async () => {},
  isConnecting: false,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const checkMetaMaskInstalled = () => {
    return Boolean(window.ethereum?.isMetaMask);
  };

  const connectWallet = async () => {
    if (!checkMetaMaskInstalled()) {
      toast.error('Please install MetaMask to use this feature', {
        duration: 5000,
        icon: '🦊'
      });
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      
      // Initialize the contract service
      const votingService = new VotingContractService();
      
      // Setup Ganache network in MetaMask
      await votingService.setupGanacheNetwork();
      
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        toast.error('Please connect your MetaMask wallet');
        return;
      }
      
      setAccount(accounts[0]);
      toast.success('Wallet connected successfully');
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('Please accept the connection request in MetaMask');
      } else if (error.code === -32002) {
        toast.error('MetaMask connection pending. Please check your MetaMask extension');
      } else {
        toast.error('Failed to connect wallet. Please try again');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (checkMetaMaskInstalled()) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
          const accounts = await provider.send('eth_accounts', []);
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
        if (!accounts[0]) {
          toast.info('Wallet disconnected');
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ account, connectWallet, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
};