#!/usr/bin/env node

'use strict';

// NOTE: To parse command line options, check out commander:
// https://www.npmjs.com/package/commander
// Right now this is not required, but it could very well be in the future.

var colors = require('colors'),
    prompt = require('prompt'),
    fs = require('fs-extra');

// UI themes
function log(msg) {
  console.log(msg);
}

function error(msg) {
  log(msg.red);
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
  'coffeescript': 'cat src/coffeescript/*.coffee | coffee -cs > assets/js/application.js',
  // Compile es6,
  'es6': 'babel src/es6 --out-file assets/js/application.js',
  // Compile SASS
  'sass': 'sass src/scss/application.scss assets/css/application.css',
  // Run sass compilation and autoprefixer
  'build:styles': 'npm run %s && npm run autoprefixer',
  // Compile Coffeescript or es6 compilation
  'build:scripts': 'npm run %s',
  // Build everything
  'build': 'npm run build:styles && npm run build:scripts',
  // Watch for changes
  'watch': 'watch \'npm run build\' src',
  // Run a local browser-sync server
  'serve': 'browser-sync start --server --files "assets/css/*.css, assets/js/*.js"',
  // Run tests
  'test': '',
  // Do everything you need to develop
  'develop': 'npm run build && npm run watch && npm run serve'
};

// devDependency templates
// These are devDependencies that will be dynamically added to package.json
// based on user choices. It maps the user choice (key) to the name of the
// dependency required for that choice
var devDependencyTemplates = {
  'coffeescript': 'coffee-script',
  'es6': 'babel'
}

// File paths
var appDir = __dirname + '/';
var workingDir = './';

// CSS and JS choices
var cssChoice = null;
var jsChoice = null;

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
  log('Welcome to Forefront!'.white.bold.bgMagenta);
  // Create or copy non-optional templates and directories
  fs.ensureDirSync(workingDir + 'assets/js');
  fs.ensureDirSync(workingDir + 'assets/img');
  fs.ensureDirSync(workingDir + 'assets/fonts');
  fs.ensureDirSync(workingDir + 'assets/css');
  fs.copySync(appDir + 'templates/FOREFRONT_HELP.md', workingDir + 'FOREFRONT_HELP.md');

  // Read in the package.json template
  packageJSON = fs.readJsonSync(appDir + 'templates/package.json');
  prompt.start(); // Initialize the Node prompt

  scaffoldREADME(); // Go to next step
}

// All finished
function teardown() {
  say('All Finished!');
}

// Copy README.md
function scaffoldREADME() {
  prompt.get({
    properties: {
      answer: {
        description: 'Would you like to create a README.md template?\n(default: y)'.cyan
      }
    }
  }, function (err, result) {
    if (affirmative(result.answer)) {
      affirm('Okay, README.md was created!');
      fs.copySync(appDir + 'templates/README.md', workingDir + 'README.md');
    } else {
      whisper('skipping README.md template...');
    }

    scaffoldHTML(); // Go to next step
  });
}

// Copy index.html
function scaffoldHTML() {
  prompt.get({
    properties: {
      answer: {
        description: 'Would you like to create an index.html template?\n(default: y)'.cyan
      }
    }
  }, function (err, result) {
    if (affirmative(result.answer)) {
      affirm('Okay, index.html was created!');
      fs.copySync(appDir + 'templates/index.html', workingDir + 'index.html');
    } else {
      whisper('skipping index.html template...');
    }

    scaffoldCSS(); // Go to next step
  });
}

// Copy SASS Templates
function copySASSTemplates() {
  fs.ensureDirSync(workingDir + 'src/scss');
  fs.copySync(appDir + 'templates/src/scss', workingDir + 'src/scss');
}

// Run the CSS scaffolding
function scaffoldCSS() {
  prompt.get({
    properties: {
      answer: {
        description: 'Would you like to use SASS?\n(default: y)'.cyan
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

  prompt.get({
    properties: {
      answer: {
        description: 'What flavour of javascript would you like? [coffeescript, es6, js, skip]\n(default: coffeescript)'.cyan
      }
    }
  }, function (err, result) {
    switch (result.answer.toLowerCase()) {
      case 'skip':
        whisper('skipping JS setup...');
        jsChoice = null;
        break;
      case 'es6':
        affirm('EcmaScript6 ... I can see you live on the edge.');
        jsChoice = 'es6';
        fs.ensureDirSync(workingDir + 'src/es6');
        break;
      case 'js':
        affirm('Nothing wrong with vanilla JavaScript!');
        jsChoice = 'js';
        fs.ensureDirSync(workingDir + 'src/js');
        break;
      case 'coffeescript':
      case '':
        affirm('Brewing coffeescript...');
        jsChoice = 'coffeescript';
        fs.ensureDirSync(workingDir + 'src/coffeescript');
        break;
      default:
        error('Please select "coffeescript", "es6", "js", or "skip".');
        return scaffoldJS(); // Repeat this step
    }

    scaffoldNPM(); // Go to next step
  });
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
    packageJSON['devDependencies'][(devDependencyTemplates[jsChoice])] = 'latest';
  }
  // Write out the completed package.json template
  fs.writeJsonSync(workingDir + 'package.json', packageJSON);

  teardown(); // Go to last step
}

// Start the app
// setup() should step through these in order:
// scaffoldREADME() -> scaffoldHTML() -> scaffoldCSS() -> scaffoldJS() -> scaffoldNPM() -> teardown()
setup();



