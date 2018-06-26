// @flow

const os = require('os');
const path = require('path');

// helper function to build valid filePath
const resolvePath = (...args: Array<string>): string => {
    return path.resolve(os.homedir(), ...args);
};

module.exports.resolvePath = resolvePath;
