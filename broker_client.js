const io = require('socket.io-client')
os = require('os')
let socket = io.connect('http://localhost:3005', {'timeout': 28800000, 'connect_timeout': 28800000})


str = ''
strings = []
temp = ''

socket.on("connect_error", function(err){
    console.error(' '+err)
});

broker_list()

function broker_list(){
	socket.emit('brokerList','')
}

socket.on('brokerListData', (data) => {
    console.log(data)
})