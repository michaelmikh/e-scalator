#!/usr/local/bin/node
// @flow

const EScalator = require('./EScalator');
const { version } = require('../package.json');
const program = require('commander');

require('dotenv').config();

program
    .version(version, '-v, --version')
    .option('-r, --recursive', 'Traverse source dir recursively')
    .option('-d, --destination <path>', 'Destination dir (absolute path)')
    .option('-s, --source <path>', 'Source dir (absolute path)')
    .option('-h, --height <n>', 'Image height (pixels)', 1800)
    .option('-w, --width <n>', 'Image width (pixels)', 2800)
    .option('--debug', 'Debug mode')
    .parse(process.argv);

const app: EScalator = new EScalator(program);
app.run();
