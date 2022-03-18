import cookieSession from 'cookie-session';
import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({ keys: ['!!Lc/,!b4Sn!&C)x'] }));

import authRoutes from './routes/authRoutes';

app.use('/auth', authRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.session!.isLoggedIn) {
    return next();
  }
  res.status(203).redirect('/auth/login');
});

app.use('/', (req: Request, res: Response) => {
  return res.send(
    `<div><h1 style="text-align: center">This is App Root Dir</h1>
        <a href="/auth/logout">LogOut</a>
      </div>`
  );
});

app.listen(9000);
