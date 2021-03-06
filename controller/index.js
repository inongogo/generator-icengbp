'use strict';
var util = require('util');
var path = require('path');
var touch = require("touch");
var yeoman = require('yeoman-generator');


var ControllerGenerator = yeoman.generators.NamedBase.extend({
    init: function () {
        console.log('Creating the module - ' + this.name);
        this.moduleName = this.name;
    },

    askFor: function () {
        var done = this.async();

        var prompts = [
            {
                name: 'rootFolder',
                message: 'Where do you want to place this module - what is the root folder?',
                default: 'app'
            },
            {
              name: 'folderAndFileName',
              message: 'You can choose another name for the folder or file names, you can do this here.',
              default: this.moduleName
            }
//            {
//                type: 'confirm',
//                name: 'includeRest',
//                message: 'Do you want to include a REST-ful service, with basic controllers, and views?',
//                default: false
//            },
        ];

        this.prompt(prompts, function (props) {
            this.rootFolder = props.rootFolder.replace(/^\/+|\/+$/g, ''); // remove any trailing slashes;
            this.folderAndFileName = props.folderAndFileName.replace(/^\/+|\/+$/g, ''); // remove any trailing slashes

//            this.includeRest = props.includeRest;

            done();
        }.bind(this));
    },

    files: function () {
        this.projectName = this.config.get('projectName');
        this.camelModuleName = this._.camelize(this.moduleName);
        this.capitalModuleName = this._.capitalize(this.moduleName);
        this.lowerModuleName = this.moduleName.toLowerCase();
        this.modulePath = path.join('src', this.rootFolder, this.folderAndFileName);
        this.moduleUrlPath = '/' + path.join('src', this.rootFolder, this.folderAndFileName).replace(/\\/g, '/');

        // Create the module namespaced by the folder path with slashes replaced by dots
        this.fullModuleName = this.projectName + '.' + this.rootFolder.replace(/\//g, '.') + '.' + this.moduleName;
        this.pathBackToRoot = "../../../../";

        var idxOf = this.rootFolder.indexOf('/');

        if (idxOf === -1) {
            this.subPath = "";
        }
        else {
            this.subPath = this.rootFolder.substring(idxOf + 1) + '/';

            // Get the path back to the root where vendor and typings stuff are
            var noOfLevels = this.subPath.match(/\//g).length;
            for (var i = 0; i < noOfLevels; i++) {
                this.pathBackToRoot += "../";
            }
        }

        this.mkdir(this.modulePath);

        if (this.config.get('useTypeScript')) {
            this.template('_controller.module.ts', path.join(this.modulePath, this.folderAndFileName + '.module.ts'));
            this.template('_controller.ctrl.ts', path.join(this.modulePath, this.folderAndFileName + '.ctrl.ts'));
        }
        else {
            this.template('_controller.module.js', path.join(this.modulePath, this.folderAndFileName + '.module.js'));
            this.template('_controller.ctrl.js', path.join(this.modulePath, this.folderAndFileName + '.ctrl.js'));
        }
        // All spec files is Javascript
        this.template('_controller.spec.js', path.join(this.modulePath, this.folderAndFileName + '.spec.js'));

        this.template('_controller.tpl.html', path.join(this.modulePath, this.folderAndFileName + '.tpl.html'));
        this.template('_controller.less', path.join(this.modulePath, this.folderAndFileName + '.less'));

        this._addModuleToAppJs(this.fullModuleName);

//        if (this.includeRestfulService) {
//            // Add RESTful service stuff here
//        }
    },

    touchIndexHtml: function() {
        // Touch the index.html file to force the 'inject' gulp task to rebuild it (that task adds the new module to the scripts)
        var indexHtmlFilePath = 'src/index.html';
        touch(indexHtmlFilePath, {mtime: true});
    },

    _addModuleToAppJs: function app(moduleName) {
        var hook   = ']).run(run);',
            path   = 'src/app/app.module.js',
            insert = "        '" + moduleName + "',\n";

        if (this.config.get('useTypeScript')) {
            hook = ']).run(()';
            path = 'src/app/app.module.ts';
            insert = "        \"" + moduleName + "\",\n";
        }

        var file   = this.readFileAsString(path);

        if (file.indexOf(hook) === -1) {
            hook = '])));';
        }

        if (file.indexOf(insert) === -1) {
            this.write(path, file.replace(hook, insert + hook));
        }
    }

});

module.exports = ControllerGenerator;
