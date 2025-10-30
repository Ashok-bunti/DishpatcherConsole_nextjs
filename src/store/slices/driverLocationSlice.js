import { createSlice } from '@reduxjs/toolkit';
import { fetchTimeData } from '../../modules/userDashboard/utils/timeDataUtils';
import { configurationAPI } from '../../services/configurationService';

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
    setSelectedTab: (state, action) => {
  state.selectedTab = action.payload;
},
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
      state.searchType = 'advanced';
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
    setSearchResultsManually: (state, action) => {
      state.searchResults = action.payload;
    },
  },
});

export const performBasicSearch = (searchTerm, selectedAccount) => async (dispatch) => {
  try {
    dispatch(setSearchTerm(searchTerm));
    dispatch(setSearchType('basic'));

    if (!searchTerm.trim()) {
      dispatch(setSearchResults([]));
      return;
    }

  } catch (error) {
    dispatch(setSearchResults([]));
  }
};

export const performAdvancedSearch = (searchParams) => async (dispatch) => {
  try {
    dispatch(setSearchType('advanced'));
    dispatch(setAdvancedSearchParams(searchParams));
  } catch (error) {
    dispatch(setSearchResults([]));
  }
};

export const fetchTimeDataForAccount = (selectedAccount, accountData) => (dispatch) => {
  try {
    const timeData = fetchTimeData(selectedAccount, accountData);
    dispatch(setTimeData(timeData));
  } catch (error) {
    dispatch(setTimeData([]));
  }
};

export const fetchAiConfiguration = (selectedAccount) => async (dispatch) => {
  try {
    const configurations = await configurationAPI.getConfigurations();
    
    const masterFlag = configurations.find(item => item.key === "easy_tow_ai_call_mode");
    const autoAiDispatchMode = configurations.find(item => item.key === `${selectedAccount}_dispatch_mode`);

    const autoMode = masterFlag?.value && autoAiDispatchMode?.value === "automatic";
    const semiAutoMode = masterFlag?.value && autoAiDispatchMode?.value === "semi-automatic";

    dispatch(setAutoAiConfig(autoMode));
    dispatch(setSemiAutoAiConfig(semiAutoMode));

  } catch (error) {
    dispatch(setAutoAiConfig(false));
    dispatch(setSemiAutoAiConfig(false));
  }
};

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
  setSearchResultsManually,
} = driverLocationSlice.actions;

export default driverLocationSlice.reducer;