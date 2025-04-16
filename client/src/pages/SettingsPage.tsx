
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import WalletConnect from '@/components/blockchain/WalletConnect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { state: authState, logout } = useAuth();

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500">
          Manage your account settings and blockchain connections
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-lg">{authState.user?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg">{authState.user?.email}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Button variant="destructive" onClick={logout} className="flex gap-2">
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="blockchain" className="space-y-4">
          <WalletConnect />
          
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Settings</CardTitle>
              <CardDescription>
                Configure your blockchain interaction preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-verify completed tasks</h3>
                    <p className="text-sm text-gray-500">
                      Automatically submit completed tasks to blockchain
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Gas price settings</h3>
                    <p className="text-sm text-gray-500">
                      Choose your preferred gas price strategy
                    </p>
                  </div>
                  <select className="border rounded p-1">
                    <option>Standard</option>
                    <option>Fast</option>
                    <option>Instant</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Default task view</h3>
                    <p className="text-sm text-gray-500">
                      Choose how tasks are displayed by default
                    </p>
                  </div>
                  <select className="border rounded p-1">
                    <option>All tasks</option>
                    <option>Pending tasks</option>
                    <option>Completed tasks</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Default sorting</h3>
                    <p className="text-sm text-gray-500">
                      Choose how tasks are sorted by default
                    </p>
                  </div>
                  <select className="border rounded p-1">
                    <option>Due date</option>
                    <option>Priority</option>
                    <option>Creation date</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive task reminders via email
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Browser notifications</h3>
                    <p className="text-sm text-gray-500">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Blockchain transaction alerts</h3>
                    <p className="text-sm text-gray-500">
                      Get notified about blockchain transactions
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default SettingsPage;
