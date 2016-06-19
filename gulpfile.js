'use strict';
var gulp= require('gulp');
var $ = require('gulp-load-plugins')();
var imageminPngquant = require('imagemin-pngquant');
var imageminMozjpeg = require('imagemin-mozjpeg');

//Event
gulp.task('compass',function(){
    gulp.src('scss/*.scss')
    	.pipe($.plumber()) // if error will not stop gulp
		.pipe($.compass({
			sourcemap: true,
			time: true,
			css: 'andy/css',
			sass: 'scss',
			style: 'compressed'
		}))    
		.pipe(gulp.dest('andy/css'))
		.pipe($.connect.reload());
});
gulp.task('js',function(){
    gulp.src('js/*.js')
    	.pipe($.plumber())
    	.pipe($.sourcemaps.init())
    	.pipe($.uglify())    	
	    .pipe($.sourcemaps.write())	    
	    .pipe(gulp.dest('andy/js'))
		.pipe($.connect.reload());
});
gulp.task('connect', function() {
  $.connect.server({
  	root: 'C:/Users/Lenovo/Desktop/socketDemo 2/andy',
  	livereload: true
  });
});
gulp.task('imageminJPG', function () {
	gulp.src('org_images/*.jpg')
		.pipe($.plumber())
		.pipe($.changed('andy/images'))	
		.pipe(imageminMozjpeg({quality: 90})())
		.pipe(gulp.dest('andy/images'));
});
gulp.task('imageminPNG', function () {
	gulp.src('org_images/*.png')
		.pipe($.plumber())
		.pipe($.changed('andy/images'))	
		.pipe(imageminPngquant({quality: '90'})())
		.pipe(gulp.dest('andy/images'));
});
gulp.task('uploadHTML', function () {
	gulp.src('html/*.html')
		.pipe($.changed('andy'))
		.pipe(gulp.dest('andy'))
		.pipe($.connect.reload());
});
gulp.task('del',function(){
	require('del')('node_modules');
});

//AddListener
gulp.task('default',['connect'], function() {
	gulp.watch(['scss/*.scss'],['compass']);
	gulp.watch(['js/*.js'],['js']);
	gulp.watch(['org_images/*.jpg'],['imageminJPG']);
	gulp.watch(['org_images/*.png'],['imageminPNG']);
	gulp.watch(['html/*.html'],['uploadHTML']);
});


var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users=[],teams=[];

app.use(express.static(__dirname + '/andy'));

//socket
__dirname = __dirname +'';
app.get('/', function(req, res){
	res.sendFile(__dirname + '/andy/index.html');
});

io.on('connection', function(socket){
	users.push(socket);
	console.log(socket.id);
	
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});

	socket.on('enterRoom', function(data){
		console.log(data);
		for(var i in teams){
			if(teams[i].ROOMID == data){
				searhUser(socket.id).emit('sure_enterRoom');
			}
		}
	});
	socket.on('createTeam', function(nam){
		var _hasSameName = false;
		for(var i in teams){
			if(teams[i].NAME==nam){
				console.log('找到同樣的了。');
				_hasSameName =true;
				searhUser(socket.id).emit('ioAlert', { msg: '已經有人用過這個名稱囉! 試試其他名稱吧' });						
			}			
		}
		if(!_hasSameName){
			console.log('沒有一樣的!');
			socket.teamname = nam;
			var _teamObj = {
				OWNER:socket.id,
				NAME:nam,
				ROOMID:socket.id
			}
			teams.push(_teamObj);
			searhUser(socket.id).emit('ioAlert', { msg: '隊伍創建成功' });				
		}
	});
	
});
function searhUser(_id){
	var _thisuser;
	for(var j in users){				
		if(users[j].id == _id){
			console.log('這個人是:'+users[j].id);
			_thisuser = users[j];				
		}
	}
	return _thisuser;
}
http.listen(3000, function(){
	console.log('listening on *:3000');
});
