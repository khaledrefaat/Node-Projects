"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todos_controllers_1 = require("../controllers/todos-controllers");
const router = express_1.default.Router();
router.get('/', todos_controllers_1.getTodos);
router.post('/', todos_controllers_1.postTodos);
router.patch('/:id', todos_controllers_1.patchTodo);
router.delete('/:id', todos_controllers_1.deleteTodo);
exports.default = router;
