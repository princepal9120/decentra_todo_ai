
import React from 'react';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, AlertTriangle, Shield, ArrowRight } from 'lucide-react';

const WalletConnect: React.FC = () => {
  const { state, connectWallet, disconnectWallet, switchNetwork } = useBlockchain();
  
  const {
    isMetaMaskInstalled,
    isConnected,
    walletAddress,
    chainId,
    balance,
    isCorrectNetwork,
    isLoading,
    error,
  } = state;

  if (!isMetaMaskInstalled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>
            Verify task completion on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              MetaMask is not installed. Please install MetaMask to connect your wallet.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button
              onClick={() => window.open('https://metamask.io/download.html', '_blank')}
            >
              Install MetaMask
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected && !isCorrectNetwork) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wrong Network</CardTitle>
          <CardDescription>
            Please switch to Mumbai Testnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your wallet is connected to the wrong network. Please switch to Mumbai Testnet to use all features.
            </AlertDescription>
          </Alert>
          <Button onClick={switchNetwork} disabled={isLoading}>
            {isLoading ? 'Switching...' : 'Switch to Mumbai Testnet'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
        </CardTitle>
        <CardDescription>
          {isConnected
            ? 'Your wallet is connected to TaskVerse'
            : 'Connect your wallet to verify tasks on the blockchain'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Address:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {walletAddress?.substring(0, 8)}...{walletAddress?.substring(walletAddress.length - 6)}
              </Badge>
            </div>
            
            {balance && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Balance:</span>
                <span>{balance} MATIC</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Network:</span>
              <Badge className="bg-green-500">Mumbai Testnet</Badge>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button
                variant="outline"
                className="w-full"
                onClick={disconnectWallet}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <h4 className="font-semibold">Blockchain Verification</h4>
                  <p className="text-sm text-gray-500">
                    Connect your wallet to verify task completion on the blockchain
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              className="w-full"
              onClick={connectWallet}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect MetaMask'} 
              <Wallet className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
