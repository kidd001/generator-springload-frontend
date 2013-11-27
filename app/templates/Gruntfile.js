// Generated on <%%= (new Date).toISOString().split('T')[0] %> using <%%= pkg.name %> <%%= pkg.version %>
'use strict';

module.exports = function(grunt) {

    var pkg = grunt.file.readJSON( __dirname +'/package.json');
    var path = require('path');

    // Project configuration.
    grunt.initConfig({

        pkg: pkg,

        /**
         * Set up the project environment
         */
        paths: {
            site: '<%= sitePath %>',
            assets: '<%= sitePath %>/assets',
            javascript: "<%= sitePath %>/assets/js",
            minifiedJavascript: "<%= sitePath %>/assets/js/dist/"
        },

        /**
         * Concat
         */
        concat: {
            js: {

            },
            static_mappings: {
                // files: require("./build.json")
            }
        },

        /**
         * Blast generated CSS and JS files.
         */
        clean: {
            js: {
                javascript: [
                    "<%%= paths.minifiedJavascript %>/**/*.js",
                    "!<%%= paths.minifiedJavascript %>/.svn"
                ]
            },
            server: '.tmp'
        },

        /**
         * Minify the production Javascript
         */
        uglify: {
            options: {
                banner: "/*! <%%= pkg.name %> <%%= grunt.template.today(\"yyyy-mm-dd\") %> */\n",
                mangle: {
                    except: ["jQuery", "Backbone"]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,   // remove all unnecessary nesting
                        src: "<%%= paths.minifiedJavascript %>/*.js",  // source files mask
                        dest: "<%%= paths.minifiedJavascript %>",    // destination folder
                        ext: '.js'   // replace .js to .min.js
                    }
                ]
            },
            dev: {
                options: {
                    beautify: true

                },
                files: "<%%= uglify.options.files %>"
            },
            dist: {
                options: {
                    beautify: false
                },
                files: "<%%= uglify.options.files %>"
            }
        },

        /**
         * Lint the JS and hurt all the feelings!
         */
        jshint: {
            options: {
                force: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
                // Ignore specific warnings - would be good to fix them instead of ignoring them...testing testing testing.
                //'-W061': true,  // Eval can be harmful -
                //'-W083': true,   // Don't make functions within a loop
                ignores: [
                    "<%%= paths.minifiedJavascript %>**/*.js",
                    "<%%= paths.javascript %>/lib/**/*.js",
                    "/**/*.min.js",
                    "/**/*.mini.js",
                    "/**/jquery.js",
                    "/**/jquery.*.js"
                ]
            },
            all: ['<%%= paths.javascript %>/**/*.js']
        },

        /**
         * Copy Bower dependencies
         */
        copy: {
            main: {

            },
            // Copies our bower dependencies to the assets directories
            bower: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: 'bower_components',
                        src: ['**/*.js'],
                        dest: '<%%= paths.assets %>/js/lib',
                        rename: function(dest, matchedSrcPath, options) {
                            var newSourcePath = matchedSrcPath.replace(/(\/js\/)|(\/javascripts\/)/,"/");
                            return path.join(dest, newSourcePath);
                        }
                    },
                    {
                        expand: true,
                        cwd: 'bower_components',
                        src: ['**/*.css'],
                        dest: '<%%= paths.assets %>/css/lib',
                        rename: function(dest, matchedSrcPath, options) {
                            var newSourcePath = matchedSrcPath.replace(/(\/css\/)|(\/stylesheets\/)/,"/");
                            return path.join(dest, newSourcePath);
                        }

                    },
                    {
                        expand: true,
                        cwd: 'bower_components',
                        src: ['**/*.scss'],
                        dest: '<%%= paths.assets %>/sass/lib',
                        rename: function(dest, matchedSrcPath, options) {
                            var newSourcePath = matchedSrcPath.replace(/(\/sass\/)|(\/scss\/)/,"/");
                            return path.join(dest, newSourcePath);
                        }
                    }
                ]
            }
        },

        sass: {
            dist: {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd: '<%%= paths.assets %>/sass/',      // Src matches are relative to this path.
                        src: ['**/*.scss', "!**/_*.scss"], // Actual pattern(s) to match.
                        dest: '<%%= paths.assets %>/css/',   // Destination path prefix.
                        ext: '.css'   // Dest filepaths will have this extension.
                    }
                ]
            }
        },


        /**
         * Watch
         */
        watch: {

            css: {
                files: '<%%= paths.assets %>/sass/{,*/}*.scss',
                tasks: ['sass', 'compass:server']
            },

            js: {
                files: [
                    "<%%= paths.javascript %>/{,*/}*.js",
                    "!<%%= paths.javascript %>/dist/*.js"
                ],
                tasks: ['js', 'compass:server']
            },

            livereload: {
                options: {
                    livereload: 35729
                },
                files: [
                    '<%%= paths.site %>/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '{.tmp,<%%= paths.javascript %>}/{,*/}*.js',
                    '<%%= paths.assets %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
                ]
            }

        }


    });

    /**
     * The cool way to load your grunt tasks
     * --------------------------------------------------------------------
     */
    Object.keys( pkg.dependencies ).forEach( function( dep ){
        if( dep.substring( 0, 6 ) === 'grunt-' ) grunt.loadNpmTasks( dep );
    });

    /**
     * Register all the tasks
     * --------------------------------------------------------------------
     */


    // Grunting runs the Compass task by default
    grunt.registerTask("js", [
        "clean:js",
        "jshint",
        "concat:js",
        "uglify:dist"
    ]);


    grunt.registerTask("default", [
        "copy:bower",
        "sass",
        "js",
    ]);

    // Thin wrapper for better semantics
    grunt.registerTask("bower", [
        "copy:bower"
    ]);

};
