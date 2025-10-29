import React, { useState } from 'react';
import TaskContentHeader from './TaskContentHeader';
import AddNewTask from '../AddNewTask';
import { Box } from '@mui/material';
import AppsPagination from '@crema/components/AppsPagination';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import AppsFooter from '@crema/components/AppsContainer/AppsFooter';
import ListEmptyResult from '@crema/components/AppList/ListEmptyResult';
import TodoListSkeleton from '@crema/components/AppSkeleton/TodoListSkeleton';
import AppList from '@crema/components/AppList';
import { putDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import TaskListItemMobile from './TaskListItemMobile';
import TaskListItem from './TaskListItem';
import {
  useTodoActionsContext,
  useTodoContext,
} from '../../context/TodoContextProvider';

export const ViewMode = {
  List: 'list',
  Calendar: 'calendar',
};
const TasksList = () => {
  const infoViewActionsContext = useInfoViewActionsContext();
  const [filterText, onSetFilterText] = useState('');
  const { page, loading, taskLists } = useTodoContext();
  const { onPageChange, setTodoData } = useTodoActionsContext();
  const [checkedTasks, setCheckedTasks] = useState([]);

  const [isAddTaskOpen, setAddTaskOpen] = React.useState(false);

  const onOpenAddTask = () => {
    setAddTaskOpen(true);
  };

  const onCloseAddTask = () => {
    setAddTaskOpen(false);
  };

  const onChangeCheckedTasks = (checked, id) => {
    if (checked) {
      setCheckedTasks(checkedTasks.concat(id));
    } else {
      setCheckedTasks(checkedTasks.filter((taskId) => taskId !== id));
    }
  };

  const onChangeStarred = (checked, task) => {
    task.isStarred = checked;
    putDataApi('/todo/detail', infoViewActionsContext, {
      task,
    })
      .then((data) => {
        onUpdateSelectedTask(data.data);
        infoViewActionsContext.showMessage(
          data.data.isStarred
            ? 'Todo Marked as Starred Successfully'
            : 'Todo Marked as Unstarred Successfully',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onGetFilteredItems = () => {
    if (filterText === '') {
      return taskLists?.data;
    } else {
      return taskLists?.data.filter((task) =>
        task.title.toUpperCase().includes(filterText.toUpperCase()),
      );
    }
  };

  const onUpdateSelectedTask = (task) => {
    setTodoData({
      data: taskLists?.data.map((item) => {
        if (item.id === task.id) {
          return task;
        }
        return item;
      }),
      count: taskLists?.count,
    });
  };

  const onUpdateTasks = (tasks) => {
    setTodoData({
      data: taskLists?.data.map((item) => {
        const contact = tasks.find((contact) => contact.id === item.id);
        if (contact) {
          return contact;
        }
        return item;
      }),
      count: taskLists?.count,
    });
  };

  const onDeleteTask = (task) => {
    task.folderValue = 126;
    setTodoData({
      data: taskLists?.data.filter((item) => item.id !== task.id),
      count: taskLists?.count - 1,
    });
  };

  const list = onGetFilteredItems();

  return (
    <>
      <AppsHeader>
        <TaskContentHeader
          onUpdateTasks={onUpdateTasks}
          checkedTasks={checkedTasks}
          setCheckedTasks={setCheckedTasks}
          filterText={filterText}
          onSetFilterText={onSetFilterText}
          taskLists={taskLists?.data}
          totalTasks={taskLists?.count}
          setData={setTodoData}
          onViewModeSelect={onPageChange}
          viewMode={page}
          onPageChange={onPageChange}
          page={page}
        />
      </AppsHeader>
      <AppsContent>
        <>
          <Box component='span' sx={{ display: { xs: 'none', sm: 'block' } }}>
            <AppList
              data={list || []}
              renderRow={(task) => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  onChangeCheckedTasks={onChangeCheckedTasks}
                  checkedTasks={checkedTasks}
                  onChangeStarred={onChangeStarred}
                  onDeleteTask={onDeleteTask}
                />
              )}
              ListEmptyComponent={
                <ListEmptyResult
                  loading={loading}
                  actionTitle='Add Task'
                  onClick={onOpenAddTask}
                  placeholder={<TodoListSkeleton />}
                />
              }
            />
          </Box>
          <Box component='span' sx={{ display: { sm: 'none', xs: 'block' } }}>
            <AppList
              sx={{
                paddingTop: 0,
                paddingBottom: 0,
              }}
              data={list}
              renderRow={(task) => (
                <TaskListItemMobile
                  key={task.id}
                  task={task}
                  checkedTasks={checkedTasks}
                  onChangeStarred={onChangeStarred}
                />
              )}
              ListEmptyComponent={
                <ListEmptyResult
                  loading={loading}
                  actionTitle='Add Task'
                  onClick={onOpenAddTask}
                  placeholder={<TodoListSkeleton />}
                />
              }
            />
          </Box>
        </>
      </AppsContent>

      <Box component='span' sx={{ display: { sm: 'none', xs: 'block' } }}>
        {taskLists?.data?.length > 0 ? (
          <AppsFooter>
            <AppsPagination
              count={taskLists?.count}
              page={page}
              onPageChange={onPageChange}
            />
          </AppsFooter>
        ) : null}
      </Box>
      {isAddTaskOpen ? (
        <AddNewTask
          isAddTaskOpen={isAddTaskOpen}
          onCloseAddTask={onCloseAddTask}
        />
      ) : null}
    </>
  );
};

export default TasksList;
