var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var um = require('../controllers/user-manager.js');

module.exports = function (app) {
	// TODO: investigate why maxAge doesn't work.
	app.use(require('express-session')({ 
		name:'auth', 
		secret: 'keyboard cat',
		maxAge: 60000,
		resave: false, 
		saveUninitialized: false }));
	app.use(passport.initialize());
	app.use(passport.session());


	/**
	 * Configure the local strategy for use by Passport.
	 * 
	 * The local strategy requires a `verify` function which receives the credentials
	 * (`username` and `password`) submitted by the user. The function must verify that
	 * the password is correct and then invoke `cb` with a user object, which will be set 
	 * at `req.user` in route handlers after authentication.
	 */
	passport.use(new Strategy(function (username, password, cb) {
		console.log('passport.use.local-strategy...');
		console.log(um);
		um.findByUsername(username, function (err, user) {
			if (err) {
				return cb(err);
			}
			if (!user) {
				return cb(null, false);
			}
			if (user.password != password) 
			{
				return cb(null, false);
			}
			return cb(null, user);
		});
	}));

	/** 
	 * Configure Passport authenticated session persistence.
	 *
	 * In order to restore authentication state across HTTP requests, Passport needs
	 * to serialize users into and deserialize users out of the session.  The
	 * typical implementation of this is as simple as supplying the user ID when
	 * serializing, and querying the user record by ID from the database when
	 * deserializing.
	 */
	passport.serializeUser(function (user, cb) {
		console.log('serialize user...');
		cb(null, user._id);
	});

	passport.deserializeUser(function (id, cb) {
		console.log('deserialize user...');
		um.findById(id, function (err, user) {
			cb(null, user);
		});
	});



}