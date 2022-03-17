import express from 'express';
import {
  getTodos,
  postTodos,
  patchTodo,
  deleteTodo,
} from '../controllers/todos-controllers';

const router = express.Router();

router.get('/', getTodos);

router.post('/', postTodos);

router.patch('/:id', patchTodo);

router.delete('/:id', deleteTodo);

export default router;
