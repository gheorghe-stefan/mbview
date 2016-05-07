#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var open = require('open');
var fs = require('fs');

argv.mbtiles = argv.mbtiles || argv._[0];
if (!argv.mbtiles) {
    console.log(usage());
    process.exit(1);
}

argv.basemap = argv.basemap || argv.base || argv.map || 'dark';

try {
    fs.statSync(argv.mbtiles).isFile();
} catch(e) {
    return console.log('*** ' + argv.mbtiles + ' does not exist');
}

function usage () {
    var text = [];
    text.push('usage: mbview [file] [options]');
    text.push('');
    text.push(' --mbtiles path to mbtiles file (optional)');
    text.push(' --port sets port to use (default: 3000)');
    text.push(' --quiet or -q supress all logging except the address to visit');
    text.push(' -n don\'t automatically open the browser on start');
    text.push(' --basemap or --base or --map sets the basemap style (default: dark)');
    text.push(' --help prints this message');
    text.push('');
    return text.join('\n');
}

var MBView = require('./mbview');
var params = {
    center: argv.center || [-122.42, 37.75],
    mbtiles: argv.mbtiles,
    port: argv.port || 3000,
    sourceLayer: argv.sourceLayer || path.basename(argv.mbtiles, '.mbtiles'),
    sourceId: 'default',
    zoom: 12,
    quiet: argv.q || argv.quiet
    basemap: argv.basemap
};

MBView.serve(params, function (err, config) {
    console.log('Listening on http://localhost:' + config.port);
    if (!argv.n) open('http://localhost:' + config.port);
});
