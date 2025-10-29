import React from 'react';

export const useToggler = (initialState) => {
  const [value, setValue] = React.useState(initialState);

  const toggleValue = () => setValue((prev) => !prev);

  return [value, toggleValue];
};
