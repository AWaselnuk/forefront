#!/usr/bin/env node

'use strict';

var program = require('commander'),
    chalk = require('chalk'),
    fs = require('fs-extra');

console.log(chalk.bold.white.bgCyan('Welcome to Forefront!'));

//  UI themes

// File paths
var appDir = __dirname + '/';
var workingDir = './';

// Copy SASS Templates
// wrench.mkdirSyncRecursive(workingDir + 'src/scss');
// wrench.copyDirSyncRecursive(appDir + 'templates/src/scss', workingDir + 'src/scss');
fs.ensureDirSync(workingDir + 'src/scss');
fs.copySync(appDir + 'templates/src/scss', workingDir + 'src/scss');
