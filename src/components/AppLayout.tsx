import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
const getTitleFromPathname = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard';
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'Dashboard';
  const baseTitle = segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  if (segments[1] === 'new') {
    return `Create New ${baseTitle.slice(0, -1)}`;
  }
  if (segments.length > 1 && segments[1] !== 'new') {
    return `${baseTitle.slice(0, -1)} Details`;
  }
  return baseTitle;
};
export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = getTitleFromPathname(location.pathname);
  useEffect(() => {
    const token = localStorage.getItem('aegis-auth-token');
    if (!token) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-background">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}