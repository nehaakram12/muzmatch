var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
	var db = req.con;
	var data = "";
	db.query('SELECT * FROM user',function(err,rows){
		//if(err) throw err;
		
		// console.log('Data received from Db:\n');
		console.log(rows);
		var data = rows;
		console.log("Outside--"+data.id);
		// res.render('gameIndex', { title: 'User Information', dataGet: data });
		res.json({ users: data });
	});
});

router.post('/login', function(req, res) {
	var db = req.con;
	var data = req.body;
	var passwordHash = require('password-hash');
	var hashedPassword = passwordHash.generate(data.password);
	// db.query("SELECT * FROM user where email='"+data.email+"' and password='"+hashedPassword+"'",function(err,rows){
			db.query("SELECT * FROM user where email='"+data.email+"' and password='"+hashedPassword+"'",function(err,rows){

		if(err)
			res.json({ success: false, message:"Some error occured. Unable to login"});
		var data = rows;
		if(data.length>0)
			res.json({ success: true, message:"User logged in successfully", user: data});
		else
			res.json({ success: false, message:"Wrong credentials. Unable to login", email: req.body.email, pass: hashedPassword});
	});
});


router.post('/signup', function(req, res) {
	var db = req.con;
	var data = req.body;
	var passwordHash = require('password-hash');
	var hashedPassword = passwordHash.generate(data.password);
	res.json({ user: data, pass: hashedPassword});
	var query="INSERT INTO user (`name`, `email`, `password`) VALUES ('" + data.name + "', '" + data.email + "', '" + hashedPassword + "');";
	db.query(query,data, function (error, results, fields) {
		// if (error) throw error;
		if(error)
			res.json({ success: false, message:"Some error occured. Unable to signup"});
		res.json({ success: true, message:"User created successfully", user: data});
	});
});




module.exports = router;
