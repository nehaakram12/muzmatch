var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
	var db = req.con;
	var data = "";
	db.query('SELECT * FROM user',function(error,rows){
		//if(error) throw err;
		
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
	// var passwordHash = require('password-hash');
	// var hashedPassword = passwordHash.generate(data.password);
	// db.query("SELECT * FROM user where email='"+data.email+"' and password='"+hashedPassword+"'",function(err,rows){
		db.query("SELECT * FROM user where email='"+data.email+"' and password='"+data.password+"'",function(error,rows){

		if(error)
			res.json({ success: false, message:"Some error occured. Unable to login"});
		var data = rows;
		if(data.length>0)
			res.json({ success: true, message:"User logged in successfully", user: data});
		else
			res.json({ success: false, message:"Wrong credentials. Unable to login"});
	});
});


router.post('/signup', function(req, res) {
	var db = req.con;
	var data = req.body;
	// var passwordHash = require('password-hash');
	// var hashedPassword = passwordHash.generate(data.password);
	// res.json({ user: data, pass: hashedPassword});
	var query="INSERT INTO user (`name`, `email`, `password`) VALUES ('" + data.name + "', '" + data.email + "', '" + data.password + "');";
	db.query(query,data, function (error, results, fields) {
		// if (error) throw error;
		if(error)
			res.json({ success: false, message:"Some error occured. Unable to signup"});
		res.json({ success: true, message:"User created successfully", user: data});
	});
});

router.put('/updatepic',function(req, res){
    var db = req.con;
    var data = req.body;
    var query="UPDATE user SET thumbnail = '" + data.thumbnail + "' WHERE userId = '" + data.userId + "';";
    db.query(query,data, function (error, results, fields) {
            // if (error) throw error;
            if(error)
                res.json({ success: false, message:"Some error occured. Unable to update profile picture"});
            res.json({ success: true, message:"Profile Picture updated successfully", user: data});
    });
});

router.patch('/updateprofile', function(req, res){
	var db = req.con;
	var data = req.body;

	var query = "UPDATE user SET email = '" + data.email + "', password = '" + data.password + "', name = '" + data.name + "' WHERE userId = '" + data.userId + "';";
	// res.json({ myqyery: query});

	db.query(query,data, function (error, results, fields) {
		// var data = results;
		if(error)
			res.json({ success: false, message:"Some error occured. Unable to update profile"});
		res.json({ success: true, message:"Profile updated successfully", user: data});
	});
});

router.get('/retrieveFavorites/:id', function(req, res) {
	var db = req.con;
	var data=req.params;
	var query="SELECT * FROM favoritelist WHERE userid="+[req.params.id];
	// res.json({myquery: query});
	db.query(query,data,function(error,rows){
		var data = rows;
		if(error)
			res.json({ success: false, message:"Some error occured. Unable to retrieve favorites"});
		res.json({ success: true, message:"Favorites retrieved successfully successfully", favorites: data});
	});
});

router.delete('/removefav', function(req, res){
    var db = req.con;
    var data = req.body;
    var query = "DELETE FROM favoritelist WHERE userId='" + data.userId + "' and friendId='" + data.friendId + "';";
    db.query(query,data, function (error, results, fields) {
    		// if (error) throw error;
    		if(error)
    			res.json({ success: false, message:"Some error occured. Unable to remove user from favorites"});
    		res.json({ success: true, message:"User removed from favorites successfully", user: data});
    	});
});

router.post('/addfav', function(req, res){
    var db = req.con;
    var data = req.body;
    var query="INSERT INTO favoritelist (`userId`, `friendId`) VALUES ('" + data.userId + "', '" + data.friendId + "');";
    db.query(query,data, function (error, results, fields) {
    		// if (error) throw error;
    		if(error)
    			res.json({ success: false, message:"Some error occured. Unable to add to favorite"});
    		res.json({ success: true, message:"User added to favorites successfully", favorite: data});
    	});
});

router.get('/retrieveBlocked/:id', function(req, res) {
	var db = req.con;
	var data=req.params;
	var query="SELECT * FROM blocklist WHERE userid="+[req.params.id];
	// res.json({myquery: query});
	db.query(query,data,function(error,rows){
		var data = rows;
		if(error)
			res.json({ success: false, message:"Some error occured. Unable to retrieve blocked list"});
		res.json({ success: true, message:"BLocked List retrieved successfully", blocked: data});
	});
});

router.post('/blockuser', function(req, res, next) {
	var db = req.con;
	var data = req.body;
	var query="INSERT INTO blocklist (`userId`, `friendId`) VALUES ('" + data.userId + "', '" + data.friendId + "');";
    db.query(query,data, function (error, results, fields) {
            // if (error) throw error;
            if(error)
                res.json({ success: false, message:"Some error occured. Unable to block user"});
            res.json({ success: true, message:"User blocked successfully", user: data});
        });
});

router.delete('/unblockuser', function(req, res){
    var db = req.con;
    var data = req.body;
    var query = "DELETE FROM blocklist WHERE userId='" + data.userId + "' and friendId='" + data.friendId + "';"
    db.query(query,data, function (error, results, fields) {
    		// if (error) throw error;
    		if(error)
    			res.json({ success: false, message:"Some error occured. Unable to unblock user"});
    		res.json({ success: true, message:"User unblocked successfully", user: data});
    	});
});

router.get('/messagelist/:id', function(req, res) {
	var db = req.con;
	var data=req.params;
	var query="SELECT userId, friendId, count(friendId) as messages FROM message WHERE userid="+[req.params.id]+" group by friendId";
	db.query(query,data,function(error,rows){
		var data = rows;
		if(error)
			res.json({ success: false, message:"Some error occured. Unable to retrieve message list"});
		res.json({ success: true, message:"Message list retrieved successfully", user: data});
	});
});

router.get('/retrievemessage', function(req, res){
	var db = req.con;
	var data = req.body;
	var query = "select text from message WHERE userId = '" + data.userID + "', friendId = '" + data.friendId + "';";
	db.query(query,data, function (error, results, fields) {
		if(error)
			res.json({ success: false, message:"Some error occured. Unable to retrieve message"});
		res.json({ success: true, message:"Messages retrieved successfully", user: data});
	});
});

router.post('/sendmsg', function(req, res, next) {
	var db = req.con;
	var data = req.body;
	var query="INSERT INTO message (`message` ,`userId`, `friendId`) VALUES ('" + data.message + "' , '" + data.userId + "', '" + data.friendId + "');";
    db.query(query,data, function (error, results, fields) {
            if(error)
                res.json({ success: false, message:"Some error occured. Unable to send message"});
            res.json({ success: true, message:"Message sent successfully", user: data});
        });
});

router.get('/retrieveLikesDislikes/:id/:like', function(req, res) {
	var db = req.con;
	var data=req.params;
	var query="SELECT * FROM likedislikelist WHERE userid="+[req.params.id]+" and isLike="+[req.params.like];
	db.query(query,data,function(error,rows){
		var data = rows;
		if([req.params.like]==1)
		{
			if(error)
				res.json({ success: false, message:"Some error occured. Unable to retrieved likes list"});
			res.json({ success: true, message:"Users you have liked have been retrieved successfully", user: data});
		}
		else
		{
			if(error)
				res.json({ success: false, message:"Some error occured. Unable to retrieved dislikes list"});
			res.json({ success: true, message:"Users you have disliked have been retrieved successfully", user: data});
		}
	});
});

router.post('/likeDislikeProfile', function(req, res){
    var db = req.con;
    var data = req.body;
    var query="INSERT INTO likedislikelist (`userId`, `friendId`, `isLike`) VALUES ('" + data.userId + "', '" + data.friendId + "', '" + data.isLike + "');";
    db.query(query,data, function (error, results, fields) {
    		if(error)
    			res.json({ success: false, message:"Some error occured. Unable to like profile"});
    		res.json({ success: true, message:"Profile liked successfully", user: data});
    	});
});

router.delete('/deleteProfile', function(req, res){
    var db = req.con;
    var data = req.body;
    var query = "DELETE FROM user WHERE userId=" + data.userId;
    // res.json({myquery: query});
    db.query(query,data, function (error, results, fields) {
    		if(error)
    			res.json({ success: false, message:"Some error occured. Unable to delete profile"});
    		res.json({ success: true, message:"Profile deleted successfully", user: data});
    	});
});

router.get('/newsfeed/:id', function(req, res, next) {
	var db = req.params;
	var data = "";
	db.query('SELECT * FROM user',function(error,rows){
		//if(error) throw err;
		
		// console.log('Data received from Db:\n');
		console.log(rows);
		var data = rows;
		console.log("Outside--"+data.id);
		// res.render('gameIndex', { title: 'User Information', dataGet: data });
		res.json({ users: data });
	});
});

module.exports = router;
