const express = require("express")
const app = express()
const port = 3005
const http = require('http').createServer()
const request = require('request')
os = require('os')
const net = require('net')
require('events').EventEmitter.defaultMaxListeners = 0;
const io = require('socket.io')(http)

brokerData = {}

temp = ''

request('http://localhost:8000/api/getBrokers',{json:true}, (err,res,body)=>{
    brokerData = res.body
})

// from iqp

const port_iqp = 8888
const host = '192.168.2.213'

const client = new net.Socket();

client.connect({port:port_iqp,host:host},function(){
    console.log('Getting from '+host+'\nWebSocket for Broker\nby Gregory Sykes \u00A9')
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
            _str = another_strings[i].split('|')
            // if(_str[3] == '0;IN'){
            //     console.log(_str)
            // }
            type = _str[4]
            if(type == '5;2'){
                _code = ''
                _name = ''
                _value = 0
                _volume = 0
                _net = 0
                _freq = 0

                _code = _str[3].split(';')[1]
                for(k = 5;k<_str.length;k++){
                    smaller_words = _str[k].split(';')
                    if(smaller_words[0] == '64'){
                        _volume = parseInt(smaller_words[1])
                    }else if(smaller_words[0] == '65'){
                        _value = parseInt(smaller_words[1])
                    }else if(smaller_words[0] == '70'){
                        _freq = parseInt(smaller_words[1])
                    }
                    smaller_words = []
                }
                _str = []

                if(brokerData[_code] && brokerData[_code]['code']){
                    if(_volume != 0){
                        brokerData[_code]['volume'] = _volume
                    }if(_value != 0){
                        brokerData[_code]['value'] = _value
                    }if(_freq != 0){
                        brokerData[_code]['freq'] = _freq
                    }
                }
            }
        }
    }
    // console.log(brokerData['IN'])
    another_strings = []
    strings.shift()
})

io.on('connection', (socket) =>{

    socket.on('brokerList',()=>{
        var interval = setInterval(function(){
            socket.emit('brokerListData', brokerData)
        },1000)
    })


    socket.on('disconnect',(_)=>{
        socket.disconnect()
    })
})

http.listen(port, () => {
    console.log('server is listening on localhost:'+port)
})