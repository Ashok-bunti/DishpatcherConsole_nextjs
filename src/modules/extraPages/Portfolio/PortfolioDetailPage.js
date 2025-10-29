'use client';
import React from 'react';
import { portfolioData } from '@crema/fakedb/extraPages';
import PortfolioDetail from './PortfolioDetail';

const PortFolioPage = () => {
  return <PortfolioDetail portfolioData={portfolioData} />;
};

export default PortFolioPage;
