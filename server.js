const express = require("express")
const app = express()
const port = 3000
const http = require('http').createServer()
const request = require('request')
os = require('os')
const net = require('net')
require('events').EventEmitter.defaultMaxListeners = 0;
const io = require('socket.io')(http)

stockData = {}
counter = 0
temp = ''
_stock = ''

request('http://localhost:8000/api/getStocks',{json:true}, (err,res,body)=>{
    stockData = res.body
})

// from iqp

const port_iqp = 8888
const host = '192.168.2.213'

const client = new net.Socket();

client.connect({port:port_iqp,host:host},function(){
    console.log('Getting from '+host+'\nWebSocket for Stock Data\nby Gregory Sykes \u00A9')
})

var itl = setInterval(function(){
    counter++
    console.log('add to DB '+counter)
    console.log(stockData['ANTM'])
},600000)

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
        if(another_strings[i].startsWith('|1|')){
            type = another_strings[i].split('|')[4]

            if(type == '5;1'){
                temp_code = ''
                temp_code = another_strings[i].split('|')[3].split(';')[1]
                words = another_strings[i].split('|')

                for(k = 5;k<words.length;k++){
                    smaller_words = words[k].split(';')
                    if(stockData[temp_code]){
                        if(smaller_words[0] == '56'){
                            stockData[temp_code]['data'][0] = smaller_words[1]
                        }else if(smaller_words[0] == '82'){
                            stockData[temp_code]['data'][1] = smaller_words[1]
                        }else if(smaller_words[0] == '117'){
                            stockData[temp_code]['data'][2] = smaller_words[1]
                        }else if(smaller_words[0] == '54'){
                            stockData[temp_code]['data'][3] = smaller_words[1]
                        }else if(smaller_words[0] == '57'){
                            stockData[temp_code]['data'][4] = smaller_words[1]
                        }else if(smaller_words[0] == '59'){
                            stockData[temp_code]['data'][5] = smaller_words[1]
                        }else if(smaller_words[0] == '61'){
                            stockData[temp_code]['data'][6] = smaller_words[1]
                        }else if(smaller_words[0] == '64'){
                            stockData[temp_code]['data'][7] = smaller_words[1]
                        }else if(smaller_words[0] == '65'){
                            stockData[temp_code]['data'][8] = smaller_words[1]
                        }else if(smaller_words[0] == '116'){
                            stockData[temp_code]['data'][9] = smaller_words[1]
                        }
                    }
                    smaller_words = []
                }
                words = []
            }
        }
    }
    another_strings = []
    strings.shift()
})

io.on('connection', (socket) =>{

    console.log('Connect')
    socket.on('stockPrice',(stock)=>{
        var interval = setInterval(function(){
            socket.emit('stockQuote', stockData[stock])
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