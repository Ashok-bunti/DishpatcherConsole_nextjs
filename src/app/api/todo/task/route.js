import todoList from '@crema/fakedb/apps/todo/todoList';

let todoData = todoList;

export const PUT = async (request) => {
  try {
    const reqBody = await request.json();
    const { task } = reqBody;
    todoData = todoData.map((item) => (item.id === task.id ? task : item));
    return new Response(JSON.stringify({ data: task }), {
      status: 200,
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
};
