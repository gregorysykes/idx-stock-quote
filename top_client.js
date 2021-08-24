const io = require('socket.io-client')
os = require('os')
let socket = io.connect('http://localhost:3004', {'timeout': 28800000, 'connect_timeout': 28800000})


str = ''
strings = []
temp = ''

socket.on("connect_error", function(err){
    console.error(' '+err)
});

// request_most_active()
request_top_gainers()
// request_top_losers()

function request_most_active(){
	socket.emit('top','active')
}

function request_top_gainers(){
	socket.emit('top','gainers')
}

function request_top_losers(){
	socket.emit('top','losers')
}

socket.on('topData', (data) => {
    console.log(' \ntop gainers')
    console.log(data)
})