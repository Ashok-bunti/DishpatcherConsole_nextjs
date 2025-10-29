'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import IntlMessages from '@crema/helpers/IntlMessages';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AppsStarredIcon from '@crema/components/AppsStarredIcon';
import StatusToggleButton from './StatusToggleButton';
import AppsDeleteIcon from '@crema/components/AppsDeleteIcon';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppTooltip from '@crema/components/AppTooltip';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { putDataApi } from '@crema/hooks/APIHooks';

const TaskDetailHeader = (props) => {
  const { selectedTask, onUpdateSelectedTask } = props;

  const infoViewActionsContext = useInfoViewActionsContext();

  const router = useRouter();

  const onClickBackButton = () => {
    router.back();
  };

  const onChangeStarred = (checked, selectedTask) => {
    selectedTask.isStarred = checked;
    putDataApi('todo/starred', infoViewActionsContext, {
      taskIds: [selectedTask?.id],
      status: checked,
    })
      .then((data) => {
        onUpdateSelectedTask(data.data[0]);
        infoViewActionsContext.showMessage(
          data.data[0].isStarred
            ? 'Task Marked as Starred Successfully'
            : 'Task Marked as Unstarred Successfully',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onDeleteTask = () => {
    const task = selectedTask;
    task.folderValue = 126;
    putDataApi('todo/task/delete', infoViewActionsContext, {
      task,
    })
      .then((data) => {
        onUpdateSelectedTask(data.data);
        router.back();
        infoViewActionsContext.showMessage('Task Deleted Successfully');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  return (
    <>
      <Box
        component='span'
        onClick={onClickBackButton}
        sx={{
          mr: { xs: 2, sm: 4 },
          cursor: 'pointer',
        }}
      >
        <AppTooltip title={<IntlMessages id='common.back' />}>
          <ArrowBackIcon
            sx={{
              color: 'text.secondary',
            }}
          />
        </AppTooltip>
      </Box>
      <StatusToggleButton
        selectedTask={selectedTask}
        onUpdateSelectedTask={onUpdateSelectedTask}
      />
      <Box
        component='span'
        sx={{
          marginLeft: 'auto',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <AppsStarredIcon item={selectedTask} onChange={onChangeStarred} />
      </Box>
      <AppsDeleteIcon
        deleteAction={onDeleteTask}
        deleteTitle={<IntlMessages id='todo.deleteMessage' />}
        sx={{
          color: 'text.disabled',
        }}
      />
    </>
  );
};

export default TaskDetailHeader;

TaskDetailHeader.propTypes = {
  selectedTask: PropTypes.object.isRequired,
  onUpdateSelectedTask: PropTypes.func,
};
