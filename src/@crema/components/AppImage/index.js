import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';

const AppImage = ({ src, alt, ...props }) => {
  return (
    // <picture>
    // </picture>
    <Image src={src} alt={alt} {...props} />
  );
};

export default AppImage;
AppImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};
