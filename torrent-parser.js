'use strict';

// keeping all the code related to getting information out of a torrent file here

const fs = require('fs');
const bencode = require('bencode');

module.exports.open = (filepath) => {
    return bencode.decode(fs.readFileSync(filepath));
};

module.exports.size = torrent => {
    // TODO
};

module.exports.infoHash = torrent => {
    // TODO
};