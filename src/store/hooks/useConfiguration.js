import { useAppSelector, useAppDispatch } from './index';
import { useConfigurationAPI } from '../../services/configurationService';
import { 
  setFlatBedAvailability, 
  setWheelLiftTowTruckAvailability,
  setAiCallingEnabled,
  setSemiAutoAiConfig,
  setAutoAiConfig,
} from '../slices/driverLocationSlice';
import { useEffect } from 'react';

export const useConfiguration = (selectedAccount = 'QT-SD') => {
  const dispatch = useAppDispatch();
  const { fetchConfigurations, configurations, isLoading } = useConfigurationAPI();

  useEffect(() => {
    const updateConfigurations = async () => {
      try {
        const configs = await fetchConfigurations();
        
        if (!Array.isArray(configs)) return;

        const flatBedKey = `${selectedAccount}_flatBedAvailable`;
        const wheelLiftKey = `${selectedAccount}_wheelLiftAvailable`;

        const flatBedAvailable = configs.find(item => item.key === flatBedKey)?.value ?? false;
        const wheelLiftAvailable = configs.find(item => item.key === wheelLiftKey)?.value ?? false;

        dispatch(setFlatBedAvailability(flatBedAvailable));
        dispatch(setWheelLiftTowTruckAvailability(wheelLiftAvailable));

        const masterFlag = configs.find(item => item.key === 'easy_tow_ai_call_mode');
        const autoAiDispatchMode = configs.find(item => item.key === `${selectedAccount}_dispatch_mode`);

        const autoMode = masterFlag?.value && autoAiDispatchMode?.value === 'automatic';
        const semiAutoMode = masterFlag?.value && autoAiDispatchMode?.value === 'semi-automatic';

        dispatch(setAutoAiConfig(autoMode));
        dispatch(setSemiAutoAiConfig(semiAutoMode));

        const aiCallingConfig = configs.find(config => config.key === 'AI_Calling');
        if (aiCallingConfig) {
          dispatch(setAiCallingEnabled(aiCallingConfig.value === true));
        }

      } catch (err) {
        console.error('Error fetching configurations:', err);
      }
    };

    updateConfigurations();
  }, [selectedAccount, dispatch, fetchConfigurations]);

  return {
    configurations,
    isLoading,
    fetchConfigurations,
  };
};