/**
 * Created by Splinter on 03/09/2014.
 */
var http = require('http');
var fs = require('fs');
var ent = require('ent');



// Chargement du fichier index.html affiché au client
var server = http.createServer(function (req, res) {
    fs.readFile('./views/index.html', 'utf-8', function (error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {


    if (! socket.pseudo) {
        console.log("Initialisation ... client est en train de connecté ");
        socket.emit('initialisation',true);
    }

        socket.on('pseudo', function (pseudo) {
                console.log(pseudo + " a connecté ");
                socket.pseudo = pseudo;
            if ( socket.pseudo) {
                socket.broadcast.emit('nouveau_membre', { pseudo: ent.encode(socket.pseudo)});
                socket.emit('nouveau_membre', { pseudo: ent.encode(socket.pseudo)});
            }else
            {
                console.log("Initialisation ... client est en train de connecté ");
                socket.emit('initialisation',true);
            }
            }
        );

        socket.on('message_client', function (message) {
            console.log(socket.pseudo + " a envoyé un message " + message);
            socket.emit('message_pour_tout', { pseudo: ent.encode(socket.pseudo), message: ent.encode(message)});
            socket.broadcast.emit('message_pour_tout', { pseudo: ent.encode(socket.pseudo), message: ent.encode(message)});
        });

});


server.listen(8080);