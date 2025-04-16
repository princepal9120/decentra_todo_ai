
import React from 'react';
import { Task } from '@/types/task';
import TaskCard from './TaskCard';
import { useTask } from '@/contexts/TaskContext';
import { useBlockchain } from '@/contexts/BlockchainContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Filter, RefreshCw, Brain } from 'lucide-react';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { state, setFilter, setSort, getTaskAIPrioritization } = useTask();
  const { state: blockchainState, connectWallet } = useBlockchain();
  const [showAIPrioritizeAlert, setShowAIPrioritizeAlert] = React.useState(false);

  const handleRequestAIPrioritization = () => {
    setShowAIPrioritizeAlert(true);
  };

  const handleConfirmAIPrioritization = () => {
    getTaskAIPrioritization();
    setShowAIPrioritizeAlert(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <Select
            value={state.currentFilter}
            onValueChange={(value) => setFilter(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending Tasks</SelectItem>
              <SelectItem value="completed">Completed Tasks</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={state.currentSort}
            onValueChange={(value) => setSort(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="createdAt">Creation Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleRequestAIPrioritization}
          >
            <Brain size={16} />
            <span>AI Prioritize</span>
          </Button>
          
          {!blockchainState.isConnected && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={connectWallet}
            >
              <RefreshCw size={16} />
              <span>Connect Wallet</span>
            </Button>
          )}
        </div>
      </div>
      
      {state.aiMotivationalTip && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-md">
          <p className="text-sm text-purple-900">
            <span className="font-semibold">AI Tip:</span> {state.aiMotivationalTip}
          </p>
        </div>
      )}
      
      <div className="space-y-4">
        {state.filteredTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tasks found</p>
          </div>
        ) : (
          state.filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))
        )}
      </div>
      
      <AlertDialog open={showAIPrioritizeAlert} onOpenChange={setShowAIPrioritizeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI Task Prioritization</AlertDialogTitle>
            <AlertDialogDescription>
              Our AI will analyze your tasks and provide a prioritized order based on due dates, importance, and task types. It will also provide a motivational tip to help you stay productive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAIPrioritization}>
              Prioritize Tasks
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskList;
