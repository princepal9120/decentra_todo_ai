
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TaskList from '@/components/tasks/TaskList';
import TaskForm from '@/components/tasks/TaskForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types/task';

const TasksPage: React.FC = () => {
  const { state: authState } = useAuth();
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // If not authenticated, redirect to login
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
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
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-gray-500">
            Manage your tasks and track your progress
          </p>
        </div>
        <Button onClick={handleOpenAddTaskDialog} className="flex items-center gap-1">
          <Plus size={16} />
          <span>Add Task</span>
        </Button>
      </div>

      <TaskList onEditTask={handleEditTask} />

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

export default TasksPage;
