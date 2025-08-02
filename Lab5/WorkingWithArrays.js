let todos = [
  { id: 1, title: 'Task 1', completed: false },
  { id: 2, title: 'Task 2', completed: true },
  { id: 3, title: 'Task 3', completed: false },
  { id: 4, title: 'Task 4', completed: true },
];

const resetTodos = () => {
  todos = [
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true },
    { id: 3, title: 'Task 3', completed: false },
    { id: 4, title: 'Task 4', completed: true },
  ];
};
export default function WorkingWithArrays(app) {
  const getTodos = (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === 'true';
      const completedTodos = todos.filter((t) => t.completed === completedBool);
      res.json(completedTodos);
      return;
    }
    res.json(todos);
  };

  const createNewTodo = (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: 'New Task',
      completed: false,
    };
    todos.push(newTodo);
    res.json(todos);
  };

  const postNewTodo = (req, res) => {
    const newTodo = { ...req.body, id: new Date().getTime() }; // The server adds the id
    todos.push(newTodo);
    res.json(newTodo);
  };
  // Why do we let the server add the id? See the note.

  const getTodoById = (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  };

  const removeTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    todos.splice(todoIndex, 1);
    res.json(todos);
  };

  const updateTodoTitle = (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    todo.title = title;
    res.json(todos);
  };

  const updateTodoCompleted = (req, res) => {
    const { id, completed } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    todo.completed = completed === 'true';
    res.json(todos);
  };

  const updateTodoDescription = (req, res) => {
    const { id, description } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    todo.description = description;
    res.json(todos);
  };

  app.get('/lab5/todos/reset', (req, res) => {
    resetTodos();
    res.json(todos);
  });
  app.get('/lab5/todos/:id/delete', removeTodo);
  app.get('/lab5/todos/:id/title/:title', updateTodoTitle);
  app.get('/lab5/todos/:id/completed/:completed', updateTodoCompleted);
  app.get('/lab5/todos/:id/description/:description', updateTodoDescription);
  // Express routes are matched in the order they’re defined—from top to bottom. The first matching route “wins,” and the rest are ignored. As a rule of thumb, more specific routes should be placed before more general or catch-all routes; otherwise, some requests may never reach the correct handler.
  app.get('/lab5/todos/create', createNewTodo); // make sure to implement this BEFORE the /lab5/todos/:id
  app.post('/lab5/todos', postNewTodo);
  app.get('/lab5/todos', getTodos);
  app.get('/lab5/todos/:id', getTodoById);
}
