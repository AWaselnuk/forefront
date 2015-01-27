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
// These are scripts that will be dynamically added to package.json
// based on user choices.
// The remaining scripts can be found in templates/package.json
// http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/
var packageScriptTemplates = {
  // Autoprefix CSS
  'autoprefixer': 'autoprefixer assets/css/*.css',
  // Compile Coffeescript,
  'coffeescript': 'coffee --join assets/js/application.js --compile src/coffeescript/*.coffee',
  // Compile EC6,
  'ec6': '6to5 src/ec6 --out-file assets/js/application.js',
  // Compile SASS
  'sass': 'sass src/scss/application.scss assets/css/application.css',
  // Run sass compilation and autoprefixer
  'build:styles': 'npm run %s && npm run autoprefixer',
  // Compile Coffeescript or EC6 compilation
  'build:scripts': 'npm run %s',
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

// CSS and JS default choices
var cssChoice = 'sass';
var jsChoice = 'coffeescript';

// Package.json Object
var packageJSON = {};

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

  // Read in the package.json template
  packageJSON = fs.readJsonSync(appDir + 'templates/package.json');

  scaffoldCSS(); // Go to next step
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
      cssChoice = 'sass';
    } else {
      whisper('skipping SASS setup...');
    }

    scaffoldJS(); // Go to next step
  });
}

// Run the JS scaffolding
function scaffoldJS() {
  jsChoice = 'coffeescript';

  scaffoldNPM(); // Go to next step
}

// Add scripts to NPM based on user choices
function scaffoldNPM() {
  // CSS Scripts
  if (cssChoice) {
    packageJSON['scripts'][cssChoice] = packageScriptTemplates[cssChoice];
    packageJSON['scripts']['build:styles'] =
      packageScriptTemplates['build:styles'].replace('%s', cssChoice);
  }
  // JS Scripts
  if (jsChoice) {
  packageJSON['scripts'][jsChoice] = packageScriptTemplates[jsChoice];
  packageJSON['scripts']['build:scripts'] =
    packageScriptTemplates['build:scripts'].replace('%s', jsChoice);
  }
  // Write out the completed package.json template
  fs.writeJsonSync(workingDir + 'package.json', packageJSON);

  teardown(); // Go to last step
}

// Start the app
console.log();
setup();
