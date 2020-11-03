'use strict';

const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const urlParse = require('url').parse;

module.exports.getPeers = (torrent, callback) => {
    /*
     creating a new socket instance
     passing argument 'udp4' to use the normal 4-byte IPv4 address format
     'udp6' can be used for newer IPv6 address format, but this format is rarely used
    */
    const socket = dgram.createSocket('udp4');
    const url = torrent.announce.toString('utf-8');

    // 1. send connection request
    udpSend(socket, buildConnectionRequest(), url);

    socket.on('message', response => {
        if(responseType(response) === 'connect'){
            // 2. recieve and parse connect response
            const connResp = parseConnectionResponse(response);
            // 3. send announce request
            const announceReq = buildAnnounceRequest(connResp.connectionId);

            udpSend(socket, announceReq, url);

        }else if (responseType(response) === 'announce'){
            // 4. parse announce response
            const announceResp = parseAnnounceResponse(response);
            // 5. pass peers to callback
            callback(announceResp.peers);

        }
    });
};

function udpSend(socket, message, rawUrl, callback=()=>{}){
    const url = urlParse(rawUrl);
    /*
        send method is used for sending messages

        The first argument is the message as a buffer
        The next  two arguments let you send just part of the buffer as the message by specifying an offset and length of the buffer
        Next is the port and host of the receiver’s url
        the last argument is a callback for when the message has finished sending
    */
    socket.send(message, 0, message.length, url.port, url.host, callback);
}

function responseType(response){
    // TODO
}

function buildConnectionRequest(){
    // TODO
}

function parseConnectionResponse(response){
    // TODO 
}

function buildAnnounceRequest(connectionId){
    // TODO
}

function parseAnnounceResponse(response){
    // TODO
}