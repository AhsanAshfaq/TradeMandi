import express, { static } from 'express';
import { join } from 'path';
import { Promise, connect } from 'mongoose';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { db } from './database/db';

// Connecting mongoDB
Promise = global.Promise;
connect(db, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

// Set up express js port
import studentRoute from './routes/student.route';
import userRoute from './routes/user.route';

const app = express();
app.use(json());
app.use(urlencoded({
  extended: false
}));
app.use(cors());

app.use(static(join(__dirname, 'dist/angular8-meanstack-angular-material')));


// RESTful API root
app.use('/api', studentRoute);
app.use('/api', userRoute);

app.listen(4000, () => {
  console.log('Connected to port ' + 4000)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Index Route
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/angular8-meanstack-angular-material/index.html'));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
