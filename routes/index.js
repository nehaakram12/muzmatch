var express = require('express');
var router = express.Router();
const request = require('request');

/* GET home page. */

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Muzmatch', haha: "lololol" });
});

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Muzmatch' });
});

router.get('/login', function(req, res, next) {
	if(req.session.authStatus == 'loggedIn'){
		res.redirect('/profile');
	}
	var message = req.session.message;
	res.render('login', {message: message});
});

router.get('/logout', function(req, res, next) {
	req.session.user = null;
	req.session.authStatus = 'loggedOut';
	req.session.message='User logged out successfully';
	res.redirect('/login');
});

router.post('/callLoginApi', function(req, res){
  data=req.body;
  const request = require('request');
  request.post({url:'http://localhost:3000/users/login', json: data }, (err, response, body) => {
    if (err) { 
    	req.session.message='Something went wrong, please try again';
    	res.redirect('/login');
    }
    else{
    	// res.json({ code: response, success: true, message:"User logged in successfully", user: body.user});
    	if(response.statusCode==200)
    	{
    		if(body.code==101)
	    	{
		    	req.session.user = body.user;
		    	req.session.authStatus = 'loggedIn';
		    	req.session.message='User logged in successfully';
		    	res.redirect('/profile');
	    	}
    		else if(body.code==420)
	    	{
		    	req.session.message='Wrong credentials. Try again';
		    	res.redirect('/login');
	    	}
	    	else if(body.code==404)
	    	{
		    	req.session.message='Something went wrong, please try again';
    			res.redirect('/login');
	    	}
    	}
    	else{
    		req.session.message='Something went wrong, please try again';
    		res.redirect('/login');
    	}
    }
  });
});

router.get('/signup', function(req, res, next) {
	if(req.session.authStatus == 'loggedIn'){
		res.redirect('/profile');
	}
    req.session.message='User logged out successfully';
  	res.render('signup', { title: 'Signup' , message: req.session.message});
});

router.post('/callSignupApi', function(req, res){
  data=req.body;
  const request = require('request');
  request.post({url:'http://localhost:3000/users/signup', json: data }, (err, response, body) => {
    if (err) { 
    	req.session.message='Something went wrong, please try again';
    	res.redirect('/login');
    }
    else{
    	// res.json({ code: response, success: true, message:"User logged in successfully", user: body.user});
      // res.json({ user: data});

    	if(response.statusCode==200)
    	{
    		if(body.code==101)
	    	{
          user=[];
          user.push(body.user);
		    	req.session.user = user;
		    	req.session.authStatus = 'loggedIn';
		    	req.session.message='User signed up successfully';
		    	res.redirect('/updateProfile');
	    	}
    		else if(body.code==420)
	    	{
		    	req.session.message='Wrong parameters. Try again';
		    	res.redirect('/signup');
	    	}
	    	else if(body.code==404)
	    	{
		    	req.session.message='Something went wrong, please try again';
    			res.redirect('/signup');
	    	}
    	}
    	else{
    		req.session.message='Something went wrong, please try again';
    		res.redirect('/signup');
    	}
    }
  });
});

router.get('/home', function(req, res, next) {

  request('http://localhost:3000/users/list', function (error, response, body) {
      if (error) { 
        req.session.message='Something went wrong, please try again';
        res.redirect('/profile');
      }
      else{
        // res.json({ code: response, success: true, message:"User logged in successfully", users: body});
        if(response.statusCode==200)
        {
          res.json({ code: response, success: true, message:"User logged in successfully", users: body.users });

          // res.render('home', { title: 'Home', users: body.users });

          if(body.code==101)
          {
            req.session.message='Profile updated successfully';
            res.render('home', { title: 'Home', users: body.users });
          }
          else if(body.code==420)
          {
            req.session.message='Wrong parameters. Try again';
            res.redirect('/profile');
          }
          else if(body.code==404)
          {
            req.session.message='Something went wrong, please try again';
            res.redirect('/profile');
          }
        }
        else{
          req.session.message='Something went wrong, please try again';
          res.redirect('/profile');
        }
      }
  });
});

router.get('/profile', function(req, res, next) {
	if(req.session.authStatus != 'loggedIn'){
		req.session.message = 'You need to login first';
		res.redirect('/login');
	}
  req.session.message=null;
	var user = req.session.user;
	var message = req.session.message;
	res.render('profile', {user: user, message: message});
  // res.render('profile', { title: 'Profile' });
});

router.get('/updateProfile', function(req, res, next) {
	if(req.session.authStatus != 'loggedIn'){
		req.session.message = 'You need to login first';
		res.redirect('/login');
	}
    // user=[];
    // user.push(req.session.user);
  	res.render('update-profile', { user: req.session.user, message: req.session.message });
});

router.post('/callUpdateProfileApi', function(req, res){
  data=req.body;
  request.patch({url:'http://localhost:3000/users/updateprofile', json: data }, (err, response, body) => {
    if (err) { 
    	req.session.message='Something went wrong, please try again';
    	res.redirect('/updateProfile');
    }
    else{
    	// res.json({ code: response, success: true, message:"User logged in successfully", user: body.user});
    	if(response.statusCode==200)
    	{
    		if(body.code==101)
	    	{
		    	req.session.user = body.user;
		    	req.session.message='Profile updated successfully';
		    	res.redirect('/profile');
	    	}
    		else if(body.code==420)
	    	{
		    	req.session.message='Wrong parameters. Try again';
		    	res.redirect('/updateProfile');
	    	}
	    	else if(body.code==404)
	    	{
		    	req.session.message='Something went wrong, please try again';
    			res.redirect('/updateProfile');
	    	}
    	}
    	else{
    		req.session.message='Something went wrong, please try again';
    		res.redirect('/updateProfile');
    	}
    }
  });
});

router.get('/updatePassword', function(req, res, next) {
  if(req.session.authStatus != 'loggedIn'){
    req.session.message = 'You need to login first';
    res.redirect('/login');
  }
    // user=[];
    // user.push(req.session.user);
    res.render('update-password', { user: req.session.user, message: req.session.message });
});


router.post('/callChangePasswordApi', function(req, res){
  data=req.body;
  oldpass=data.oldpassword;
  newpass=data.newpassword;
  // res.json({ oldpass: oldpass, newpass: newpass, val:oldpass!=newpass});

  if(oldpass!=newpass){
    req.session.message='Passwords dont match.';
    res.redirect('/updatePassword');
    // res.json({ oldpass: oldpass, newpass: newpass, val:oldpass!=newpass});
  }
  // res.json({ oldpass: oldpass, newpass: newpass, val:oldpass!=newpass, user: data.userId});

  request.post({url:'http://localhost:3000/users/updatepassword', json: data }, (err, response, body) => {
    if (err) { 
      req.session.message='Something went wrong, please try again';
      res.redirect('/updatePassword');
    }
    else{
      // res.json({ code: response, success: true, message:"User logged in successfully", user: body.user});
      if(response.statusCode==200)
      {
        if(body.code==101)
        {
          req.session.message='Password updated successfully';
          res.redirect('/profile');
        }
        else if(body.code==420)
        {
          req.session.message='Wrong credentials. Try again';
          res.redirect('/updatePassword');
        }
        else if(body.code==404)
        {
          req.session.message='Something went wrong, please try again';
          res.redirect('/updatePassword');
        }
      }
      else{
        req.session.message='Something went wrong, please try again';
        res.redirect('/updatePassword');
      }
    }
  });
});






module.exports = router;
