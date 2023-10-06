const express =require('express')

const app=express()

const dotenv=require('dotenv').config()

const api=process.env.API_URL

const bodyParser=require('body-parser')

const morgan=require('morgan')

const { default: mongoose } = require('mongoose')

const Product=require('./models/product')

const productsRoute=require('./routes/products')

const cors=require('cors')

const authJwtt=require('./helpers/jwt')

const errorHandler=require('./helpers/error-handler')
const path=require('path')
//--------------------------------------------



// Origin Cors
app.use(cors())

app.options('*',cors())
// =====> MIDDLE WARE
app.use(morgan('tiny'))
app.use(bodyParser.json())

app.use(authJwtt());
app.use(errorHandler);
app.use('/public',express.static(path.join(__dirname,'/public')))
app.use('/routes',express.static(path.join(__dirname,'/routes')))
;;
// =======>  Routes 

const categoriesRoutes=require('./routes/categories')
const productsRoutes=require('./routes/products')
const usersRoutes=require('./routes/users')
const orderRoutes=require('./routes/orders')
const authJwt = require('./helpers/jwt')
const image=require('./routes/image')

app.use(image)
app.use(`${api}/categories`,categoriesRoutes)
app.use(`${api}/products`,productsRoute)
app.use(`${api}/users`,usersRoutes)
app.use(`${api}/orders`,orderRoutes)
;




// =====> MONGO DB
mongoose.connect(`${process.env.MONGO_DB_URL}`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:'eshop-database-express' 
}).then(()=>{
    console.log('MONGO_DB CONNECT')
}).catch(err=>console.log('error from the url or another reason'))
// =====> Listen 

app.listen(5555,()=>{
    console.log(api)
    console.log(' the app listen in the port 5555')
})