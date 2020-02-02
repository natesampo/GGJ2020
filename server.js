var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var request = require('request');
var Dropbox = require('dropbox').Dropbox;
var fetch = require('isomorphic-fetch');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var port = 5000;

app.use('/', express.static(__dirname + '/'));

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(process.env.PORT || port, function() {
	if (!process.env.PORT) {
		app.set('port', port);
		console.log('Game started on port ' + port + '\n');
	}
});

var access_token = '2MMTqs9tilAAAAAAAAAASgmsufi0hoSY4rsfzZ8pGz7O9V9g_0XUYpDiiIPEIVon'

io.on('connection', function(socket) {
	console.log('New Connection');
	socket.on('saveArt', function(painting_name, art) {
		try {
			//var content = Buffer.from(art);
			//console.log([...content]);

			options = {
				method: "POST",
				url: 'https://content.dropboxapi.com/2/files/upload',
				headers: {
					"Content-Type": "application/octet-stream",
					"Authorization": "Bearer " + access_token,
					"Dropbox-API-Arg": "{\"path\": \"/paintings/"+painting_name+"/"+Date.now()+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
				},
				body:art
			};

			request(options, function(err, res, body) {
				console.log("Err : " + err);
				console.log("res : " + res);
				console.log("body : " + body);
			});
		} catch (e) {
			console.log(e);
		}
   	});
   	socket.on('getArt', function(painting_name) {
		try {
			options = {
				method: "GET",
				url: 'https://content.dropboxapi.com/2/files/download',
				headers: {
					"Content-Type": "application/octet-stream",
					"Authorization": "Bearer " + access_token,
					"Dropbox-API-Arg": "{\"path\": \"/paintings/"+painting_name+"/"+"1580632238404"+"\"}",
				}
			};

			request(options, function(err, res, body) {
				console.log("Err : " + err);
				console.log("res : " + res);
				io.to(socket.id).emit('showArt', body);
			});
		} catch (e) {
			console.log(e);
		}
   	});
});