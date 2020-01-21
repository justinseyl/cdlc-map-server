const moment        = require('moment');
const db            = require('../config/conn.js');
const async         = require("async");
const crypto        = require('crypto');
const nodemailer    = require('nodemailer');
const uuidv4 				= require('uuid/v4');
const bcrypt = require('bcrypt');

const salesid = 'sales@test';
const procid = 'processor@test';

module.exports = function(app, passport) {

		app.get('/', isLoggedIn, function(req, res) {
				let alertquery = "select title, description, county, state, created_at,status from ealerts order by created_at desc limit 1"
				let query = "select id, state,count(*) as num from tr_area where status = 'active' and manage = 'accepted' group by 2 order by case when state = '" + req.user.state + "' then 0 else state end";
				db.query(alertquery, (err, ares) => {
						db.query(query, (err, result) => {
								if (err) throw err;

								let date = moment(ares[0].created_at).format('MM/DD/YYYY');
								let time = moment(ares[0].created_at).format('HH:MM A');

								let route_map = {
										'admin': 'adminhome.ejs',
										'driver': 'driverhome.ejs',
										'sales': 'saleshome.ejs',
										'processor': 'processorhome.ejs'
								}

								if (req.user.role) {
										if (req.user.role == 'admin') {
												let query = "select id, description, state, county, date_format(created_at, '%m/%d/%y') as created, date_format(created_at, '%h:%i %p') as ctime, case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew, Upper(manage) as manage from " + "tr_area" + " where status = 'active' order by created_at desc";
												db.query(query, (err, result2) => {
														if (err) throw err;

														res.render(route_map[req.user.role], {
																user: req.user,
																page: 'Home',
																menuId: 'home',
																event: result2,
																statecode: req.user.state,
																groupstate: result,
																picker: 'DRIVER',
																menuitem: 'DRIVERS',
																router: 'drivers',
																alert: ares[0].description,
																date: date,
																time: time,
																state: ares[0].state.toUpperCase(),
																county: ares[0].county,
																showEmergency: ares[0].status
														});
												});
										} else {
												res.render(route_map[req.user.role], {
														user: req.user,
														page: 'Home',
														menuId: 'home',
														statecode: req.user.state,
														groupstate: result,
														picker: 'DRIVER',
														alert: ares[0].description,
														date: date,
														time: time,
														state: ares[0].state.toUpperCase(),
														county: ares[0].county,
														showEmergency: ares[0].status
												})
										}
								} else {
										res.render('home.ejs', {
												user: req.user,
												page: 'Home',
												menuId: 'home',
												statecode: req.user.state,
												groupstate: result,
												picker: 'DRIVER',
												alert: ares[0].description,
												date: date,
												time: time,
												state: ares[0].state.toUpperCase(),
												county: ares[0].county,
												showEmergency: ares[0].status
										});
								}
						});
				});
		});

		app.get('/edituser/:email', isLoggedIn, function(req, res) {
				let email = req.params.email;

				let query = "select first, last, state, email from users where email='" +email + "'" ;

				db.query(query, (err, result) => {

						let userinfo = result[0];
						let firstname = userinfo.first;
						let lastname = userinfo.last;
						let state = userinfo.state;
						let email = userinfo.email;
						let name = firstname + " " + lastname;

						let eventquery = "select id, state, county, description, date_format(created_at, '%m/%d/%y') as created,date_format(created_at, '%h:%i %p') as ctime, manage from tr_area where userid='" + email + "'";

						db.query(eventquery, (err, events) => {
								res.render('driverdetail.ejs', {
										user: req.user,
										page: 'Driver Detail',
										menuId: 'detail',
										event: events,
										picker: 'DRIVER',
										menuitem: 'DRIVERS',
										router: 'drivers',
										firstname: firstname,
										lastname: lastname,
										state: state,
										email: email,
										name: name
								});
						})
				})

		})

		app.get('/makeadmin/:email', isLoggedIn, function(req, res) {
				let email = req.params.email;

				let query = "update users set role='admin' where email='" +email + "'" ;

				db.query(query, (err, result) => {
						res.redirect('/drivers')
				})

		})

		app.post('/edit/:id', isLoggedIn, function(req, res) {
				let id = req.params.id;
				let data = req.body;
				let query = `update tr_area set county='${data.county}', description='${data.desc}',state='${data.state}' where id='${id}'` ;

				db.query(query, (err, result) => {
						res.redirect('/')
				})

		})

		app.get('/deleteevent/:id', isLoggedIn, function(req, res) {
				let id = req.params.id;
				let query = `update tr_area set status='inactive' where id='${id}'` ;

				db.query(query, (err, result) => {
						res.redirect('/')
				})

		})

		app.get('/accept/:id', isLoggedIn, function(req, res) {
				let id = req.params.id;

				let query = "update tr_area set manage='accepted' where id='" +id + "'" ;

				db.query(query, (err, result) => {
						res.redirect('/')
				})

		})

		app.get('/reject/:id', isLoggedIn, function(req, res) {
				let id = req.params.id;

				let query = "update tr_area set manage='denied' where id='" +id + "'" ;

				db.query(query, (err, result) => {
						res.redirect('/')
				})

		})

		app.get('/adminhome/:role', isLoggedIn, function(req, res) {
				let alertquery = "select title, description, county, state, created_at,status from ealerts order by created_at desc limit 1"
				let query = "select id, state,count(*) as num from tr_area where status = 'active' and manage = 'accepted' group by 1 order by case when state = '" + req.user.state + "' then 0 else state end";

				db.query(alertquery, (err, ares) => {
				db.query(query, (err, result) => {
						if (err) throw err;

						let date = moment(ares[0].created_at).format('MM/DD/YYYY');
						let time = moment(ares[0].created_at).format('HH:MM A');

						let role = req.params.role;

						let route_map = {
								'admin': 'adminhome.ejs',
								'driver': 'driverhome.ejs',
								'sales': 'saleshome.ejs',
								'processor': 'processorhome.ejs'
						}

						let dbs = {
								'driver': 'tr_area',
								'sales': 'tr_area_sales',
								'processor': 'tr_area_processor'
						}

						if (req.user.role) {
								if (req.user.role == 'admin') {
										let query = "select id, description, state, county, date_format(created_at, '%m/%d/%y') as created, date_format(created_at, '%h:%i %p') as ctime, case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew, Upper(manage) as manage from " + dbs[role] + " where status = 'active' order by created_at desc";
										db.query(query, (err, result2) => {
												if (err) throw err;

												let mitem = 'DRIVERS'
												let route = 'drivers'

												if (role != 'driver')
														mitem = 'PROFILE'

												if (role == 'sales')
														route = 'profile/sales'
												if (role == 'processor')
														route = 'profile/processor'

												res.render(route_map[req.user.role], {
														user: req.user,
														page: 'Home',
														menuId: 'home',
														event: result2,
														statecode: req.user.state,
														groupstate: result,
														picker: role.toUpperCase(),
														menuitem: mitem,
														router: route,
														alert: ares[0].description,
														date: date,
														time: time,
														county: ares[0].county,
														state: ares[0].state.toUpperCase(),
														county: ares[0].county,
														showEmergency: ares[0].status
												});
										});
								} else {
										res.render(route_map[req.user.role], {
												user: req.user,
												page: 'Home',
												menuId: 'home',
												statecode: req.user.state,
												groupstate: result,
												picker: 'driver',
												alert: ares[0].description,
												date: date,
												time: time,
												state: ares[0].state.toUpperCase(),
												county: ares[0].county,
												showEmergency: ares[0].status
										})
								}
						} else {
								res.render('home.ejs', {
										user: req.user,
										page: 'Home',
										menuId: 'home',
										statecode: req.user.state,
										groupstate: result,
										picker: 'driver',
										alert: ares[0].description,
										date: date,
										time: time,
										state: ares[0].state.toUpperCase(),
										county: ares[0].county,
										showEmergency: ares[0].status
								});
						}
				});
				});
		})

		app.get('/login', function(req, res) {
				res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		app.post('/login',
			passport.authenticate('local-login', { failureRedirect: '/login', failureFlash: true }),
			function(req, res, next) {
					if (!req.body.remember_me) { return next(); }

			},
			function(req, res) {
					res.redirect('/');
			});

		app.get('/signup', function(req, res) {
				res.render('signup.ejs', { message: req.flash('signupMessage') });
		});

		app.post('/signup', passport.authenticate('local-signup', { failureRedirect : '/signup', failureFlash : true }),
			function(req, res) {
					res.redirect('/');
			});

		app.get('/profile', isLoggedIn, function(req, res) {

				let role = 'driver';
				let setstate = '';

				if (req.user.role) {
						role = req.user.role
				}

				let route_map = {
						'admin': 'adminprofile.ejs',
						'driver': 'profile.ejs',
						'sales'  : 'salesprofile.ejs',
						'processor': 'processorprofile.ejs'
				}

				if (role == 'sales') {
					let q = "select state from users where email = '" + salesid + "'";

					db.query(q, (err, result) => {
						if (!err) {setstate = result[0].state;}
						res.render(route_map[role], {
								user : req.user,
								page:'My Profile',
								menuId:'profile',
								picker: 'DRIVER',
								menuitem: 'DRIVERS',
								router: 'drivers',
								state: setstate
						});
					});
				} else if (role == 'processor') {
					let q = "select state from users where email = '" + procid + "'";

					db.query(q, (err, result) => {
						if (!err) {setstate = result[0].state;}
						res.render(route_map[role], {
								user : req.user,
								page:'My Profile',
								menuId:'profile',
								picker: 'DRIVER',
								menuitem: 'DRIVERS',
								router: 'drivers',
								state: setstate
						});
					});
				} else {
					res.render(route_map[role], {
							user : req.user,
							page:'My Profile',
							menuId:'profile',
							picker: 'DRIVER',
							menuitem: 'DRIVERS',
							router: 'drivers'
					});
				}
		});

		app.post('/profile', isLoggedIn, function(req, res) {
				let data = req.body;

				let query1 = "update users set first='" + data.first + "', last='" + data.last + "',email='" + data.email + "', state='" + data.state + "' where email='" + data.email +"'";

				db.query(query1, (err, result) => {
						res.redirect('/')
				})

		});

		app.get('/alerts', isLoggedIn, function(req, res) {

				let query = "select id, title, description, county, state, created_at,status from ealerts order by created_at desc limit 1";
				db.query(query, (err, result) => {

						let rtn = result[0];

						res.render('emergency.ejs', {
								user: req.user,
								page: 'Emergency Alerts',
								menuId: 'emergency',
								picker: 'DRIVER',
								menuitem: 'DRIVERS',
								router: 'drivers',
								title: rtn.title,
								state: rtn.state,
								county: rtn.county,
								description: rtn.description,
								showEmergency: rtn.status,
								emergencyId: rtn.id
						});
				});
		});

		app.get('/profile/sales', isLoggedIn, function(req, res) {

				let query = "select * from users where email='sales@test' ";
				db.query(query, (err, result) => {

						res.render('salesadminprofile.ejs', {
								user: result[0],
								page: 'My Profile',
								menuId: 'profile',
								picker: 'SALES',
								menuitem: 'PROFILE',
								router: 'profile/sales'
						});
				});
		});

		app.get('/profile/processor', isLoggedIn, function(req, res) {

				let query = "select * from users where email = 'processor@test'";
				db.query(query, (err, result) => {

						res.render('processoradminprofile.ejs', {
								user:result[0],
								page: 'My Profile',
								menuId: 'profile',
								picker: 'PROCESSOR',
								menuitem: 'PROFILE',
								router: 'profile/processor'
						});
				});
		});

		app.get('/events', isLoggedIn, function(req, res) {

				let role = 'driver';

				if (req.user.role) {
						role = req.user.role
				}

				let route_map = {
						'admin': 'adminevents.ejs',
						'driver': 'events.ejs',
						'sales'  : 'salesevents.ejs',
						'processor': 'processorevents.ejs'
				}

				let dbs = {
						'driver': 'tr_area',
						'sales'  : 'tr_area_sales',
						'processor': 'tr_area_processor'
				}

				let query = ''
				if (role == 'sales') {
						query = "select  id, description, saleprice, state, county, date_format(created_at, '%m/%d/%y') as created, date_format(created_at, '%h:%i %p') as ctime, case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew, Upper(manage) as manage from " + dbs[role] + " where status = 'active' and userid = '" + req.user.email + "' order by created_at desc";
				} else if (role == 'processor') {
						query = "select id, attorneyname, fee, address, email, fax, description, state, county, date_format(created_at, '%m/%d/%y') as created, date_format(created_at, '%h:%i %p') as ctime, case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew, Upper(manage) as manage from " + dbs[role] + " where status = 'active' and userid = '" + req.user.email + "' order by created_at desc";
				} else {
						query = "select id, description, state, county, date_format(created_at, '%m/%d/%y') as created, date_format(created_at, '%h:%i %p') as ctime, case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew, Upper(manage) as manage from " + dbs[role] + " where status = 'active' and userid = '" + req.user.email + "' order by created_at desc";
				}

				db.query(query, (err, result) => {
						if (err) throw err;

						res.render(route_map[role], {
								user : req.user,
								page:'My Events',
								menuId:'events',
								event: result,
								statecode: req.user.state,
								picker: role.toUpperCase(),
								menuitem: 'PROFILE',
								router: role.toUpperCase()
						});
				});
		});

		app.get('/drivers', isLoggedIn, function(req, res) {
				let query = "select concat(u.first,' ',u.last) as name, u.email as email, u.state as state,(select count(*) from tr_area t where t.status = 'active' and t.userid = u.email and t.manage='accepted') as accept,(select count(*) from tr_area t where t.status = 'active' and t.userid = u.email and t.manage='pending') as pending,(select count(*) from tr_area t where t.status = 'active' and t.userid = u.email and t.manage='denied') as denied from users u where u.role IS NULL and u.status = 'active'";
				db.query(query, (err, result) => {
						if (err) throw err;

						res.render('drivers.ejs', {
								user : req.user,
								page:'drivers',
								menuId:'drivers',
								event: result,
								picker: 'DRIVER',
								menuitem: 'DRIVERS',
								router: 'drivers'
						});
				});
		});

		app.get('/notifications', isLoggedIn, function(req, res) {

				let role = 'driver';
				if (req.user.role)
					role = req.user.role;
				let route_map = {
						'admin': 'adminnoti.ejs',
						'driver': 'drivernoti.ejs',
						'sales'  : 'salesnoti.ejs',
						'processor': 'processornoti.ejs'
				}

				let query = "select title, description, Concat(DATEDIFF(Now(),created_at),' Days Ago') as time,Concat('+',DATEDIFF(Now(),created_at)) as mobiletime,case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew from ealerts order by created_at desc";
				db.query(query, (err, result) => {
						if (err) throw err;

						res.render(route_map[role], {
								user : req.user,
								page:'drivers',
								menuId:'drivers',
								event: result,
								picker: 'DRIVER',
								menuitem: 'DRIVERS',
								router: 'drivers'
						});
				});
		});

		app.get('/deleteuser/:email', isLoggedIn, function(req, res) {
				let query = "DELETE FROM users where email='" + req.params.email + "'";

				db.query(query, (err, result) => {
						res.redirect('/drivers')
				})
		})

		app.post('/submitEmergency', function(req, res, next){

						let query = "insert into " + "ealerts" + " (id,state,county,description,created_at,status,title) values ('" + uuidv4() + "','" + req.body.state + "','" + req.body.county + "','" + req.body.description + "','" + moment().format("YYYY-MM-DD HH:mm:ss") + "','active','" + req.body.title + "')";
						db.query(query, (err, result) => {
								if (err) throw err;

								res.redirect('/alerts');
						});
		});

		app.post('/submitNewTrouble', function(req, res, next){

				let role = 'driver'
				if (req.user.role)
						role = req.user.role;

				if (req.query.db) {
						role = req.query.db;
				}

				let dbs = {
						'driver': 'tr_area',
						'sales'  : 'tr_area_sales',
						'processor': 'tr_area_processor'
				}
				let query = '';
				if (role == 'sales') {
						query = "insert into " + dbs[role] + " (id,state,county,description,created_at,status,userid,manage, saleprice) values ('" + uuidv4() + "','" + req.body.state + "','" + req.body.county + "','" + req.body.description + "','" + moment().format("YYYY-MM-DD HH:mm:ss") + "','active','" + req.user.email + "','pending','" + req.body.salesprice + "')";
				} else if (role == 'processor') {
						query = "insert into " + dbs[role] + " (id,state,county,description,created_at,status,userid,manage, attorneyname, fee, fax, address, email) values ('" + uuidv4() + "','" + req.body.state + "','" + req.body.county + "','" + req.body.description + "','" + moment().format("YYYY-MM-DD HH:mm:ss") + "','active','" + req.user.email + "','pending','" + req.body.attorneyname + "','" + req.body.fee + "','" + req.body.fax + "','" + req.body.address + "','" + req.body.email +  "')";
				} else {
						query = "insert into " + dbs[role] + " (id,state,county,description,created_at,status,userid,manage) values ('" + uuidv4() + "','" + req.body.state + "','" + req.body.county + "','" + req.body.description + "','" + moment().format("YYYY-MM-DD HH:mm:ss") + "','active','" + req.user.email + "','pending')";
				}

				db.query(query, (err, result) => {
						if (err) throw err;

						// res.redirect('/county_table/' + req.body.state + '/' + req.body.county);
						res.redirect('/events');
				});
		});

		app.get('/getCountyByState', function(req, res, next){
				let state = req.query.state;
				let query = "select Upper(county) as county,count(*) as num from tr_area where status = 'active' and manage = 'accepted' and state = '" + state + "' group by 1 order by 1";

				db.query(query, (err, rescty) => {
						if (err) throw err;

						res.send(rescty);
				});
		});

		app.get('/getevent/:id', function(req, res, next){
				let id = req.params.id;
				let role = 'driver';

				if (req.query.role) {
						role = req.query.role;
				}

				let dbs = {
						'driver': 'tr_area',
						'sales'  : 'tr_area_sales',
						'processor': 'tr_area_processor'
				}
				// let table = req.query.table;

				let query = `select id, manage, state, description, county, date_format(created_at, '%m/%d/%y') as date, date_format(created_at, '%h:%m') as time, userid  from ${dbs[role.toLowerCase()]} where id = '${id}'`;

				db.query(query, (err, result) => {
						if (err) throw err;

						res.send(result);
				});
		});

		app.get('/county_table/:state/:county', function(req, res) {
				let role = 'driver';
				let pick = 'DRIVER';

				if (req.query.picker)
						pick = req.query.picker;

				if (req.user.role) {
					role = req.user.role
				}
				let dbs = {
						'driver': 'tr_area',
						'sales'  : 'tr_area_sales',
						'processor': 'tr_area_processor',
						'admin': 'tr_area'
				}

				let dbchoice = dbs[role];
				if (req.query.picker)
						dbchoice = dbs[req.query.picker]

				let route_map = {
						'driver': 'county_table.ejs',
						'sales'  : 'sales_county_table.ejs',
						'processor': 'processor_county_table.ejs',
						'admin': 'admin_county_table.ejs'
				}

				let query = "select id, description, state, county, date_format(created_at, '%m/%d/%y') as created, date_format(created_at, '%h:%i %p') as ctime, case when created_at >= date_sub(Now(), interval 1 day) then 'new' end as isnew from " + dbchoice + " where status = 'active' and manage = 'accepted' and state = '" + req.params.state + "' and county = '" + req.params.county + "' order by created_at desc";
				db.query(query, (err, result) => {
						if (err) throw err;

						res.render(route_map[role], {
								user : req.user,
								page:'Home',
								menuId:'home',
								formdata: result,
								picker: pick.toUpperCase(),
								router: 'drivers',
								menuitem: 'DRIVERS',
								state: req.params.state,
								county: req.params.county
						});
				});
		});

		app.get('/reset/:token', function(req, res) {

				let checkToken = "select * from users where resetPasswordToken = '" + req.params.token + "' and resetPasswordExpires >= Now()";

				db.query(checkToken, (err, result) => {
						if (err) return done(err);

						if (result.length <= 0) {
								req.flash('error', 'Password reset token is invalid or has expired.');
								return res.redirect('/forgot');
						} else {
								res.render('reset', {
										user: req.user,
										token: req.params.token
								});
						}
				});
		});

		app.post('/reset/:token', function(req, res) {
				async.waterfall([
						function(done) {

								let checkToken = "select * from users where resetPasswordToken = '" + req.params.token + "' and resetPasswordExpires >= Now()";

								db.query(checkToken, (err, result) => {
										if (err) return done(err);

										if (result.length <= 0) {
												req.flash('error', 'Password reset token is invalid or has expired.');
												return res.redirect('back');
										} else {
												if (req.body.password != req.body.confirmPassword) {
														return done(null, false, req.flash('error', 'Your passwords do not match.'));
												} else {
														var user = result[0].email;

														bcrypt.hash(req.body.password, 10, function(err, hash) {
																let queryAdd = "update users set password = '" + hash + "',resetPasswordToken = null, resetPasswordExpires = null where email = '" + user + "'";

																db.query(queryAdd, (err, result) => {
																		if (err) return done(err);

																		return done(null, user);
																});
														});
												}
										}
								});
						},
						function(user, done) {
								var smtpTransport = nodemailer.createTransport({
										host: 'a2plcpnl0602.prod.iad2.secureserver.net',
										port: 465,
										secure: true,
										auth: {
												user: 'automated@cdlchappiness.com',
												pass: '38{jr7E{4NJ{'
										}
								});
								var mailOptions = {
										to: user,
										from: 'passwordreset@demo.com',
										subject: 'Your password has been changed',
										text: 'Hello,\n\n' +
											'This is a confirmation that the password for your account ' + user + ' has just been changed.\n'
								};
								smtpTransport.sendMail(mailOptions, function(err) {
										req.flash('success', 'Success! Your password has been changed.');
										done(err);
								});
						}
				], function(err) {
						res.redirect('/');
				});
		});

		app.get('/deleteaccount', function(req, res) {

				let email = req.user.email;

				let query = "DELETE FROM users where email='" +email + "'";

				db.query(query, (err, result) => {
						req.logout();
						res.redirect('/');
				})

		});

		app.get('/deacAlert', function(req, res) {

				let query = "update ealerts set status = 'inactive'";

				db.query(query, (err, result) => {
						res.redirect('/alerts');
				})

		});

		app.get('/forgot', function(req, res) {
				res.render('forgot', {
						user: req.user,
						message: req.flash('success'),
						errMessage: req.flash('error')
				});
		});

		app.post('/forgot', function(req, res, next) {
				async.waterfall([
						function(done) {
								crypto.randomBytes(20, function(err, buf) {
										var token = buf.toString('hex');
										done(err, token);
								});
						},
						function(token, done) {

								let queryLogin = "select * from users where email = '" + req.body.email + "'";

								db.query(queryLogin, (err, result) => {
										if (err) return done(err);

										if (result.length <= 0) {
												req.flash('error', 'No account with that email address exists.');
												return res.redirect('/forgot');
										} else {
												var user = result[0].email;

												let updateTemp = "update users set resetPasswordToken = '" + token + "',resetPasswordExpires = '" + moment().add(12, 'hours').format("YYYY-MM-DD HH:mm:ss") + "' where email = '" + user + "'";

												db.query(updateTemp, (err, result) => {
														if (err) return done(err);

														done(err, token, user);
												});
										}
								});
						},
						function(token, user, done) {
								var smtpTransport = nodemailer.createTransport({
										host: 'a2plcpnl0602.prod.iad2.secureserver.net',
										port: 465,
										secure: true,
										auth: {
												user: 'automated@cdlchappiness.com',
												pass: '38{jr7E{4NJ{'
										}
								});
								var mailOptions = {
										to: user,
										from: 'automated@cdlchappiness.com',
										subject: 'Node.js Password Reset',
										text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
											'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
											'http://' + req.headers.host + '/reset/' + token + '\n\n' +
											'If you did not request this, please ignore this email and your password will remain unchanged.\n'
								};
								smtpTransport.sendMail(mailOptions, function(err) {
										req.flash('success', 'An e-mail has been sent to ' + user + ' with further instructions.');
										done(err, 'done');
								});
						}
				], function(err) {
						if (err) return next(err);
						res.redirect('/forgot');
				});
		});

		app.get('/logout', function(req, res) {
				req.logout();
				res.redirect('/');
		});
};

function isLoggedIn(req, res, next) {

		if (req.isAuthenticated())
				return next();

		res.redirect('/login');
}
