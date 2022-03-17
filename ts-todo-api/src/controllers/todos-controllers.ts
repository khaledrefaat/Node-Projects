import { RequestHandler } from 'express';
import { nanoid } from 'nanoid';

import Todo from '../models/todo';

const todos: Todo[] = [
  {
    id: nanoid(),
    todo: 'Be a nyan cat, feel great about it',
  },
  {
    id: nanoid(),
    todo: 'be annoying 24/7 poop rainbows in litter box all day loved it',
  },
  {
    id: nanoid(),
    todo: 'hated it, loved it, hated it. Rub against owner because',
  },
];

export const getTodos: RequestHandler = (req, res, next) => {
  res.status(200).json(todos);
};

export const postTodos: RequestHandler = (req, res, next) => {
  const todo: string = req.body.todo;

  todos.push({
    id: nanoid(),
    todo,
  });
  res.status(200).json(todos);
};

export const deleteTodo: RequestHandler = (req, res, next) => {
  const id: string = req.params.id;
  const todoIndex = todos.findIndex(todo => todo.id === id);
  todos.splice(todoIndex, 1);
  console.log(todos);
  res.status(200).json(todos);
};

export const patchTodo: RequestHandler = (req, res, next) => {
  const id: string = req.params.id;
  const todo = req.body.todo;
  const todoIndex = todos.findIndex(todo => todo.id === id);
  todos[todoIndex].todo = todo;
  res.status(201).json(todos);
};
