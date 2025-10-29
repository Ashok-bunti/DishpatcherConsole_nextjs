import todoList from '@crema/fakedb/apps/todo/todoList';

let todoData = todoList;

export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { taskIds, status } = reqBody;

    todoData = todoData.map((task) => {
      if (taskIds.includes(task.id)) {
        task.isStarred = !!status;
        return task;
      } else {
        return task;
      }
    });
    const updatedTasks = todoData.filter((task) => taskIds.includes(task.id));

    return new Response(JSON.stringify({ data: updatedTasks }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
