import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/store/hooks';

interface RouteGuardProps {
  element: React.ReactElement;
  isProtected: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ element, isProtected }) => {
  const { isAuthentficated } = useAppSelector((state) => state.user);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (isProtected && !isAuthentficated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isProtected && isAuthentficated) {
    return <Navigate to={from} replace />;
  }

  return element;
};

export { RouteGuard };
