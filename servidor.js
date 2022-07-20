const express = require('express');
const app = express();
const { Router } = express;
const router = Router();
const { Server: HttpServer } = require('http')
const httpServer = new HttpServer(app)
const PORT = process.env.PORT || 8080
const methodOverride = require("method-override");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs')

const homeRouter = require('./routes/home/homeRouter')
const pdfRouter = require('./routes/pdf/pdfRouter')


app.use('/', homeRouter)
app.use('/pdf', pdfRouter)



httpServer.listen(PORT, () => { console.log("Se inicio el servidor en el puerto N° " + PORT) }) 