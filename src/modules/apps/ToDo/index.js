'use client';
import React from 'react';
import TaskSideBar from './TaskSideBar/index';
import TasksList from './TasksList';
import TaskDetail from './TaskDetail';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import AppsContainer from '@crema/components/AppsContainer';
import TodoContextProvider from '../context/TodoContextProvider';

const ToDo = () => {
  const params = useParams();
  const { messages } = useIntl();
  return (
    <TodoContextProvider>
      <AppsContainer
        title={messages['todo.detail']}
        sidebarContent={<TaskSideBar />}
      >
        <TasksList />
        <Box
          sx={{
            transition: 'all 0.5s ease',
            transform: 'translateX(100%)',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            opacity: 0,
            visibility: 'hidden',
            backgroundColor: 'background.paper',
            '&.show': {
              transform: 'translateX(0)',
              opacity: 1,
              visibility: 'visible',
            },
          }}
          className={clsx({
            show: params.all[params.all.length - 1] > 0,
          })}
        >
          <TaskDetail show={params.all[params.all.length - 1] > 0} />
        </Box>
      </AppsContainer>
    </TodoContextProvider>
  );
};

export default ToDo;

ToDo.propTypes = {
  match: PropTypes.object,
};
