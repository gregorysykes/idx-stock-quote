const express = require("express")
const app = express()
const port = 3004
const http = require('http').createServer()
const request = require('request')
os = require('os')
const net = require('net')
require('events').EventEmitter.defaultMaxListeners = 0;
const io = require('socket.io')(http)

stockData = {}
temp = ''
mostActive = []
topGainers = []
topLosers = []

request('http://localhost:8000/api/getStocks',{json:true}, (err,res,body)=>{
    stockData = res.body
})

// from iqp

const port_iqp = 8888
const host = '192.168.2.213'

const client = new net.Socket();

client.connect({port:port_iqp,host:host},function(){
    console.log('Getting from '+host+'\nWebSocket for Top 20s\nby Gregory Sykes \u00A9')
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
        if(another_strings[i].startsWith('|1|')){
            type = another_strings[i].split('|')[4]

            if(type == '5;1'){
                temp_code = ''
                temp_price=0
                temp_change=0
                temp_percentage=0
                temp_open=0
                temp_high=0
                temp_low = 0
                temp_lot = 0
                temp_value = 0
                temp_bid =0
                temp_offer = 0
                temp_bid_lot=0
                temp_offer_lot = 0
                temp_average = 0

                temp_code = another_strings[i].split('|')[3].split(';')[1]
                words = another_strings[i].split('|')


                for(k = 5;k<words.length;k++){
                    smaller_words = words[k].split(';')
                    if(smaller_words[0] == '56'){
                        temp_price = parseInt(smaller_words[1])
                    }else if(smaller_words[0] == '82'){
                        temp_change = parseInt(smaller_words[1])
                    }else if(smaller_words[0] == '117'){
                        temp_percentage = parseFloat(smaller_words[1])
                    }
                    smaller_words = []
                }
                words = []

                if(stockData[temp_code] && stockData[temp_code]['code']){
                    if(temp_price != 0){
                        stockData[temp_code]['price'] = temp_price
                    }if(temp_change != 0){
                        stockData[temp_code]['change'] = temp_change
                    }if(temp_percentage != 0 ){
                        stockData[temp_code]['percentage'] = temp_percentage
                    }
                }
            }
        }else if(another_strings[i].startsWith('|4|')){
            strs = another_strings[i].split('|');
            type = strs[2]
            if(type == 'C'){
                mostActive = []
            }else if(type == 'D'){
                topGainers = []
            }else if(type == 'E'){
                topLosers = []
            }
            for(k=4;k<24;k++){
                _str = ''
                _str = strs[k]
                if(k == 23){
                    _str = _str.substr(0,4)
                }
                if(type == 'C'){
                    mostActive.push(_str)
                }else if(type == 'D'){
                    topGainers.push(_str)
                }else if(type == 'E'){
                    topLosers.push(_str)
                }
            }
        }
    }
    another_strings = []
    strings.shift()
})

io.on('connection', (socket) =>{

    socket.on('top',(type)=>{
        if(type == 'active'){
            _mostActive = []
            for(i=0;i<mostActive.length;i++){
                _mostActive.push(stockData[mostActive[i]])
            }
            var interval = setInterval(function(){
                socket.emit('topData', _mostActive)
            },1000)
        }else if(type == 'gainers'){
            _topGainers = []
            for(i=0;i<topGainers.length;i++){
                _topGainers.push(stockData[topGainers[i]])
            }
            var interval = setInterval(function(){
                socket.emit('topData', _topGainers)
            },1000)
        }else if(type == 'losers'){
            _topLosers = []
            for(i=0;i<topLosers.length;i++){
                _topLosers.push(stockData[topLosers[i]])
            }
            var interval = setInterval(function(){
                socket.emit('topData', _topLosers)
            },1000)
        }
    })


    socket.on('disconnect',(_)=>{
        socket.disconnect()
    })
})

http.listen(port, () => {
    console.log('server is listening on localhost:'+port)
})