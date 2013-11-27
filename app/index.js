'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var FrontendGenerator = module.exports = function FrontendGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(FrontendGenerator, yeoman.generators.Base);

FrontendGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [
        {
            name: 'siteName',
            message: 'What do you want to call your site?',
            default: "website"
        },
        {
            name: 'isYak',
            message: 'Is this a Yak site?',
            default: true
        },
        {
            name: 'nameSpace',
            message: 'What do you want your JS namespace to be?',
            default: "SITE"
        },
        {
            type: 'confirm',
            name: 'needFred',
            message: 'Add FRED?',
            default: true
        },
        {
            type: 'confirm',
            name: 'needUnderscore',
            message: 'Add Underscore?',
            default: true
        },
        {
            type: 'confirm',
            name: 'needFancy',
            message: 'Add FancyInputs?',
            default: true
        },
        {
            type: 'confirm',
            name: 'needOmq',
            message: 'Add onMediaQuery?',
            default: true
        },
        {
            type: 'confirm',
            name: 'needRambo',
            message: 'What about some CSS spriting?',
            default: true
        },
    ];

    this.prompt(prompts, function (props) {
        this.siteName = props.siteName;
        this.requireFred = props.needFred;
        this.requireUnderscore = props.needUnderscore;
        this.requireOMQ = props.needOmq;
        this.requireRambo = props.needRambo;
        this.requireFancy = props.needFancy;
        this.requireYak = props.isYak;
        this.nameSpace = props.nameSpace;

        cb();
    }.bind(this));
};


// Relative to user's root directory
FrontendGenerator.prototype.app = function app() {
    var sitePath = "www";
    var assetPath = "www/assets";

    var packageDependencies = [
        "jquery",
        "browser.js",
        "springload-analytics.js"
    ];

    if (this.requireFred)
        packageDependencies.push("fred");
    if (this.requireOMQ)
        packageDependencies.push("on-media-query");
    if (this.requireUnderscore)
        packageDependencies.push("underscore");
    if (this.requireFancy)
        packageDependencies.push("FancyInputs");


    if (this.isYak) {
        sitePath = "site/";
        assetPath = sitePath + "/assets";
    }


    // do something here...
    this.mkdir(sitePath + 'templates');
    this.mkdir(assetPath);
    this.mkdir(assetPath + '/sass');
    this.mkdir(assetPath + '/css');
    this.mkdir(assetPath + '/images');

    if (this.requireRambo) {
        this.mkdir('site/assets/images/sprites');
    }


    this.mkdir('site/assets/js');
    this.mkdir('www');
    this.mkdir('test');

    this.template('basic.js', 'test/basic.js');

    this.copy('Gruntfile.js', 'Gruntfile.js');

    this.template('_README.md', 'README.md');
    this.template('index.html', 'site/index.html');
    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');
//    this.template('karma.conf.js', 'karma.conf.js');

    this.bowerInstall(packageDependencies, { save: true });

};

FrontendGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};

FrontendGenerator.prototype.runtime = function runtime() {
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
};
