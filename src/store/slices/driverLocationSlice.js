import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  towReports: [],
  selectedReport: null,
  processedBy: {},
  easyCall: {},
  selectedAccount: 'QT-SD',
  selectedTab: 0,
  selectedStatusTab: 'all',
  selectedCompanyTab: 'all',
  searchTerm: '',
  searchResults: [],
  searchType: 'basic',
  loading: false,
  timeData: [],
  flatBedAvailability: false,
  wheelLiftTowTruckAvailability: false,
  eta: '',
  selectedEta: '',
  aiCallingEnabled: false,
  semiAutoAiConfig: false,
  autoAiConfig: false,
  lastScrapedTime: null,
  accountData: [],
  advancedSearchParams: {
    phone: '',
    po: '',
    vehicle: '',
    startDate: '',
    endDate: '',
  },
  searchResetTrigger: 0,
};

const driverLocationSlice = createSlice({
  name: 'driverLocation',
  initialState,
  reducers: {
    setTowReports: (state, action) => {
      state.towReports = action.payload;
    },
    setSelectedReport: (state, action) => {
      state.selectedReport = action.payload;
    },
    setProcessedBy: (state, action) => {
      state.processedBy = action.payload;
    },
    setEasyCall: (state, action) => {
      state.easyCall = action.payload;
    },
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    setSelectedStatusTab: (state, action) => {
      state.selectedStatusTab = action.payload;
    },
    setSelectedCompanyTab: (state, action) => {
      state.selectedCompanyTab = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setTimeData: (state, action) => {
      state.timeData = action.payload;
    },
    setFlatBedAvailability: (state, action) => {
      state.flatBedAvailability = action.payload;
    },
    setWheelLiftTowTruckAvailability: (state, action) => {
      state.wheelLiftTowTruckAvailability = action.payload;
    },
    setAiCallingEnabled: (state, action) => {
      state.aiCallingEnabled = action.payload;
    },
    setSemiAutoAiConfig: (state, action) => {
      state.semiAutoAiConfig = action.payload;
    },
    setAutoAiConfig: (state, action) => {
      state.autoAiConfig = action.payload;
    },
    setLastScrapedTime: (state, action) => {
      state.lastScrapedTime = action.payload;
    },
    setAccountData: (state, action) => {
      state.accountData = action.payload;
    },
    setAdvancedSearchParams: (state, action) => {
      state.advancedSearchParams = action.payload;
    },
    updateProcessedByByPO: (state, action) => {
      const { po, processedBy } = action.payload;
      state.towReports = state.towReports.map(report =>
        report.po === po ? { ...report, processed_by: processedBy } : report
      );
    },
    triggerSearchReset: (state) => {
      state.searchResetTrigger += 1;
    },
    clearAllSearches: (state) => {
      state.searchTerm = '';
      state.searchResults = [];
      state.searchType = 'basic';
      state.advancedSearchParams = {
        phone: '',
        po: '',
        vehicle: '',
        startDate: '',
        endDate: '',
      };
    },
  },
});

export const {
  setTowReports,
  setSelectedReport,
  setProcessedBy,
  setEasyCall,
  setSelectedAccount,
  setSelectedStatusTab,
  setSelectedCompanyTab,
  setSearchTerm,
  setSearchResults,
  setSearchType,
  setLoading,
  setTimeData,
  setFlatBedAvailability,
  setWheelLiftTowTruckAvailability,
  setAiCallingEnabled,
  setSemiAutoAiConfig,
  setAutoAiConfig,
  setLastScrapedTime,
  setAccountData,
  setAdvancedSearchParams,
  updateProcessedByByPO,
  triggerSearchReset,
  clearAllSearches,
} = driverLocationSlice.actions;

export default driverLocationSlice.reducer;