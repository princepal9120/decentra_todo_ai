import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

// Update mockTasks to use correct Task type
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete DApp MVP',
    description: 'Finish the initial version of the decentralized todo app',
    dueDate: '2025-05-01',
    status: 'pending',
    createdAt: '2025-04-15T10:00:00.000Z',
    updatedAt: '2025-04-15T10:00:00.000Z',
    priority: 'high',
    category: 'Development'
  },
  {
    id: '2',
    title: 'Write Smart Contract Tests',
    description: 'Create comprehensive test suite for the TaskManager contract',
    dueDate: '2025-04-20',
    status: 'pending',
    createdAt: '2025-04-15T11:00:00.000Z',
    updatedAt: '2025-04-15T11:00:00.000Z',
    priority: 'medium',
    category: 'Blockchain'
  },
  {
    id: '3',
    title: 'Design Analytics Dashboard',
    description: 'Create UI for the task completion analytics dashboard',
    dueDate: '2025-04-25',
    status: 'pending',
    createdAt: '2025-04-15T12:00:00.000Z',
    updatedAt: '2025-04-15T12:00:00.000Z',
    priority: 'medium',
    category: 'Design'
  },
  {
    id: '4',
    title: 'Implement MetaMask Integration',
    description: 'Connect the app with MetaMask wallet',
    dueDate: '2025-04-22',
    status: 'completed',
    createdAt: '2025-04-15T13:00:00.000Z',
    updatedAt: '2025-04-16T09:00:00.000Z',
    priority: 'high',
    category: 'Blockchain',
    blockchainVerified: true
  },
  {
    id: '5',
    title: 'Set up CI/CD Pipeline',
    description: 'Configure GitHub Actions for automated deployment',
    dueDate: '2025-04-30',
    status: 'pending',
    createdAt: '2025-04-15T14:00:00.000Z',
    updatedAt: '2025-04-15T14:00:00.000Z',
    priority: 'low',
    category: 'DevOps'
  }
];

// Define state type
interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  currentFilter: 'all' | 'pending' | 'completed';
  currentSort: 'dueDate' | 'priority' | 'createdAt';
  isLoading: boolean;
  error: string | null;
  aiMotivationalTip: string | null;
  analytics: TaskAnalytics | null;
}

// Define action types
type TaskAction =
  | { type: 'FETCH_TASKS_REQUEST' }
  | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_TASKS_FAILURE'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'VERIFY_TASK_BLOCKCHAIN'; payload: string }
  | { type: 'SET_FILTER'; payload: 'all' | 'pending' | 'completed' }
  | { type: 'SET_SORT'; payload: 'dueDate' | 'priority' | 'createdAt' }
  | { type: 'SET_AI_TIP'; payload: string }
  | { type: 'SET_ANALYTICS'; payload: TaskAnalytics };

// Initial state
const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  currentFilter: 'all',
  currentSort: 'dueDate',
  isLoading: false,
  error: null,
  aiMotivationalTip: null,
  analytics: null,
};

// Create context
const TaskContext = createContext<{
  state: TaskState;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string, completed: boolean) => Promise<void>;
  verifyTaskOnBlockchain: (id: string) => Promise<void>;
  setFilter: (filter: 'all' | 'pending' | 'completed') => void;
  setSort: (sort: 'dueDate' | 'priority' | 'createdAt') => void;
  getTaskAIPrioritization: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
}>({
  state: initialState,
  fetchTasks: async () => {},
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  completeTask: async () => {},
  verifyTaskOnBlockchain: async () => {},
  setFilter: () => {},
  setSort: () => {},
  getTaskAIPrioritization: async () => {},
  fetchAnalytics: async () => {},
});

// Helper functions
const applyFilter = (tasks: Task[], filter: 'all' | 'pending' | 'completed'): Task[] => {
  switch (filter) {
    case 'pending':
      return tasks.filter(task => task.status === 'pending');
    case 'completed':
      return tasks.filter(task => task.status === 'completed');
    default:
      return tasks;
  }
};

const applySort = (tasks: Task[], sort: 'dueDate' | 'priority' | 'createdAt'): Task[] => {
  const priorityValue = (priority: TaskPriority): number => {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  return [...tasks].sort((a, b) => {
    switch (sort) {
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        return priorityValue(b.priority) - priorityValue(a.priority);
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });
};

// Reducer function
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'FETCH_TASKS_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_TASKS_SUCCESS': {
      const filteredTasks = applyFilter(action.payload, state.currentFilter);
      const sortedFilteredTasks = applySort(filteredTasks, state.currentSort);
      
      return {
        ...state,
        isLoading: false,
        tasks: action.payload,
        filteredTasks: sortedFilteredTasks,
        error: null,
      };
    }
    case 'FETCH_TASKS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'ADD_TASK': {
      const updatedTasks = [...state.tasks, action.payload];
      const filteredTasks = applyFilter(updatedTasks, state.currentFilter);
      const sortedFilteredTasks = applySort(filteredTasks, state.currentSort);
      
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sortedFilteredTasks,
      };
    }
    case 'UPDATE_TASK': {
      const updatedTasks = state.tasks.map(task => 
        task.id === action.payload.id ? action.payload : task
      );
      const filteredTasks = applyFilter(updatedTasks, state.currentFilter);
      const sortedFilteredTasks = applySort(filteredTasks, state.currentSort);
      
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sortedFilteredTasks,
      };
    }
    case 'DELETE_TASK': {
      const updatedTasks = state.tasks.filter(task => task.id !== action.payload);
      const filteredTasks = applyFilter(updatedTasks, state.currentFilter);
      const sortedFilteredTasks = applySort(filteredTasks, state.currentSort);
      
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sortedFilteredTasks,
      };
    }
    case 'COMPLETE_TASK': {
      const updatedTasks = state.tasks.map(task => 
        task.id === action.payload
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed', updatedAt: new Date().toISOString() }
          : task
      );
      const filteredTasks = applyFilter(updatedTasks, state.currentFilter);
      const sortedFilteredTasks = applySort(filteredTasks, state.currentSort);
      
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sortedFilteredTasks,
      };
    }
    case 'VERIFY_TASK_BLOCKCHAIN': {
      const updatedTasks = state.tasks.map(task => 
        task.id === action.payload
          ? { ...task, blockchainVerified: true }
          : task
      );
      const filteredTasks = applyFilter(updatedTasks, state.currentFilter);
      const sortedFilteredTasks = applySort(filteredTasks, state.currentSort);
      
      return {
        ...state,
        tasks: updatedTasks,
        filteredTasks: sortedFilteredTasks,
      };
    }
    case 'SET_FILTER': {
      const filteredTasks = applyFilter(state.tasks, action.payload);
      const sortedFilteredTasks = applySort(filteredTasks, state.currentSort);
      
      return {
        ...state,
        currentFilter: action.payload,
        filteredTasks: sortedFilteredTasks,
      };
    }
    case 'SET_SORT': {
      const sortedFilteredTasks = applySort(state.filteredTasks, action.payload);
      
      return {
        ...state,
        currentSort: action.payload,
        filteredTasks: sortedFilteredTasks,
      };
    }
    case 'SET_AI_TIP':
      return {
        ...state,
        aiMotivationalTip: action.payload,
      };
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: action.payload,
      };
    default:
      return state;
  }
};

// Task provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { toast } = useToast();
  const { state: authState } = useAuth();

  // Helper function to generate a mock analytics object
  const generateMockAnalytics = (tasks: Task[]): TaskAnalytics => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Generate category counts
    const categoryCounts: Record<string, number> = {};
    tasks.forEach(task => {
      if (task.category) {
        categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
      }
    });
    
    // Generate weekly completion data
    const today = new Date();
    const weeklyCompletion = Array(7)
      .fill(null)
      .map((_, index) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - index));
        const dateString = date.toISOString().split('T')[0];
        
        return {
          day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
          completed: tasks.filter(
            task => 
              task.status === 'completed' && 
              task.updatedAt.split('T')[0] === dateString
          ).length,
          created: tasks.filter(
            task => task.createdAt.split('T')[0] === dateString
          ).length,
        };
      });
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      categoryCounts,
      weeklyCompletion,
    };
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      dispatch({ type: 'FETCH_TASKS_REQUEST' });
      
      // For demo purposes - replace with actual API call
      // In a real app, this would be: const response = await api.get('/tasks');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: mockTasks });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch tasks';
      dispatch({ type: 'FETCH_TASKS_FAILURE', payload: errorMsg });
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Add task
  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      const now = new Date().toISOString();
      const newTask: Task = {
        id: uuidv4(),
        ...taskData,
        createdAt: now,
        updatedAt: now,
      };
      
      // For demo purposes - replace with actual API call
      // In a real app, this would be: const response = await api.post('/tasks', newTask);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'ADD_TASK', payload: newTask });
      toast({
        title: 'Task added',
        description: 'Your task has been added successfully.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add task';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Update task
  const updateTask = async (updatedTask: Task): Promise<void> => {
    try {
      const taskWithUpdatedTime = {
        ...updatedTask,
        updatedAt: new Date().toISOString(),
      };
      
      // For demo purposes - replace with actual API call
      // In a real app, this would be: const response = await api.put(`/tasks/${updatedTask.id}`, taskWithUpdatedTime);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'UPDATE_TASK', payload: taskWithUpdatedTime });
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update task';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      // For demo purposes - replace with actual API call
      // In a real app, this would be: await api.delete(`/tasks/${id}`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'DELETE_TASK', payload: id });
      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete task';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Complete task
  const completeTask = async (id: string, completed: boolean): Promise<void> => {
    try {
      const status: TaskStatus = completed ? 'completed' : 'pending';
      
      // For demo purposes - replace with actual API call
      // In a real app, this would be: await api.patch(`/tasks/${id}`, { status });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch({ type: 'COMPLETE_TASK', payload: id });
      toast({
        title: status === 'completed' ? 'Task completed' : 'Task reopened',
        description: status === 'completed' 
          ? 'Your task has been marked as completed.'
          : 'Your task has been reopened.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update task status';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Verify task on blockchain
  const verifyTaskOnBlockchain = async (id: string) => {
    try {
      // In a real app, this would call a blockchain interaction function
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      dispatch({ type: 'VERIFY_TASK_BLOCKCHAIN', payload: id });
      toast({
        title: 'Task verified on blockchain',
        description: 'Your task completion has been verified on the blockchain.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to verify task on blockchain';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Set filter
  const setFilter = (filter: 'all' | 'pending' | 'completed') => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  // Set sort
  const setSort = (sort: 'dueDate' | 'priority' | 'createdAt') => {
    dispatch({ type: 'SET_SORT', payload: sort });
  };

  // Get AI prioritization
  const getTaskAIPrioritization = async () => {
    try {
      // For demo purposes - replace with actual API call
      // In a real app, this would be: const response = await api.post('/api/ai/prioritize', { tasks: state.tasks });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI response
      const mockMotivationalTip = "Focus on completing your high-priority blockchain tasks first to maintain momentum on your project. Remember: small consistent steps lead to big accomplishments!";
      
      dispatch({ type: 'SET_AI_TIP', payload: mockMotivationalTip });
      toast({
        title: 'AI Prioritization Complete',
        description: 'Your tasks have been prioritized by AI.',
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to get AI prioritization';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      // For demo purposes - replace with actual API call
      // In a real app, this would be: const response = await api.get('/tasks/analytics');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const analytics = generateMockAnalytics(state.tasks);
      dispatch({ type: 'SET_ANALYTICS', payload: analytics });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch analytics';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  // Load tasks on initial mount if user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated) {
      fetchTasks();
    }
  }, [authState.isAuthenticated]);

  return (
    <TaskContext.Provider
      value={{
        state,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        verifyTaskOnBlockchain,
        setFilter,
        setSort,
        getTaskAIPrioritization,
        fetchAnalytics,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use task context
export const useTask = () => useContext(TaskContext);
