var restify = require('restify');
var mongojs = require('mongojs');
 
var ip_addr = '127.0.0.1';
var port = '3000';

var server = restify.createServer({
	name: "test"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var connection_string = '127.0.0.1:27017/prueba';
var db = mongojs(connection_string, ['prueba']);
var songs = db.collection("songs");

function allSongs(req, res, next){
	res.setHeader("Acces-Control-Origin", "*");
	songs.find().sort({postedOn: -1}, function (err, success){
		if(success){
			res.send(200, success);
		} else {
			return next(err);
		}
	});
}

function postSong(req, res, next){
	res.setHeader("Acces-Control-Origin", "*");
	var song = {};
	song.title = req.params.title;
	song.duration = req.params.duration;
	song.postedOn = new Date();

	songs.save(song, function(error, success){
		if(success){
			res.send(201, song);
		} else {
			return next(err);
		}
	});
}

function deleteSong(req, res, next){
	res.setHeader("Acces-Control-Origin", "*");
	songs.remove({_id:mongojs.ObjectId(req.params.songId)}, function(err, success){
		if(success){
			res.send(204);
		} else {
			return next(err);
		}
	});	
}

var PATH = '/songs';
server.get({path: PATH}, allSongs);
server.post({path: PATH}, postSong);
server.del({path: PATH + '/:songId'}, deleteSong);

server.listen(port, ip_addr, function(){
	console.log('%s escuchando en %s', server.name, server.url);
}); 
