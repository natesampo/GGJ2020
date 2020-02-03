var express = require('express');
var fs = require('fs');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var request = require('request');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var ticks = 10;
var port = 5000;

var fileList = [];

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

var accessToken = '2MMTqs9tilAAAAAAAAAATSgeQuYDN3pbHX8HgplCZLo1jmJ5D_is12Bpeoq-ih8';

io.on('connection', function(socket) {
	console.log('New Connection');
	socket.on('saveArt', function(paintingName, art) {
		try {
			//var content = Buffer.from(art);
			//console.log([...content]);

			var options = {
				method: "POST",
				url: 'https://content.dropboxapi.com/2/files/upload',
				headers: {
					"Content-Type": "application/octet-stream",
					"Authorization": "Bearer " + accessToken,
					"Dropbox-API-Arg": "{\"path\": \"/paintings/"+paintingName+"/"+Date.now()+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}"
				},
				body:art
			};

			request(options, function(err, res, body) {
				var jsonBody = JSON.parse(body);
				if (jsonBody['path_display']) {
					console.log('Saved Painting: ' + jsonBody.path_display);
				}
			});
		} catch (e) {
			console.log(e);
		}
   	});
   	socket.on('getArt', function(paintingName, ids) {
		try {
			var options = {
				method: "POST",
				url: 'https://api.dropboxapi.com/2/files/list_folder',
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer " + accessToken
				},
				body: "{\"path\": \"/paintings/"+paintingName+"\", \"recursive\": false, \"include_media_info\": false, \"include_deleted\": false, \"include_has_explicit_shared_members\": false, \"include_mounted_folders\": false, \"include_non_downloadable_files\": false}"
			};

			request(options, function(err, res, body) {
				var jsonBody = JSON.parse(body);

				if (jsonBody['error_summary']) {
					console.log('No Paintings Saved For ' + paintingName);
				} else if (jsonBody['entries']) {
					console.log('Found ' + jsonBody.entries.length + ' Paintings of ' + paintingName);
				}

				for (var i in jsonBody.entries) {
					var found = false;
					for (var j in ids) {
						if (ids[j] == jsonBody.entries[i].name) {
							found = true;
							break;
						}
					}

					if (!found) {
						jsonBody.entries[i]['requesterID'] = socket.id;
						jsonBody.entries[i]['paintingName'] = paintingName;
						fileList.push(jsonBody.entries[i]);
					}
				}
			});
		} catch (e) {
			console.log(e);
		}
   	});
});

setInterval(function() {
	for (var i=fileList.length-1; i>=0; i--) {
		let item = fileList.pop();

		var options = {
			method: "GET",
			url: 'https://content.dropboxapi.com/2/files/download',
			headers: {
				"Content-Type": "application/octet-stream",
				"Authorization": "Bearer " + accessToken,
				"Dropbox-API-Arg": "{\"path\": \""+item.path_display+"\"}"
			}
		};

		request(options, function(err, res, body) {
			console.log('Retrieved ' + item.path_display);
			io.to(item.requesterID).emit('showArt', item.paintingName, item.name, body);
		});
	}
}, 1000/ticks);