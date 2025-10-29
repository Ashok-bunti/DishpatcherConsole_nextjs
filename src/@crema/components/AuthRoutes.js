'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useAuthUser } from '../hooks/AuthHooks';
import AppLoader from './AppLoader';

const AuthRoutes = ({ children }) => {
  const { isLoading } = useAuthUser();
  return isLoading ? <AppLoader /> : <>{children}</>;
};

export default AuthRoutes;

AuthRoutes.propTypes = {
  children: PropTypes.node.isRequired,
};
