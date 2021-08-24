const io = require('socket.io-client')
os = require('os')
let socket = io.connect('http://localhost:3000', {'timeout': 28800000, 'connect_timeout': 28800000})

str = ''
strings = []
stockQuotes = []
temp = ''

request_stock_price('ANTM')

function request_stock_price(stock){
    socket.emit('stockPrice',stock)
}

socket.on("connect_error", function(err){
    console.error(''+err);
});

socket.on('stockQuote', (data) => {
    console.log(data['data'])
})