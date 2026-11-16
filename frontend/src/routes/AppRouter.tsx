import React, { useState, useEffect } from 'react';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { estaAutenticado } from '../services/authService';

export type AppRoute = '/' | '/login';

function resolverRotaInicial(): AppRoute {
  if (!estaAutenticado()) {
    return '/login';
  }
  return window.location.pathname === '/login' ? '/' : '/';
}

export const AppRouter: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<AppRoute>(resolverRotaInicial);

  useEffect(() => {
    const autenticado = estaAutenticado();
    if (!autenticado && window.location.pathname !== '/login') {
      window.history.replaceState({}, '', '/login');
    } else if (autenticado && window.location.pathname === '/login') {
      window.history.replaceState({}, '', '/');
    }

    const onLocationChange = () => {
      if (!estaAutenticado()) {
        if (window.location.pathname !== '/login') {
          window.history.replaceState({}, '', '/login');
        }
        setCurrentPath('/login');
        return;
      }
      setCurrentPath(window.location.pathname === '/login' ? '/login' : '/');
    };

    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigateTo = (path: AppRoute) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (currentPath === '/login' || !estaAutenticado()) {
    return <LoginPage onLoginSucesso={() => navigateTo('/')} />;
  }

  return <DashboardPage />;
};

