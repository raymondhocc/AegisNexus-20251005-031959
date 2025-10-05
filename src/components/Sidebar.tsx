import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, HandCoins, Users, BarChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/policies', icon: FileText, label: 'Policies' },
  { to: '/claims', icon: HandCoins, label: 'Claims' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/reports', icon: BarChart, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];
export function Sidebar() {
  return (
    <aside className="w-20 flex flex-col items-center bg-card border-r border-gray-200 dark:border-border py-4 space-y-6">
      <div className="p-2 rounded-lg bg-blue-500 text-white">
        <Shield className="h-8 w-8" />
      </div>
      <nav className="flex flex-col items-center space-y-4">
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'p-3 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-muted',
                      isActive ? 'bg-blue-500 text-white hover:bg-blue-600' : 'text-slate-600 dark:text-slate-400'
                    )
                  }
                >
                  <item.icon className="h-6 w-6" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}