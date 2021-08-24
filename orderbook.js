const express = require("express")
const app = express()
const port = 3002
const http = require('http').createServer()
const request = require('request')
os = require('os')
const net = require('net')
require('events').EventEmitter.defaultMaxListeners = 0;
const io = require('socket.io')(http)

orderBookList = {}

temp = ''

request('http://localhost:8000/api/orderBookList',{json:true}, (err,res,body)=>{
    orderBookList = res.body
})

// from iqp
const port_iqp = 8888
const host = '192.168.2.213'

const client = new net.Socket();

code = 'ERAA'

client.connect({port:port_iqp,host:host},function(){
    console.log('Getting from '+host+'\nWebSocket for Orderbook\nby Gregory Sykes \u00A9')
})

client.on('data',function(chunk){
    str = ''
    string = ''
    string = chunk.toString()
    str += string
    strings = str.split('\n\r')
    if(temp != null){
        strings[0] = temp + strings[0]
        temp = ''
    }
    if(strings[1] != null){
        if(!strings[1].startsWith('IQP')){
            strings[0] += strings[1]
            strings[1] = ''
        }
    }
    if(!strings[0].endsWith(' ')){
        temp = strings[0]
    }

    another_strings = strings[0].split('IQP')
    
    for(i = 0; i<another_strings.length; i++){
        if(another_strings[i].startsWith('|5|')){
            temp = another_strings[i].split('|')
            temp_code = ''
            temp_bid = false
            temp_offer = false
            temp_price = 0
            temp_lot = 0
            
            temp_code = temp[3]
            if(orderBookList[temp_code]){
                
                if(temp[4] == 'S')temp_offer = true
                else temp_bid = true
                orderBookList[temp_code]['bid'] = temp_bid
                orderBookList[temp_code]['offer'] = temp_offer
                if(orderBookList[temp_code].orderbooks != []){
                    orderBookList[temp_code].orderbooks = []
                }
                for(j = 5;j< temp.length;j++){
                    orderbook = []
                    sm = temp[j].split(';')
                    temp_price = sm[0]
                    temp_lot = sm[1]
                    orderbook[0] = temp_price
                    orderbook[1] = temp_lot
                    
                    orderBookList[temp_code].orderbooks.push(orderbook)
                }
            }
        }
    }
    another_strings = []
    strings.shift()
})

io.on('connection', (socket) =>{
    console.log('Connect')
    socket.on('orderBook',(stock)=>{
        code = stock
        var interval = setInterval(function(){
            socket.emit('orderBookData', orderBookList[code])
        },1000)
    })
    socket.on('disconnect',(_)=>{
        socket.disconnect()
        console.log('DC')
    })
})

http.listen(port, () => {
    console.log('server is listening on localhost:'+port)
})