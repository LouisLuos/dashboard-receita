import React, { useState, useEffect } from 'react';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

export type AppRoute = '/' | '/login';

export const AppRouter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<AppRoute>(() => {
    return window.location.pathname === '/login' ? '/login' : '/';
  });

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname === '/login' ? '/login' : '/');
    };

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigateTo = (path: AppRoute) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (currentPath === '/login') {
    return <LoginPage onLoginSucesso={() => navigateTo('/')} />;
  }

  return <DashboardPage />;
};

