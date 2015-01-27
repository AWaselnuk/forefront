#!/usr/bin/env node

'use strict';

var program = require('commander'),
    colors = require('colors'),
    prompt = require('prompt'),
    fs = require('fs-extra');

//  UI themes
function log(msg) {
  console.log(msg);
}

function say(msg) {
  log(msg.cyan);
}

function whisper(msg) {
  log(msg.gray.italic);
}

function affirm(msg) {
  log(msg.green);
}

// File paths
var appDir = __dirname + '/';
var workingDir = './';

// Prompt config
prompt.message = '';
prompt.delimiter = '';

// Utilities
function affirmative(answer) {
  return answer === '' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

// Setup the initial directories and files
function setup() {
  log('Welcome to Forefront!'.white.bold.bgCyan);
  fs.ensureDirSync(workingDir + 'assets/js');
  fs.ensureDirSync(workingDir + 'assets/img');
  fs.ensureDirSync(workingDir + 'assets/fonts');
  fs.ensureDirSync(workingDir + 'assets/css');
  fs.copySync(appDir + 'templates/index.html', workingDir + 'index.html');
  fs.copySync(appDir + 'templates/package.json', workingDir + 'package.json');
}

// All finished
function teardown() {
  say('All Finished!');
}

// Copy SASS Templates
function copySASSTemplates() {
  fs.ensureDirSync(workingDir + 'src/scss');
  fs.copySync(appDir + 'templates/src/scss', workingDir + 'src/scss');
}

// Run the CSS scaffolding
function scaffoldCSS() {
  prompt.start();
  prompt.get({
    properties: {
      answer: {
        description: 'Would you like to use SASS? (default: y)'.cyan
      }
    }
  }, function (err, result) {
    if (affirmative(result.answer)) {
      affirm('Okay, let\'s get Sassy!');
      copySASSTemplates();
      // TODO: Add SASS things to npm scripts
    } else {
      whisper('skipping SASS setup...');
    }
  });
}

// Start the app
console.log();
setup();
scaffoldCSS();
// scaffoldJS();
// scaffoldNPM();
teardown();
