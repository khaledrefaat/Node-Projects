"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchTodo = exports.deleteTodo = exports.postTodos = exports.getTodos = void 0;
const nanoid_1 = require("nanoid");
const todos = [
    {
        id: (0, nanoid_1.nanoid)(),
        todo: 'Be a nyan cat, feel great about it',
    },
    {
        id: (0, nanoid_1.nanoid)(),
        todo: 'be annoying 24/7 poop rainbows in litter box all day loved it',
    },
    {
        id: (0, nanoid_1.nanoid)(),
        todo: 'hated it, loved it, hated it. Rub against owner because',
    },
];
const getTodos = (req, res, next) => {
    res.status(200).json(todos);
};
exports.getTodos = getTodos;
const postTodos = (req, res, next) => {
    const todo = req.body.todo;
    todos.push({
        id: (0, nanoid_1.nanoid)(),
        todo,
    });
    res.status(200).json(todos);
};
exports.postTodos = postTodos;
const deleteTodo = (req, res, next) => {
    const id = req.params.id;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    todos.splice(todoIndex, 1);
    console.log(todos);
    res.status(200).json(todos);
};
exports.deleteTodo = deleteTodo;
const patchTodo = (req, res, next) => {
    const id = req.params.id;
    const todo = req.body.todo;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    todos[todoIndex].todo = todo;
    res.status(201).json(todos);
};
exports.patchTodo = patchTodo;
