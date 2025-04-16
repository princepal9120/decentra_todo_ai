
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { Menu, X, User, LogOut, Wallet } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const { state: blockchainState, connectWallet, disconnectWallet } = useBlockchain();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-primary font-semibold text-xl">TaskVerse</div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-500 focus:outline-none" 
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {authState.isAuthenticated ? (
            <>
              {/* Wallet connection */}
              {blockchainState.isConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-green-600 border-green-600"
                  onClick={disconnectWallet}
                >
                  <Wallet size={16} />
                  <span className="hidden sm:inline">
                    {blockchainState.walletAddress?.substring(0, 6)}...
                    {blockchainState.walletAddress?.substring(blockchainState.walletAddress.length - 4)}
                  </span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={connectWallet}
                >
                  <Wallet size={16} />
                  <span className="hidden sm:inline">Connect Wallet</span>
                </Button>
              )}

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {authState.user?.name ? getInitials(authState.user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User size={16} className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 space-y-2">
          {authState.isAuthenticated ? (
            <>
              <div className="py-2 px-4 text-sm text-gray-500">
                Logged in as {authState.user?.name}
              </div>
              <Link
                to="/profile"
                className="block py-2 px-4 hover:bg-gray-100 rounded"
                onClick={toggleMobileMenu}
              >
                Profile
              </Link>
              {blockchainState.isConnected ? (
                <Button
                  variant="outline"
                  className="w-full justify-start text-green-600 border-green-600"
                  onClick={disconnectWallet}
                >
                  <Wallet size={16} className="mr-2" />
                  Disconnect Wallet
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={connectWallet}
                >
                  <Wallet size={16} className="mr-2" />
                  Connect Wallet
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500" 
                onClick={() => { logout(); toggleMobileMenu(); }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="w-full justify-start" onClick={toggleMobileMenu}>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="w-full justify-start" onClick={toggleMobileMenu}>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
