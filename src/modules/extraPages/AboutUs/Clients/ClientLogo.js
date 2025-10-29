import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Image from 'next/image';

const ClientLogo = ({ client }) => {
  return (
    <Box
      sx={{
        minHeight: 140,
        maxHeight: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Image src={client.srcImg} alt={client.name} width={130} height={60} />
    </Box>
  );
};

export default ClientLogo;

ClientLogo.propTypes = {
  client: PropTypes.object,
};
