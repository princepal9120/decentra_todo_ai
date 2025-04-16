
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TaskAnalytics from '@/components/analytics/TaskAnalytics';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useTask } from '@/contexts/TaskContext';

const AnalyticsPage: React.FC = () => {
  const { state: authState } = useAuth();
  const { fetchAnalytics } = useTask();

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-gray-500">
            Track your task completion metrics and performance
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchAnalytics}
          className="flex items-center gap-1"
        >
          <RefreshCw size={16} />
          <span>Refresh Data</span>
        </Button>
      </div>

      <TaskAnalytics />
    </AppLayout>
  );
};

export default AnalyticsPage;
