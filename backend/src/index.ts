//  "exec": "node --inspect  --loader ts-node/esm src/index.ts"
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routers/authRouter.ts';
import userRouter from './routers/userRouter.ts';
import { urlencoded } from 'express';
import { createServer } from 'http';
import { initSocketServer } from './lib/socket/socket.ts';
import { checkDB } from './lib/db.ts';
import { checkSessionExpiry } from './lib/helpers.ts';
import { authorizeUser } from './middleware/auth-middleware.ts';

const app = express();
export const server = createServer(app);
app.use(urlencoded({ extended: true })); // parsed  requests bodies .
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json()); // parses json bodies
app.use('/auth', authRouter);
app.use('/user', authorizeUser, userRouter);
const port = process.env.port || 3333;
const intervalId = checkSessionExpiry(); // this will delete expired user sessions every 5 minutes

process.on('SIGTERM', () => {
  console.log('shutting down server...');
  clearInterval(intervalId);
});
console.log('getActiveResourcesInfo()', process.getActiveResourcesInfo());
server.listen(port, () => {
  checkDB();
  initSocketServer(server);
  console.log('server is listening on  http://localhost:3333');
});
