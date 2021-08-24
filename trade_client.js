const io = require('socket.io-client')
os = require('os')
let socket = io.connect('http://localhost:3001', {'timeout': 28800000, 'connect_timeout': 28800000})


str = ''
strings = []
temp = ''

socket.on("connect_error", function(err){
    console.error(' '+err)
});

request_live_trade()

function request_live_trade(){
	socket.emit('liveTrade','')
}

socket.on('liveTradeData', (data) => {
            // console.log(data)
    if(strings.length > 0){
        if(strings[1] != data[1]){
            console.log(data)
            strings = []
        }
    }
    strings = data
})