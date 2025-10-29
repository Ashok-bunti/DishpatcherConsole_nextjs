import React from 'react';
import PropTypes from 'prop-types';
import AppLoader from '../AppLoader';

const AppSuspense = (props) => {
  const {
    loadingProps = {
      delay: 300,
    },
  } = props;
  return (
    <React.Suspense fallback={<AppLoader />}>{props.children}</React.Suspense>
  );
};

AppSuspense.propTypes = {
  loadingProps: PropTypes.object,
};

export default AppSuspense;

AppSuspense.propTypes = {
  children: PropTypes.node.isRequired,
};
