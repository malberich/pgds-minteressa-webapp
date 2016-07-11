var express    = require('express'),
	app        = express(),
	router     = express.Router({mergeParams: true}),
	mongoose   = require('mongoose'),
	UserModel  = require('./app/models/user'),
	passport   = require('./app/modules/passport'),
	bodyParser = require('body-parser'),
	port = process.env.port || 8080;

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')('replacemesoon'));
app.use(
	require('express-session')({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false
	})
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', express.static('webui'));

app.use('/api/users', require('./app/modules/users'));
app.use('/api/sessions', require('./app/modules/sessions'));

app.use('/api/topics', require('./app/modules/topics'));
app.use('/api/tweets', require('./app/modules/tweets'));
// app.use('/api/documents', require('./app/modules/documents'));

app.use('/auth', require('./app/modules/auth'));

// app.use('/monitor', require('./app/modules/monitor'));

mongoose.connect(
	'mongodb://' +
	(process.env.mongohost || '127.0.0.1') + ':' +
	(process.env.mongoport || '27017') + '/' +
	(process.env.mongodb   || 'minteressa')
); // connect to our database


app.listen(port);
