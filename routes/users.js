var express = require('express');
const wrap = require('async-middleware').wrap;
var router = express.Router();

/* GET users listing. */
router.get('/list', function(req, res, next) {
	var db = req.con;
	var data = "";
	db.query('SELECT * FROM user',function(error,rows){
		if(error)
		{
			res.json({ code: 404, success: false, message:"Some error occured. Unable to login"});
		}
		else{
			var data = rows;
			// res.render('gameIndex', { title: 'User Information', dataGet: data });
			res.json({ code: 101, success: true, users: data });
		}
	});
});

router.post('/login', function(req, res) {
	var db = req.con;
	var data = req.body;
	// var passwordHash = require('password-hash');
	// var hashedPassword = passwordHash.generate(data.password);
	// db.query("SELECT * FROM user where email='"+data.email+"' and password='"+hashedPassword+"'",function(err,rows){
	db.query("SELECT u.userId, u.email, u.name, u.thumbnail, p.bio, p.cover, p.profession, p.religion, p.dob FROM user u inner join profiledetail p on u.userId=p.userId where email='"+data.email+"' and password='"+data.password+"'",function(error,rows){
		if(error)
			res.json({ code: 404, success: false, message:"Some error occured. Unable to login"});
		else{
			var data = rows;
			if(data.length>0)
			{
				res.json({ code: 101, success: true, message:"User logged in successfully", user: data});
			}
			else
				res.json({ code: 420, success: false, message:"Wrong credentials. Unable to login"});
		}
	});
});


router.post('/signup', wrap(function (req, res){
  var db = req.con;
  var data = req.body;
  // res.json({ query: data});

  // var passwordHash = require('password-hash');
  // var hashedPassword = passwordHash.generate(data.password);
  // res.json({ user: data, pass: hashedPassword});
  var query="INSERT INTO user (`name`, `email`, `password`) VALUES ('" + data.name + "', '" + data.email + "', '" + data.password + "');";
  var userid=null;
  db.query(query,data, function (error, results, fields) {
  	// if (error) throw error;
  	if(error)
  	{
  		res.json({ code: 420, success: false, message:"Some error occured. Unable to signup"});
  	}
  	else{
  		userid=results.insertId;
  		var query="INSERT INTO profiledetail (`userid`) VALUES ('" + userid + "');";
  		db.query(query,data, function (error, results, fields) {
  			// if (error) throw error;
  			if(error)
  				res.json({ code: 420, success: false, message:"Some error occured. Unable to signup"});
  			else{
  				data.userId=userid;
  				// req.session.user = data;
  				// req.session.authStatus = 'loggedIn';
  				// res.redirect('/profile');
  				res.json({ code: 101, success: true, message:"User created successfully", user: data});
  			}
  		});
  	}
  });
}))

router.put('/updatepic',function(req, res){
    var db = req.con;
    var data = req.body;
    var query="UPDATE user SET thumbnail = '" + data.thumbnail + "' WHERE userId = '" + data.userId + "';";
    db.query(query,data, function (error, results, fields) {
            // if (error) throw error;
            if(error)
                res.json({ code: 420, success: false, message:"Some error occured. Unable to update profile picture"});
            res.json({ code: 101, success: true, message:"Profile Picture updated successfully", user: data});
    });
});


router.post('/updatepassword',function(req, res){
    var db = req.con;
    var data = req.body;
    var query="SELECT * FROM user where userid='"+data.userId+"' and password='"+data.oldpassword+"'";
    db.query(query,function(error,rows){
    if(error)
      res.json({ code: 420, success: false, message:"Some error occured. Unable to update password"});
    else{
      var data = rows;
      if(data.length>0)
      {
        var query="UPDATE user SET password = '" + data.newpassword + "' WHERE userId = '" + data.userId + "';";
        db.query(query,data, function (error, results, fields) {
                // if (error) throw error;
                if(error)
                    res.json({ code: 404, success: false, message:"Some error occured. Unable to update password"});
                else{
                	res.json({ code: 101, success: true, message:"Password updated successfully", user: data});
                  // res.render('profile', { code: 101, success: true, message:"Password updated successfully", user: data});
                }
        });
      }
      else
      {
      	res.json({ code: 420, success: false, message:"Wrong credentials. Try again", user: data});
        // res.render('profile', { code: 420, success: false, message:"Wrong credentials. Try again", user: data});
      }
    }
    });
});

router.patch('/updateprofile', function(req, res){
	var db = req.con;
	var data = req.body;
	// var bio=data.bio,cover=data.cover,ethnicity=data.ethnicity,religion=data.religion,profession=data.profession,dob=data.dob,sect=data.sect;
	var user={};
	user.bio=data.bio;user.cover=data.cover;user.ethnicity=data.ethnicity;user.religion=data.religion;user.profession=data.profession;user.dob=data.dob;user.sect=data.sect;
	user.userId=data.userId;
	for (var property in user) {
	    if (typeof(user[property]) === 'undefined') 
		{ user[property]=null; }
	}
	var params=[user.bio,user.cover,user.ethnicity,user.religion,user.profession,user.dob,user.sect,user.userId];
	var query = "UPDATE profiledetail SET bio = ifNull(?,bio), cover = ifNull(?,cover), ethnicity = ifNull(?,ethnicity), religion = ifNull(?,religion), profession = ifNull(?,profession), dob = ifNull(?,dob), sect = ifNull(?,sect) WHERE userId = ?;";
	var myuser=[];
	myuser.push(data);
	db.query(query,params, function (error, results, fields) {
		// var data = results;
		if(error){
			res.json({ code: 420, success: false, message:"Some error occured. Unable to update profile", error: error});
		}
		else
		{
			db.query("SELECT u.userId, u.email, u.name, u.thumbnail, p.bio, p.cover, p.profession, p.religion, p.dob FROM user u inner join profiledetail p on u.userId=p.userId where u.userId='"+data.userId+"'",function(error,rows){
				if(error)
					res.json({ code: 404, success: false, message:"Some error occured. Please refresh", error: error});
				else{
					var data = rows;
					if(data.length>0)
					{
						res.json({ code: 101, success: true, message:"Profile updated successfully", user: data});
					}
					else
						res.json({ code: 420, success: false, message:"Some error occured. Please refresh"});
				}
			});
		}
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
			res.json({ code: 420, success: false, message:"Some error occured. Unable to retrieve favorites"});
		res.json({ code: 101, success: true, message:"Favorites retrieved successfully successfully", favorites: data});
	});
});

router.delete('/removefav', function(req, res){
    var db = req.con;
    var data = req.body;
    var query = "DELETE FROM favoritelist WHERE userId='" + data.userId + "' and friendId='" + data.friendId + "';";
    db.query(query,data, function (error, results, fields) {
    		// if (error) throw error;
    		if(error)
    			res.json({ code: 420, success: false, message:"Some error occured. Unable to remove user from favorites"});
    		res.json({ code: 101, success: true, message:"User removed from favorites successfully", user: data});
    	});
});

router.post('/addfav', function(req, res){
    var db = req.con;
    var data = req.body;
    var query="INSERT INTO favoritelist (`userId`, `friendId`) VALUES ('" + data.userId + "', '" + data.friendId + "');";
    db.query(query,data, function (error, results, fields) {
    		// if (error) throw error;
    		if(error)
    			res.json({ code: 420, success: false, message:"Some error occured. Unable to add to favorite"});
    		res.json({ code: 101, success: true, message:"User added to favorites successfully", favorite: data});
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
			res.json({ code: 420, success: false, message:"Some error occured. Unable to retrieve blocked list"});
		res.json({ code: 101, success: true, message:"BLocked List retrieved successfully", blocked: data});
	});
});

router.post('/blockuser', function(req, res, next) {
	var db = req.con;
	var data = req.body;
	var query="INSERT INTO blocklist (`userId`, `friendId`) VALUES ('" + data.userId + "', '" + data.friendId + "');";
    db.query(query,data, function (error, results, fields) {
            // if (error) throw error;
            if(error)
                res.json({ code: 420, success: false, message:"Some error occured. Unable to block user"});
            res.json({ code: 101, success: true, message:"User blocked successfully", user: data});
        });
});

router.delete('/unblockuser', function(req, res){
    var db = req.con;
    var data = req.body;
    var query = "DELETE FROM blocklist WHERE userId='" + data.userId + "' and friendId='" + data.friendId + "';"
    db.query(query,data, function (error, results, fields) {
    		// if (error) throw error;
    		if(error)
    			res.json({ code: 420, success: false, message:"Some error occured. Unable to unblock user"});
    		res.json({ code: 101, success: true, message:"User unblocked successfully", user: data});
    	});
});

router.get('/messagelist/:id', function(req, res) {
	var db = req.con;
	var data=req.params;
	var query="SELECT userId, friendId, count(friendId) as messages FROM message WHERE userid="+[req.params.id]+" group by friendId";
	db.query(query,data,function(error,rows){
		var data = rows;
		if(error)
			res.json({ code: 420, success: false, message:"Some error occured. Unable to retrieve message list"});
		res.json({ code: 101, success: true, message:"Message list retrieved successfully", user: data});
	});
});

router.get('/retrievemessage', function(req, res){
	var db = req.con;
	var data = req.body;
	var query = "select text from message WHERE userId = '" + data.userID + "', friendId = '" + data.friendId + "';";
	db.query(query,data, function (error, results, fields) {
		if(error)
			res.json({ code: 420, success: false, message:"Some error occured. Unable to retrieve message"});
		res.json({ code: 101, success: true, message:"Messages retrieved successfully", user: data});
	});
});

router.post('/sendmsg', function(req, res, next) {
	var db = req.con;
	var data = req.body;
	var query="INSERT INTO message (`message` ,`userId`, `friendId`) VALUES ('" + data.message + "' , '" + data.userId + "', '" + data.friendId + "');";
    db.query(query,data, function (error, results, fields) {
            if(error)
                res.json({ code: 420, success: false, message:"Some error occured. Unable to send message"});
            res.json({ code: 101, success: true, message:"Message sent successfully", user: data});
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
				res.json({ code: 420, success: false, message:"Some error occured. Unable to retrieved likes list"});
			res.json({ code: 101, success: true, message:"Users you have liked have been retrieved successfully", user: data});
		}
		else
		{
			if(error)
				res.json({ code: 420, success: false, message:"Some error occured. Unable to retrieved dislikes list"});
			res.json({ code: 101, success: true, message:"Users you have disliked have been retrieved successfully", user: data});
		}
	});
});

router.post('/likeDislikeProfile', function(req, res){
    var db = req.con;
    var data = req.body;
    var query="INSERT INTO likedislikelist (`userId`, `friendId`, `isLike`) VALUES ('" + data.userId + "', '" + data.friendId + "', '" + data.isLike + "');";
    db.query(query,data, function (error, results, fields) {
    		if(error)
    			res.json({ code: 420, success: false, message:"Some error occured. Unable to like profile"});
    		res.json({ code: 101, success: true, message:"Profile liked successfully", user: data});
    	});
});

router.delete('/deleteProfile', function(req, res){
    var db = req.con;
    var data = req.body;
    var query = "DELETE FROM user WHERE userId=" + data.userId;
    // res.json({myquery: query});
    db.query(query,data, function (error, results, fields) {
    		if(error)
    			res.json({ code: 420, success: false, message:"Some error occured. Unable to delete profile"});
    		res.json({ code: 101, success: true, message:"Profile deleted successfully", user: data});
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
