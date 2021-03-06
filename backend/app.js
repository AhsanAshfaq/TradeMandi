let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  dataBaseConfig = require('./database/db');

const studentRoute = require('./routes/student.route')
const userRoute = require('./routes/user.route')
const productRoute = require('./routes/product.route')
const customerRoute = require('./routes/customer.route')
const supplierRoute = require('./routes/supplier.route')
const purchaseRoute = require('./routes/purchase.route')
const saleRoute = require('./routes/sale.route')
const saleDetailRoute = require('./routes/saleDetail.route')

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

// Setting up static directory
app.use(express.static(path.join(__dirname, 'dist/angular8-meanstack-angular-material')));


// RESTful API root
app.use('/api', studentRoute)
app.use('/api', userRoute)
app.use('/api', productRoute)
app.use('/api', customerRoute)
app.use('/api', supplierRoute)
app.use('/api', purchaseRoute)
app.use('/api', saleRoute)
app.use('/api', saleDetailRoute)

const port = 4000;

app.listen(port, () => {
  console.log('Connected to port ' + port)
})
