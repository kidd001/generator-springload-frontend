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
            type: 'confirm',
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
            name: 'needAnalytics',
            message: 'Add Analytics?',
            default: true
        },
        {
            type: 'confirm',
            name: 'needShowHide',
            message: 'Add ShowHide?',
            default: false
        },
        {
            type: 'confirm',
            name: 'needTeflon',
            message: 'Add Teflon?',
            default: false
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
            name: 'needQT',
            message: 'Add QuickTube.js?',
            default: false
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
        this.requireOMQ = props.needOmq;
        this.requireRambo = props.needRambo;
        this.requireFancy = props.needFancy;
        this.requireTeflon = props.needTeflon;
        this.requireShowHide = props.needShowHide;
        this.requireAnalytics = props.needAnalytics;
        this.requireQuickTube = props.needQT;
        this.isYak = props.isYak;
        this.nameSpace = props.nameSpace;

        cb();
    }.bind(this));
};

// Relative to user's root directory
FrontendGenerator.prototype.app = function app() {

    this.sitePath = "www";
    this.assetPath = this.sitePath + "/assets";

    if (this.isYak) {
        this.sitePath = "site";
        this.assetPath = this.sitePath + "/assets";
    }

    this.jsPath = this.assetPath + "/js";
    this.cssPath = this.assetPath + "/css";
    this.sassPath = this.assetPath + "/sass";
    this.imgPath = this.assetPath + "/images";
    this.spritePath = this.imgPath + "/sprites";
};

FrontendGenerator.prototype.fileStructure = function fileStructure() {
    // do something here...
    this.mkdir(this.sitePath);

    if (this.requireRambo) {
        this.mkdir(this.spritePath);
    }

    this.mkdir(this.assetPath);
    this.mkdir(this.sassPath);
    this.mkdir(this.jsPath);
    this.mkdir(this.jsPath + '/dist');
    this.mkdir(this.cssPath);
    this.mkdir(this.imgPath);
};

FrontendGenerator.prototype.yakSite = function yakSite() {
    if (this.isYak) {
        this.templatePath = this.sitePath + '/templates';
        this.mkdir(this.templatePath);
        this.template('index.html', this.templatePath + '/template.twig');
    }
};

FrontendGenerator.prototype.genericSite = function genericSite() {
    if (!this.isYak) {
        this.isYak = "";
        this.template('index.html', this.sitePath + '/index.html');
    }
};

FrontendGenerator.prototype.misc = function misc() {
    this.template('humans.txt', this.sitePath + '/humans.txt');
    this.template('404.html', this.sitePath + '/404.html');

    var miscAssets = [
        'robots.txt',
        'favicon.ico',
        'apple-touch-icon-ipad.png',
        'apple-touch-icon-ipad-retina.png',
        'apple-touch-icon-iphone-retina.png',
        'apple-touch-icon-precomposed.png'
    ];

    for (var i = 0; i <  miscAssets.length; i++) {
        var asset = miscAssets[i];
        this.copy(asset, this.sitePath + '/' + asset);
    }
};

FrontendGenerator.prototype.bowerDependencies = function bowerDependencies() {
    var packageDependencies = [
        "browser.js"
    ];

    if (this.requireFred)
        packageDependencies.push("fred");
    if (this.requireOMQ)
        packageDependencies.push("on-media-query");
    if (this.requireFancy)
        packageDependencies.push("FancyInputs");
    if (this.requireAnalytics)
        packageDependencies.push("springload-analytics.js");
    if (this.requireTeflon)
        packageDependencies.push("teflon.js");
    if (this.requireShowHide)
        packageDependencies.push("springload-showhide.js");
    if (this.requireQuickTube)
        packageDependencies.push("quicktube.js");

    this.bowerInstall(packageDependencies, {
        save: true
    });
};

FrontendGenerator.prototype.scripts = function scripts() {
    this.template('_site.js', this.jsPath + '/site.js');
};

FrontendGenerator.prototype.testSuite = function testSuite() {
    this.mkdir('test');
    this.template('basic.js', 'test/basic.js');
};


FrontendGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');

    this.template('Gruntfile.js');
    this.template('_README.md', 'README.md');
    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');
};

FrontendGenerator.prototype.runtime = function runtime() {
    this.copy('bowerrc', '.bowerrc');
    this.copy('gitignore', '.gitignore');
};
