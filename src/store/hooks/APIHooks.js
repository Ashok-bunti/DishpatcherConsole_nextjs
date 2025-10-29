import { useDispatch } from 'react-redux';
import { showSnackbar } from '../slices/uiSlice';

export const useAPIHooks = () => {
  const dispatch = useDispatch();

  const showSuccess = (message) => {
    dispatch(showSnackbar({ message, severity: 'success' }));
  };

  const showError = (message) => {
    dispatch(showSnackbar({ message, severity: 'error' }));
  };

  const showInfo = (message) => {
    dispatch(showSnackbar({ message, severity: 'info' }));
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
};