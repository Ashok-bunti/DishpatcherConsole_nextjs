'use client';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Amplify } from 'aws-amplify';
import {
  getCurrentUser,
  confirmSignUp,
  signOut,
  signUp,
  signIn,
} from '@aws-amplify/auth';
import PropTypes from 'prop-types';
import { awsConfig } from './aws-exports';
import { useRouter } from 'next/navigation';

const AwsCognitoContext = createContext();
const AwsCognitoActionsContext = createContext();

export const useAwsCognito = () => useContext(AwsCognitoContext);

export const useAwsCognitoActions = () => useContext(AwsCognitoActionsContext);

const AwsAuthProvider = ({
  children,
  fetchStart,
  fetchSuccess,
  fetchError,
  showMessage,
}) => {
  const [awsCognitoData, setAwsCognitoData] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const router = useRouter();

  const auth = () => {
    Amplify.configure(awsConfig);
    return Amplify;
  };

  useEffect(() => {
    // auth
    //   .currentAuthenticatedUser()
    getCurrentUser()
      .then((user) => {
        setAwsCognitoData({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch(() => {
        setAwsCognitoData({
          user: undefined,
          isAuthenticated: false,
          isLoading: false,
        });
      });
  }, [auth]);

  const signin = async ({ email, password }) => {
    fetchStart();
    try {
      const user = await signIn({ username: email, password });
      fetchSuccess();
      setAwsCognitoData({
        user: user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      fetchError(error.message);
    }
  };
  const signUpCognitoUser = async ({ email, password, name }) => {
    fetchStart();
    try {
      await signUp({
        username: email,
        password,
        attributes: {
          name,
        },
      });
      fetchSuccess();
      showMessage(
        'A code has been sent to your registered email address, Enter the code to complete the signup process!',
      );
      router.push('/confirm-signup', { email: email });
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      fetchError(error.message);
    }
  };
  const confirmCognitoUserSignup = async (username, code) => {
    fetchStart();
    try {
      await confirmSignUp({
        username,
        confirmationCode: code,
        options: {
          forceAliasCreation: false,
        },
      });
      history.replace('/signin');
      showMessage(
        'Congratulations, Signup process is complete, You can now Sign in by entering correct credentials!',
      );
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      fetchError(error.message);
    }
  };
  const forgotPassword = async (username, code) => {
    fetchStart();
    try {
      await confirmSignUp({
        username,
        confirmationCode: code,
        options: {
          forceAliasCreation: false,
        },
      });
      history.replace('/signin');
      showMessage(
        'Congratulations, Signup process is complete, You can now Sign in by entering correct credentials!',
      );
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      fetchError(error.message);
    }
  };

  const logout = async () => {
    setAwsCognitoData({ ...awsCognitoData, isLoading: true });
    try {
      await signOut();
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  return (
    <AwsCognitoContext.Provider
      value={{
        ...awsCognitoData,
        auth,
      }}
    >
      <AwsCognitoActionsContext.Provider
        value={{
          logout,
          signIn: signin,
          signUpCognitoUser,
          confirmCognitoUserSignup,
          forgotPassword,
        }}
      >
        {children}
      </AwsCognitoActionsContext.Provider>
    </AwsCognitoContext.Provider>
  );
};

export default AwsAuthProvider;

AwsAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
