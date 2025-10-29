'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import { useParams } from 'next/navigation';

const CalendarContext = createContext();
const CalendarActionsContext = createContext();

export const useCalendarContext = () => useContext(CalendarContext);

export const useCalendarActionsContext = () =>
  useContext(CalendarActionsContext);

export const CalendarContextProvider = ({ children }) => {
  const [filterData, setFilterData] = useState({
    status: [],
    priority: [],
  });
  const params = useParams();
  const { all, asPath } = params;
  let folder;
  let label;
  if (all.length === 2) {
    label = all[1];
  } else if (all.length === 1) {
    folder = all[0];
  }

  const [{ apiData: labelList }] = useGetDataApi('/calender/labels');
  const [{ apiData: priorityList }] = useGetDataApi('/calender/priority');
  const [{ apiData: staffList }] = useGetDataApi('/calender/staff');
  const [{ apiData: folderList }] = useGetDataApi('/calender/folders', []);
  const [{ apiData: statusList }] = useGetDataApi('/calender/status', []);
  const [page, setPage] = useState(0);

  const [
    { apiData: taskLists, loading },
    { setQueryParams, setData: setCalenderData, reCallAPI },
  ] = useGetDataApi('/calender', undefined, {}, false);

  useEffect(() => {
    setPage(0);
  }, [asPath]);

  useEffect(() => {
    setQueryParams({
      type: folder ? 'folder' : 'label',
      name: folder || label,
      page: page,
    });
  }, [page, folder, label]);

  const onPageChange = (event, value) => {
    setPage(value);
  };
  const getFilterData = () => {
    if (taskLists) {
      const data = taskLists.data.filter((task) => {
        let status = true;
        if (filterData.status.length > 0) {
          status = filterData.status.includes(task.status);
        }
        let priority = true;
        if (filterData.priority.length > 0) {
          priority = filterData.priority.includes(task.priority.id);
        }
        return status && priority;
      });
      return {
        data,
        count: data.length,
      };
    }
    return [];
  };

  return (
    <CalendarContext.Provider
      value={{
        labelList,
        priorityList,
        staffList,
        statusList,
        folderList,
        filterData,
        taskLists: getFilterData(),
        loading,
        page,
      }}
    >
      <CalendarActionsContext.Provider
        value={{
          setCalenderData,
          onPageChange,
          setQueryParams,
          reCallAPI,
          setPage,
          setFilterData,
        }}
      >
        {children}
      </CalendarActionsContext.Provider>
    </CalendarContext.Provider>
  );
};
export default CalendarContextProvider;

CalendarContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
