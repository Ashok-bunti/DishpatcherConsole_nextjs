'use client';
import React, { useEffect } from 'react';
import TaskDetailHeader from './TaskDetailHeader';
import TaskDetailBody from './TaskDetailBody';
import { useParams } from 'next/navigation';
import AppsHeader from '@crema/components/AppsContainer/AppsHeader';
import AppsContent from '@crema/components/AppsContainer/AppsContent';
import { MailDetailSkeleton } from '@crema/components/AppSkeleton/MailDetailSkeleton';
import { useGetDataApi } from '@crema/hooks/APIHooks';

const TaskDetail = ({ show }) => {
  const params = useParams();
  const { all } = params;
  const id = all.slice(-1)[0];
  const [{ apiData: selectedTask }, { setQueryParams, setData }] =
    useGetDataApi('/calender/detail', undefined, { id }, false);

  useEffect(() => {
    if (show) {
      setQueryParams({ id });
    }
  }, [id, show]);

  const onUpdateSelectedTask = (data) => {
    setData(data);
  };

  if (!selectedTask) {
    return <MailDetailSkeleton />;
  }
  return (
    <>
      <AppsHeader>
        <TaskDetailHeader
          selectedTask={selectedTask}
          onUpdateSelectedTask={onUpdateSelectedTask}
        />
      </AppsHeader>
      <AppsContent isDetailView>
        <TaskDetailBody
          selectedTask={selectedTask}
          onUpdateSelectedTask={onUpdateSelectedTask}
        />
      </AppsContent>
    </>
  );
};

export default TaskDetail;
