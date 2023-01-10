const express=require('express');
const cors=require('cors');
const connection=require('./connections');
const UserRoute=require('./routes/userroute');
const categoryrouter= require('./routes/category');
const productroute=require('./routes/product');
const billRoute = require('./routes/bill');
const dashboardroute= require('./routes/dashboard');
const app=express();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/sers',UserRoute);
app.use('/category',categoryrouter);
app.use('/product',productroute);
app.use('/bill',billRoute);
app.use('/dashboard',dashboardroute);

module.exports=app;