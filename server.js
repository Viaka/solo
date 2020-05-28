var config = require("./config.json"),
	express = require("express"),
	routes = require("./routes.js"),
	dbs = require("./libs/connectDbs.js");
var http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const favicon = require('serve-favicon');
const logger = require('morgan');
var methodOverride = require('method-override');

//var user = require('./routes/user');
var path = require('path');
var session = require('express-session');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
//app.use(express.cookieParser());
app.use(methodOverride());

app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'uwotm8'
  }));

app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

//app.get('/', routes.index)
//app.get('/users', user.list)


dbs.connect(config.dbs, function(errs, clients){
	var db;
	if(errs){
		for(db in errs){
			console.log("Error: db[" + db + "] " + errs[db]);
		}
	}else{
		routes.load(app, clients);
		app.listen(config.server.port);
		console.log("App listening on port: " + config.server.port);
	}
});

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
	app.use(errorHandler())
  }
  
  var server = http.createServer(app)
  server.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'))
  })