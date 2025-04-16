
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import AppLayout from '@/components/layout/AppLayout';
import WelcomePage from './WelcomePage';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import WalletConnect from '@/components/blockchain/WalletConnect';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid } from 'lucide-react';
import { Task } from '@/types/task';

const Index: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: taskState } = useTask();
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // If not authenticated, show welcome page
  if (!authState.isAuthenticated) {
    return <WelcomePage />;
  }

  const handleOpenAddTaskDialog = () => {
    setEditingTask(null);
    setIsAddTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setIsAddTaskDialogOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddTaskDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back, {authState.user?.name}! Manage your tasks.
          </p>
        </div>
        <Button onClick={handleOpenAddTaskDialog} className="flex gap-1">
          <Plus size={16} />
          <span>Add Task</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <TaskList onEditTask={handleEditTask} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <WalletConnect />
          
          {taskState.aiMotivationalTip && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-100">
              <h3 className="text-sm font-medium text-purple-800 mb-2">AI Assistance</h3>
              <p className="text-sm text-purple-900">{taskState.aiMotivationalTip}</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={editingTask || undefined} 
            onSuccess={handleCloseTaskDialog} 
          />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Index;
