#!/usr/bin/env node

'use strict';

var program = require('commander'),
    colors = require('colors'),
    prompt = require('prompt'),
    fs = require('fs-extra');

// UI themes
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

// NPM Script Templates
// http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/
var packageScriptTemplates = {
  // Doctor will test that you have system dependencies installed
  // Dependencies are: NodeJS, Ruby, SASS gem
  'doctor': '',
  // Autoprefix CSS
  'autoprefixer': 'autoprefixer assets/css/*.css',
  // Compile Coffeescript,
  'coffeescript': 'coffee --join assets/js/application.js --compile src/coffeescript/*.coffee',
  // Compile EC6,
  'ec6': '6to5 src/ec6 --out-file assets/js/application.js',
  // Run sass compilation and autoprefixer
  'build:styles': 'sass src/scss/application.scss assets/css/application.css && npm run autoprefixer',
  // Compile Coffeescript or EC6 compilation
  'build:scripts': 'coffee --join assets/js/application.js --compile src/coffeescript/*.coffee',
  // Build everything
  'build': 'npm run build:styles && npm run build:scripts',
  // Watch for changes
  'watch': 'watch \'npm run build\' src/*',
  // Run a local browser-sync server
  'serve': 'browser-sync start --server --files "assets/css/*.css, assets/js/*.js"',
  // Run tests
  'test': '',
  // Do everything you need to develop
  'develop': 'npm run build && npm run watch && npm run serve'
};

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
