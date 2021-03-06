# Forefront

An opinionated command-line tool for generating front end boilerplate and workflow.

## Getting Started

To use Forefront, install it globally with npm.

    npm install forefront --global

You can now use Forefront to scaffold front end tools for new projects by running the `forefront` command.
For example, to create a new project about Ninja Turtles, I would type the following in my terminal:

    mkdir ninja-turtles
    cd ninja-turtles
    forefront

## Why did you make this?

As a Front End developer there are a lot of tools best practices surrounding workflow. My preferred style often forced me to modify or copy paste snippets from different boilerplates and grunt or gulpfiles. I made this command line tool to bootstrap my own client side structure and workflow more easily.

So when I say it is 'opinionated', I basically mean that I made it for myself.

### Why use NPM instead of Grunt or Gulp or whatnot?

One day I was setting up my usual workflow with [GruntJS](http://gruntjs.com/) and I thought to myself: 'This seems to be a lot of dependencies to install simply to repeat what NPM can already do.' As it turns out, [I was not the first person to think this](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/).

## To Do:

* If other Front End developers show interest in this tool, I would make modifications to provide more customization options and modules.
* Work towards version 1. [See the issues on Github](https://github.com/AWaselnuk/forefront/issues) for items that need to still need to be completed and features I may be adding.

## License

**[ISC](http://opensource.org/licenses/ISC)**

Copyright (c) 2015, Adam Waselnuk

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
