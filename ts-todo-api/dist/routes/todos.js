"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nanoid_1 = require("nanoid");
const router = express_1.default.Router();
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
    res.json(todos);
};
const postTodos = (req, res, next) => {
    const todo = req.body.todo;
    todos.push({
        id: (0, nanoid_1.nanoid)(),
        todo,
    });
    res.json(todos);
};
const deleteTodo = (req, res, next) => {
    const id = req.params.id;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    todos.splice(todoIndex, 1);
    console.log(todos);
    res.json(todos);
};
const patchTodo = (req, res, next) => {
    const id = req.params.id;
    const todo = req.body.todo;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    todos[todoIndex].todo = todo;
    res.json(todos);
};
router.get('/', getTodos);
router.post('/', postTodos);
router.patch('/:id', patchTodo);
router.delete('/:id', deleteTodo);
exports.default = router;
