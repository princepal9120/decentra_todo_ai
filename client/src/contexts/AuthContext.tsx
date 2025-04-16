
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';

// Define action types
type AuthAction =
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CONNECT_WALLET'; payload: string }
  | { type: 'DISCONNECT_WALLET' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  connectWallet: () => {},
  disconnectWallet: () => {},
});

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'CONNECT_WALLET':
      return {
        ...state,
        user: state.user
          ? { ...state.user, walletAddress: action.payload }
          : null,
      };
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        user: state.user ? { ...state.user, walletAddress: undefined } : null,
      };
    default:
      return state;
  }
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user: JSON.parse(user) },
      });
    }
  }, []);

  // Save token and user to localStorage when they change
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token);
      if (state.user) {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [state.token, state.user]);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      
      // For demo purposes - replace with actual API call
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login for development
      // In a real app, this would be: const response = await api.post('/auth/login', credentials);
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: credentials.email,
      };
      const mockToken = 'mock-jwt-token';
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken },
      });
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMsg });
      toast({
        title: 'Login failed',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' });
      
      // For demo purposes - replace with actual API call
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration for development
      // In a real app, this would be: const response = await api.post('/auth/register', credentials);
      const mockUser: User = {
        id: '1',
        name: credentials.name,
        email: credentials.email,
      };
      const mockToken = 'mock-jwt-token';
      
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: { user: mockUser, token: mockToken },
      });
      
      toast({
        title: 'Registration successful',
        description: `Welcome, ${mockUser.name}!`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'REGISTER_FAILURE', payload: errorMsg });
      toast({
        title: 'Registration failed',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  // Connect wallet
  const connectWallet = (address: string) => {
    dispatch({ type: 'CONNECT_WALLET', payload: address });
    toast({
      title: 'Wallet connected',
      description: `Connected to wallet: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
    });
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    dispatch({ type: 'DISCONNECT_WALLET' });
    toast({
      title: 'Wallet disconnected',
      description: 'Your wallet has been disconnected.',
    });
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, connectWallet, disconnectWallet }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
