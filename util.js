'use strict';

const { Buffer } = require('buffer');
const crypto = require('crypto');

let id = null;

/*
    peer id is used to uniquely identify your client
    peer id can basically be any random 20-byte string but most clients follow a convention
    refernce :- http://www.bittorrent.org/beps/bep_0020.html
*/
module.exports.genId = () => {
    if(!id){
        id = crypto.randomBytes(20);
        //  “NT” is the name of this client (namra-torrent), and 0001 is the version number
        Buffer.from('-NT0001-').copy(id, 0);
    }
    return id;
};