import React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { Button, Typography } from '@mui/material';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={(theme) => ({
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            '& svg': {
              width: '100%',
              maxWidth: 400,
              color: theme.palette.primary.main,
            },
          })}
        >
          {/*<ErrorIcon />*/}
          <Typography
            variant='h2'
            component='h2'
            style={{ fontSize: 30, marginTop: 16 }}
          >
            Ah! Something went wrong.
          </Typography>
          <Typography style={{ fontSize: 18, marginTop: 12 }}>
            Brace yourself till we get the error fixed.
          </Typography>
          <Typography style={{ fontSize: 18 }}>
            You may also refresh the page or try again latter
          </Typography>
          <Button
            type='primary'
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </Button>
        </Box>
      );
    } else {
      return this.props.children;
    }
  }
}

export default AppErrorBoundary;

AppErrorBoundary.propTypes = {
  children: PropTypes.node,
};
