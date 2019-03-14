
const express = require('express');
const app = express();
const logger = require('morgan'); //request logger
let qstring = require('querystring')

const PORT = process.env.PORT || 80
const ROOT_DIR = '/public'; //root directory for our static pages
const API_KEY = 'b2c16b336590ae2417f0297c8d9b58b8'
let http = require('http')
let url = require('url')

//use morgan logger to keep request log files


//use morgan logger to keep request log files
app.use( logger('dev'));

//Middleware
app.use(function(req, res, next){
  console.log('-------------------------------');
  console.log('req.path: ', req.path);
  console.log('serving:' + __dirname + ROOT_DIR + req.path);
  next(); //allow next route or middleware to run
});
app.use(express.static(__dirname + ROOT_DIR)); //provide static server

//Routes
function getHandler (){
  app.get('/recipes.html', function (req,res){
    res.send('recipes.html')
  })
  app.get('/recipes', function(req,res){
    res.send('recipes')
  })
  app.get('/index.html', function(req,res){
    res.send('index.html')
  })
}





/*app.get('/' function(req,res){
    res.send('/')
})*/
function sendResponse(data, res){
  console.log("recipesData", data)
  var page = '<html><head><title>API Example</title></head>' +
    '<body>' +
    '<form method="post">' +
    'Recipes: <input name="ingredient"><br>' +
    '<input type="submit" value="Get Recipes">' +
    '</form>'
  if(data){
    page += '<h1>Recipes Info' + ' </h1><p>' + data +'</p>'
  }
  page += '</body></html>'
  res.end(page);
}

function parseRecipes(apiResponse, res) {
  let apiData = ''
  apiResponse.on('data', function (chunk) {
    apiData += chunk
  })
  apiResponse.on('end', function () {
    sendResponse(apiData, res)
  })
}

function getRecipes (ingredient, res){
//New as of 2015: you need to provide an appid with your request.
//Many API services now require that clients register for an app id.

//Make an HTTP GET request to the openweathermap API
  const options = {
    host: 'www.food2fork.com',
    path: `/api/search?q=${ingredient}&key=${API_KEY}`
  }
  http.request(options, function(apiResponse){
    parseRecipes(apiResponse, res)
  }).end()
}



//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {console.log(`Server listening on port: ${PORT}`)}
 })
