
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useBlockchain } from '@/contexts/BlockchainContext';
import { useTask } from '@/contexts/TaskContext';
import { Calendar, Edit, Trash2, Check, Shield } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { completeTask, deleteTask, verifyTaskOnBlockchain } = useTask();
  const { state: blockchainState, addTaskToBlockchain } = useBlockchain();

  const handleComplete = () => {
    completeTask(task.id, task.status !== 'completed');
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  const handleVerifyOnBlockchain = async () => {
    if (task.status === 'completed' && !task.blockchainVerified) {
      await verifyTaskOnBlockchain(task.id);
    } else if (!task.blockchainVerified && blockchainState.isConnected) {
      await addTaskToBlockchain(task.id, task.title);
    }
  };

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  const formattedDate = task.dueDate 
    ? format(new Date(task.dueDate), 'MMM d, yyyy') 
    : null;

  return (
    <Card className={cn(
      'task-card',
      `ai-priority-${task.priority}`,
      task.status === 'completed' && 'completed'
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <Checkbox 
              checked={task.status === 'completed'} 
              onCheckedChange={handleComplete}
              className="mt-1"
            />
            <CardTitle className={cn(
              'text-lg font-medium transition-all',
              task.status === 'completed' && 'line-through text-gray-500'
            )}>
              {task.title}
            </CardTitle>
          </div>
          <Badge className={cn(
            'font-normal',
            priorityColors[task.priority]
          )}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      
      {task.description && (
        <CardContent className="py-2">
          <p className={cn(
            'text-gray-600 text-sm',
            task.status === 'completed' && 'text-gray-400'
          )}>
            {task.description}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          {formattedDate && (
            <>
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </>
          )}
          
          {task.category && (
            <Badge variant="outline" className="ml-2">
              {task.category}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {task.blockchainVerified && (
            <Badge variant="outline" className="blockchain-verified mr-1 flex items-center gap-1">
              <Shield size={12} />
              <span>Verified</span>
            </Badge>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onEdit(task)}
          >
            <Edit size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 size={16} className="text-red-500" />
          </Button>
          
          {!task.blockchainVerified && blockchainState.isConnected && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleVerifyOnBlockchain}
            >
              <Shield size={14} className="mr-1" />
              {task.status === 'completed' ? 'Verify' : 'Add Hash'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
