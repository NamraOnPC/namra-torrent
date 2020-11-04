'use strict';

const dgram = require('dgram');
const Buffer = require('buffer').Buffer;
const urlParse = require('url').parse;
// crypto module to help us create a random number for our buffer
const crypto = require('crypto');

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
    /*
        BitTorrent request protocol

        Offset  Size            Name            Value
        0       64-bit integer  connection_id   0x41727101980
        8       32-bit integer  action          0 // connect
        12      32-bit integer  transaction_id  ? // random
        16

        referenced from http://www.bittorrent.org/beps/bep_0015.html
    */
    
    //  create a new empty buffer with a size of 16 bytes
    const buf = Buffer.alloc(16);
    
    /* 
        connection id
        method writeUInt32BE writes an unsigned 32-bit integer in big-endian format
        written in 4 byte chunks because there is no method to write a 64 bit integer
    */
    buf.writeUInt32BE(0x417, 0);
    buf.writeUInt32BE(0x27101980, 4);

    //action
    buf.writeUInt32BE(0,8);
    //transaction id
    crypto.randomBytes(4).copy(buf, 12);
    
    return buf;
}

function parseConnectionResponse(response){
    return {
        // reading the action and the transaction id as unsigned 32 bit big-endian integers, passing the offset
        action: response.readUInt32BE(0),
        transactionId: response.readUInt32BE(4),
        //  slice method to get the last 8 bytes. Since a 64-bit integer can' t be read.        
        connectionId: response.slice(8)
    }
}

function buildAnnounceRequest(connectionId){
    // TODO
}

function parseAnnounceResponse(response){
    // TODO
}