import express from "express"
import bodyParser from "body-parser"
import helmet from 'helmet'
import cors from "cors"
import  users  from './users/users.js'
import  photo  from './users/users.js'
import  video  from './users/users.js'
import  UsersById  from './users/users.js'
import register from './register/register.js';
import getdate from "./date/date.js"
import test from './register/register.js'
import login from './login/login.js'
import logout from './logout/logout.js'
import asking from './ask/ask.js'
import checkAuth from  './login/login.js'
import revoke from './logout/logout.js'
import * as dotenv from 'dotenv'
dotenv.config() 

const app = express();
const PORT = process.env.PORT || 8005
// const allowedOrigins = ['https://hug-qr.space', 'https://ef-wallet.com'];

// const corsOptions = {
//   origin: allowedOrigins,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }


app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const checkOrigin = (req, res, next) => {
//   const requestOrigin = req.headers.origin;

//   if (allowedOrigins.includes(requestOrigin)) {
//     res.setHeader('Access-Control-Allow-Origin', requestOrigin);
//     next();
//   } else {
//     res.status(403).json({ message: 'Forbidden' });
//   }
// };


app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

// app.get('*', checkOrigin);
// app.post('*', checkOrigin);

app.use('/getdate', getdate)
app.use('/users', users)
app.use('/user/:id', UsersById)
app.use('/ask', asking)
app.use('/photo', photo)
app.use('/video', video)
app.use('/register', register)
app.use('/test', test)
app.use('/login', login)
app.use('/logout', logout)
app.use('/check-authentication', checkAuth)
app.use('/check-token-revocation', revoke)




