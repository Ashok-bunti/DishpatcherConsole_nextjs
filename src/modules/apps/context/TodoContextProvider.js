'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import { useParams } from 'next/navigation';

export const ViewMode = {
  List: 'list',
  Calendar: 'calendar',
};

const TodoContext = createContext();
const TodoActionsContext = createContext();

export const useTodoContext = () => useContext(TodoContext);

export const useTodoActionsContext = () => useContext(TodoActionsContext);

export const TodoContextProvider = ({ children }) => {
  const params = useParams();
  const { all, asPath } = params;
  let folder;
  let label;
  if (all?.length === 2 && !+all[1] > 0) {
    label = all[1];
  } else if (all?.length === 1) {
    folder = all[0];
  }

  const [viewMode, setViewMode] = useState(ViewMode.List);
  const [{ apiData: labelList }] = useGetDataApi('/todo/labels');
  const [{ apiData: priorityList }] = useGetDataApi('/todo/priority');
  const [{ apiData: staffList }] = useGetDataApi('/todo/staff');
  const [{ apiData: folderList }] = useGetDataApi('/todo/folders', []);
  const [{ apiData: statusList }] = useGetDataApi('/todo/status', []);
  const [page, setPage] = useState(0);

  const [
    { apiData: taskLists, loading },
    { setQueryParams, setData: setTodoData, reCallAPI },
  ] = useGetDataApi('/todo', undefined, {}, false);

  useEffect(() => {
    setPage(0);
  }, [asPath]);

  useEffect(() => {
    if (folder || label)
      setQueryParams({
        type: folder ? 'folder' : 'label',
        name: folder || label,
        page: page,
      });
  }, [page, folder, label]);

  const onPageChange = (event, value) => {
    setPage(value);
  };

  return (
    <TodoContext.Provider
      value={{
        folder,
        label,
        labelList,
        priorityList,
        staffList,
        statusList,
        folderList,
        taskLists,
        loading,
        page,
        viewMode,
      }}
    >
      <TodoActionsContext.Provider
        value={{
          setTodoData,
          onPageChange,
          setQueryParams,
          reCallAPI,
          setPage,
          setViewMode,
        }}
      >
        {children}
      </TodoActionsContext.Provider>
    </TodoContext.Provider>
  );
};
export default TodoContextProvider;

TodoContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
