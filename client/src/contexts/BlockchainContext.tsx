
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

interface BlockchainState {
  isMetaMaskInstalled: boolean;
  isConnected: boolean;
  walletAddress: string | null;
  chainId: string | null;
  balance: string | null;
  isCorrectNetwork: boolean;
  isLoading: boolean;
  error: string | null;
}

interface BlockchainContextType {
  state: BlockchainState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  addTaskToBlockchain: (taskId: string, taskTitle: string) => Promise<string | null>;
  verifyTaskOnBlockchain: (taskId: string) => Promise<boolean>;
}

// Create context
const BlockchainContext = createContext<BlockchainContextType>({
  state: {
    isMetaMaskInstalled: false,
    isConnected: false,
    walletAddress: null,
    chainId: null,
    balance: null,
    isCorrectNetwork: false,
    isLoading: false,
    error: null,
  },
  connectWallet: async () => {},
  disconnectWallet: () => {},
  switchNetwork: async () => {},
  addTaskToBlockchain: async () => null,
  verifyTaskOnBlockchain: async () => false,
});

// Mumbai testnet configuration
const MUMBAI_CHAIN_ID = '0x13881';
const MUMBAI_CONFIG = {
  chainId: MUMBAI_CHAIN_ID,
  chainName: 'Mumbai Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com'],
};

// Mock Contract ABI and Address
const TASK_MANAGER_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
const TASK_MANAGER_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "taskId",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "taskHash",
        "type": "bytes32"
      }
    ],
    "name": "addTaskHash",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "taskId",
        "type": "string"
      }
    ],
    "name": "markTaskCompleted",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "taskId",
        "type": "string"
      }
    ],
    "name": "isTaskCompleted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Helper function to calculate keccak256 hash
const calculateTaskHash = (taskTitle: string): string => {
  // In a real app, we would use ethers or web3 to calculate this
  // For demo purposes, we'll just return a mock hash
  return `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
};

// Provider component
export const BlockchainProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<BlockchainState>({
    isMetaMaskInstalled: false,
    isConnected: false,
    walletAddress: null,
    chainId: null,
    balance: null,
    isCorrectNetwork: false,
    isLoading: false,
    error: null,
  });

  const { toast } = useToast();
  const { connectWallet: authConnectWallet, disconnectWallet: authDisconnectWallet } = useAuth();

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = async () => {
      // @ts-ignore - window.ethereum is injected by MetaMask
      const isMetaMaskInstalled = typeof window !== 'undefined' && window.ethereum !== undefined;
      
      setState(prevState => ({
        ...prevState,
        isMetaMaskInstalled,
      }));

      // If MetaMask is installed, check if already connected
      if (isMetaMaskInstalled) {
        try {
          // @ts-ignore
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // @ts-ignore
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            setState(prevState => ({
              ...prevState,
              isConnected: true,
              walletAddress: accounts[0],
              chainId,
              isCorrectNetwork: chainId === MUMBAI_CHAIN_ID,
            }));

            // Also update in auth context
            authConnectWallet(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking MetaMask connection:', error);
        }
      }
    };

    checkMetaMask();
  }, []);

  // Listen for account changes
  useEffect(() => {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setState(prevState => ({
            ...prevState,
            isConnected: false,
            walletAddress: null,
            balance: null,
          }));
          authDisconnectWallet();
        } else {
          // Account changed
          setState(prevState => ({
            ...prevState,
            isConnected: true,
            walletAddress: accounts[0],
          }));
          authConnectWallet(accounts[0]);
        }
      };

      // @ts-ignore
      const handleChainChanged = (chainId: string) => {
        setState(prevState => ({
          ...prevState,
          chainId,
          isCorrectNetwork: chainId === MUMBAI_CHAIN_ID,
        }));

        // Reload the page as recommended by MetaMask
        window.location.reload();
      };

      // @ts-ignore
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      // @ts-ignore
      window.ethereum.on('chainChanged', handleChainChanged);

      // Cleanup
      return () => {
        // @ts-ignore
        if (window.ethereum.removeListener) {
          // @ts-ignore
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          // @ts-ignore
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      // @ts-ignore
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request accounts
      // @ts-ignore
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get current chain ID
      // @ts-ignore
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Get balance
      // @ts-ignore
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });

      const balanceInEther = parseInt(balance, 16) / 10**18;

      setState(prevState => ({
        ...prevState,
        isConnected: true,
        walletAddress: accounts[0],
        chainId,
        balance: balanceInEther.toFixed(4),
        isCorrectNetwork: chainId === MUMBAI_CHAIN_ID,
        isLoading: false,
      }));

      // Update auth context
      authConnectWallet(accounts[0]);

      toast({
        title: 'Wallet Connected',
        description: `Connected to wallet: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
      });

      // If not on Mumbai, prompt to switch
      if (chainId !== MUMBAI_CHAIN_ID) {
        toast({
          title: 'Wrong Network',
          description: 'Please switch to Mumbai Testnet to use all features',
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to connect wallet';
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: errorMsg,
      }));
      
      toast({
        title: 'Connection Failed',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Disconnect wallet (locally only, not from MetaMask)
  const disconnectWallet = () => {
    setState(prevState => ({
      ...prevState,
      isConnected: false,
      walletAddress: null,
      balance: null,
    }));
    
    // Update auth context
    authDisconnectWallet();
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  };

  // Switch to Mumbai network
  const switchNetwork = async () => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      // @ts-ignore
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      try {
        // Try to switch to Mumbai
        // @ts-ignore
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: MUMBAI_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          // Add Mumbai network
          // @ts-ignore
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [MUMBAI_CONFIG],
          });
        } else {
          throw switchError;
        }
      }

      // Get updated chain ID
      // @ts-ignore
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      setState(prevState => ({
        ...prevState,
        chainId,
        isCorrectNetwork: chainId === MUMBAI_CHAIN_ID,
        isLoading: false,
      }));

      toast({
        title: 'Network Switched',
        description: 'Successfully connected to Mumbai Testnet',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to switch network';
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: errorMsg,
      }));
      
      toast({
        title: 'Network Switch Failed',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Add task to blockchain
  const addTaskToBlockchain = async (taskId: string, taskTitle: string): Promise<string | null> => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      // In a real app, we would use ethers.js or web3.js to interact with the contract
      // For demo purposes, we'll simulate a successful transaction
      
      // Calculate task hash
      const taskHash = calculateTaskHash(taskTitle);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setState(prevState => ({ ...prevState, isLoading: false }));
      
      toast({
        title: 'Task Added to Blockchain',
        description: 'Your task has been successfully added to the blockchain',
      });
      
      // Return mock transaction hash
      return `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add task to blockchain';
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: errorMsg,
      }));
      
      toast({
        title: 'Blockchain Transaction Failed',
        description: errorMsg,
        variant: 'destructive',
      });
      
      return null;
    }
  };

  // Verify task on blockchain
  const verifyTaskOnBlockchain = async (taskId: string): Promise<boolean> => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      // In a real app, we would use ethers.js or web3.js to interact with the contract
      // For demo purposes, we'll simulate a successful verification
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setState(prevState => ({ ...prevState, isLoading: false }));
      
      toast({
        title: 'Task Verified on Blockchain',
        description: 'Your task has been successfully verified on the blockchain',
      });
      
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to verify task on blockchain';
      
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: errorMsg,
      }));
      
      toast({
        title: 'Blockchain Verification Failed',
        description: errorMsg,
        variant: 'destructive',
      });
      
      return false;
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        state,
        connectWallet,
        disconnectWallet,
        switchNetwork,
        addTaskToBlockchain,
        verifyTaskOnBlockchain,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

// Custom hook to use blockchain context
export const useBlockchain = () => useContext(BlockchainContext);
