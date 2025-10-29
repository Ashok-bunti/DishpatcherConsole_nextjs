import React, { useState } from 'react';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import PropTypes from 'prop-types';
import { StyledCalendar } from './Calendar.style';
// import './calendar.css';
import CustomToolbar from './CustomToolbar';
import TaskItem from './TaskItem';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useParams, useRouter } from 'next/navigation';

const DragAndDropCalendar = withDragAndDrop(StyledCalendar);

const localizer = momentLocalizer(moment);

const TaskCalender = ({
  taskList,
  reCallAPI,
  onUpdateTask,
  onSetFilterText,
}) => {
  const router = useRouter();
  const params = useParams();
  const { all } = params;

  let folder;
  let label;
  if (all.length === 2 && !+all[1] > 0) {
    label = all[1];
  } else if (all.length === 1) {
    folder = all[0];
  }

  const [isAddTaskOpen, setAddTaskOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);

  const onSelectDate = ({ start }) => {
    setSelectedDate(start);
    setAddTaskOpen(true);
  };

  const onOpenAddTask = (data) => {
    if (data) {
      onViewTaskDetail(data);
    } else {
      if (selectedDate) {
        setAddTaskOpen(true);
      } else {
        setAddTaskOpen(false);
      }
    }
  };
  const resizeEvent = ({ event, start, end }) => {
    onUpdateTask({ ...event, startDate: start, endDate: end });
  };

  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    onUpdateTask({ ...event, startDate: start, endDate: end });
  };

  const onViewTaskDetail = (task) => {
    if (folder) router.push(`/apps/calender/${folder}/${task.id}`);
    if (label) router.push(`/apps/calender/label/${label}/${task.id}`);
  };
  const getEvents = () => {
    if (taskList?.length > 0)
      return taskList.map((task) => {
        return {
          ...task,
          title: task.title,
          start: task.startDate,
          end: task.endDate,
        };
      });
    return [];
  };
  return (
    <DragAndDropCalendar
      localizer={localizer}
      events={getEvents()}
      themeVariant='dark'
      views={['month', 'agenda']}
      tooltipAccessor={null}
      showMultiDayTimes
      resizable
      onEventResize={resizeEvent}
      onEventDrop={moveEvent}
      onSelectEvent={onOpenAddTask}
      components={{
        toolbar: (props) => (
          <CustomToolbar onSetFilterText={onSetFilterText} {...props} />
        ),
        event: (item) => <TaskItem key={item.key} item={item.event} />,
      }}
      popup
      selectable
      onSelectSlot={onSelectDate}
      defaultView='month'
    />
  );
};
export default TaskCalender;
TaskCalender.propTypes = {
  taskList: PropTypes.any,
  onUpdateTask: PropTypes.func,
  onSetFilterText: PropTypes.func,
};
