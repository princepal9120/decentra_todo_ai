
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart2, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const { state: authState } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  // If not authenticated, don't show sidebar
  if (!authState.isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/tasks', label: 'Tasks', icon: ListTodo },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        'bg-sidebar border-r border-gray-200 transition-all duration-300 h-screen flex-shrink-0',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        {!collapsed && (
          <div className="text-primary font-semibold flex items-center">
            <span>TaskVerse</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav className="py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-md transition-colors',
                  location.pathname === item.path && 'bg-primary/10 text-primary font-medium',
                  collapsed && 'justify-center px-0'
                )}
              >
                <item.icon size={20} className={cn(!collapsed && 'mr-3')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
