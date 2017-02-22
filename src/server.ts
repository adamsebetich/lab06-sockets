import net = require('net');//import socket module
import ip = require('ip');

// define address interface
interface Address { port: number; family: string; address: string; };

// create socket server
let server:net.Server = net.createServer();
let client: net.Socket[] = [];
// when the server is connected
let message:string;
server.on('connection', function(socket:net.Socket){

    function broadcast(name:string, message:string){
        client.forEach(function(client:net.Socket) {
            if (client !== socket) {
                client.write('[' + name + '] ' + message + '\n');
            }
        });
    }
    console.log('connected :' + socket.remoteAddress);
    client.push(socket);
    socket.write("What Yo Name Is? \n");
    let name: string = '';
    socket.on('data', function(data){
        this.message = data.toString();
        if(message.length === 0){
            socket.write('(type something & hit return)\n');
            return;
        }
        if (!name) {
            name = data.toString().substr(0, 11);

            socket.write('Hello ' + name + '!\n');
            socket.write('The total number of people are ' + client.length + ' here.\n');
            socket.write("Type messages, or 'exit' to leave.\n");
        }
    });

    socket.on('close', function(){
        if ('exit' === this.message) {
            socket.end();
        }
        else {
            //broadcast the message to all other clients
            broadcast(name, this.message);
        }
    })


});

//when the server starts listening...
server.on('listening', function() {
    //output to the console the port number on which we are listening
    var addr:Address = server.address();
    console.log(addr.address);
    console.log('server listening on port %d', addr.port);
});

//start the server
server.listen({
  host: ip.address(),
  port: 3000
});