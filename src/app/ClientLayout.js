'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './createEmotionCache';
import AppContextProvider from '@crema/context/AppContextProvider';
import AppThemeProvider from '@crema/context/AppThemeProvider';
import AppStyleProvider from '@crema/context/AppStyleProvider';
import AppLocaleProvider from '@crema/context/AppLocaleProvider';
import AuthRoutes from '@crema/components/AuthRoutes';
import AppPageMeta from '@crema/components/AppPageMeta';
import InfoViewContextProvider from '@crema/context/AppContextProvider/InfoViewContextProvider';
import AppAuthProvider from '@crema/core/AppAuthProvider';
import { Providers } from './providers';
import '/public/styles/vendors/index.css';

const clientSideEmotionCache = createEmotionCache();

export default function ClientRoot({ children }) {
  return (
    <Providers>
      <CacheProvider value={clientSideEmotionCache}>
        <AppContextProvider>
          <AppThemeProvider>
            <AppStyleProvider>
              <AppLocaleProvider>
                <InfoViewContextProvider>
                  <AppAuthProvider>
                    <AuthRoutes>
                      <CssBaseline />
                      <AppPageMeta />
                      {children}
                    </AuthRoutes>
                  </AppAuthProvider>
                </InfoViewContextProvider>
              </AppLocaleProvider>
            </AppStyleProvider>
          </AppThemeProvider>
        </AppContextProvider>
      </CacheProvider>
    </Providers>
  );
}
