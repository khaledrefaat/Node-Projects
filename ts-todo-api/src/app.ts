import express from 'express';
import todos from './routes/todos-routes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', todos);

app.listen(9000);
