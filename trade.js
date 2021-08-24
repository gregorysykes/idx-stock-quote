const express = require("express")
const app = express()
const port = 3001
const http = require('http').createServer()
const request = require('request')
os = require('os')
require('events').EventEmitter.defaultMaxListeners = 0;
const io = require('socket.io')(http)

stockData = {}
tradeData = []

order = []

temp = ''

request('http://localhost:8000/api/getStocks',{json:true}, (err,res,body)=>{
    stockData = res.body
})

// from iqp
const net = require('net')

const port_iqp = 8888
const host = '192.168.2.213'

const client = new net.Socket();

client.connect({port:port_iqp,host:host},function(){
    console.log('Getting from '+host+'\nWebSocket for LiveTrade Data\nby Gregory Sykes \u00A9')
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
        if(another_strings[i].startsWith('|2|')){
            semi_detail = another_strings[i].split('|')
            temp_code = ''
            temp_trade_number = ''
            temp_qty = 0
            temp_price = 0
            temp_seller = ''
            temp_buyer = ''
            temp_code = semi_detail[3]
            if(semi_detail[4]){
                details = semi_detail[4].split(';')
            }
            temp_trade_number = details[2]
            temp_price = details[4]
            temp_qty = details[5]
            temp_seller = details[6]
            temp_buyer = details[8]

            //add to array
            order[0] = temp_code
            order[1] = temp_trade_number
            order[2] = temp_price
            order[3] = temp_qty
            order[4] = temp_seller
            order[5] = temp_buyer


            // if(tradeData[0] != null){
            //     if(tradeData[0]['trade_number'] != temp_trade_number){
            //         tradeData.unshift(order)
            //     }
            // }else{
            //     tradeData.push(order)
            // }
            // console.log('no. '+temp_trade_number+' code: '+temp_code+' price: '+temp_price+' qty: '+temp_qty+' seller: '+temp_seller+' buyer: '+temp_buyer)
            details = []
            semi_detail = []
            // console.log(order)
            // order = {
            //     'code':'',
            //     'trade_number':'',
            //     'price':0,
            //     'qty':0,
            //     'seller':'',
            //     'buyer':''
            // }

            // io.sockets.emit('liveTradeData',order)
            // console.log(order)
            // if(tradeData[100] != null){
            //     tradeData.splice(-1)
            // }

        }
        
    }
    // order = []
    another_strings = []
    strings.shift()
})

io.on('connection', (socket) =>{

    socket.on('liveTrade',function(){
        client.on('data',function(chunk){
            socket.emit('liveTradeData',order)
        })
    })


    socket.on('disconnect',(_)=>{
        socket.disconnect()
    })
})

http.listen(port, () => {
    console.log('server is listening on localhost:'+port)
})