const io = require('socket.io-client')
os = require('os')
let socket = io.connect('http://localhost:3002', {'timeout': 28800000, 'connect_timeout': 28800000})

bid = false
offer = true

request_order_book('ANTM')

function request_order_book(stock){
    socket.emit('orderBook',stock)
}

socket.on("connect_error", function(err){
    console.error(''+ err);
});
var lines = process.stdout.getWindowSize()[1];
socket.on('orderBookData', (data) => {
    if(bid){
        if(data['bid']){
            for(var i = 0; i < lines; i++) {
                console.log('\r\n');
            }
            console.log(data['orderbooks'])
        }
    }else if(offer){
        if(data['offer']){
            for(var i = 0; i < lines; i++) {
                console.log('\r\n');
            }
            console.log(data['orderbooks'])
        }
    }

})