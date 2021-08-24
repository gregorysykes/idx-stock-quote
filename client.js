const io = require('socket.io-client')
os = require('os')
let socket = io.connect('http://localhost:3000', {'timeout': 28800000, 'connect_timeout': 28800000})

str = ''
strings = []
stockQuotes = []
temp = ''

request_stock_price('ASSA')

function request_stock_price(stock){
    socket.emit('stockPrice',stock)
}

socket.on("connect_error", function(err){
    console.error('error: '+err);
});

var lines = process.stdout.getWindowSize()[1];

socket.on('stockQuote', (data) => {
    // for(var i = 0; i < lines; i++) {
    //     console.log('\r\n');
    // }
    console.log(data['data'])
})