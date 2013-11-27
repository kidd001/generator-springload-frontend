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
            javascript: "site/assets/js",
            minifiedJavascript: "site/assets/js/dist/"
        },

        /**
         * Concat
         */
        concat: {
            static_mappings: {
                // files: require("./build.json")
            }
        },

        /**
         * Blast generated CSS and JS files.
         */
        clean: {
            javascript: [
                "<%= paths.minifiedJavascript %>/**/*.js",
                "!<%= paths.minifiedJavascript %>/.svn"
            ]
        },

        /**
         * Minify the production Javascript
         */
        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n",
                mangle: {
                    except: ["jQuery", "Backbone"]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,   // remove all unnecessary nesting
                        src: "<%= paths.minifiedJavascript %>/*.js",  // source files mask
                        dest: "<%= paths.minifiedJavascript %>",    // destination folder
                        ext: '.js'   // replace .js to .min.js
                    }
                ]
            },
            dev: {
                options: {
                    beautify: true

                },
                files: "<%= uglify.options.files %>"
            },
            dist: {
                options: {
                    beautify: false
                },
                files: "<%= uglify.options.files %>"
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
                    "<%= paths.minifiedJavascript %>**/*.js",
                    "<%= paths.javascript %>/lib/**/*.js",
                    "/**/*.min.js",
                    "/**/*.mini.js",
                    "/**/jquery.js",
                    "/**/jquery.*.js"
                ]
            },
            all: ['<%= paths.javascript %>/**/*.js']
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
                        dest: 'site/assets/js/lib',
                        rename: function(dest, matchedSrcPath, options) {
                            var newSourcePath = matchedSrcPath.replace(/(\/js\/)|(\/javascripts\/)/,"/");
                            return path.join(dest, newSourcePath);
                        }
                    },
                    {
                        expand: true,
                        cwd: 'bower_components',
                        src: ['**/*.css'],
                        dest: 'site/assets/css/lib',
                        rename: function(dest, matchedSrcPath, options) {
                            var newSourcePath = matchedSrcPath.replace(/(\/css\/)|(\/stylesheets\/)/,"/");
                            return path.join(dest, newSourcePath);
                        }

                    },
                    {
                        expand: true,
                        cwd: 'bower_components',
                        src: ['**/*.scss'],
                        dest: 'site/assets/sass/lib',
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
                        cwd: 'site/assets/sass/',      // Src matches are relative to this path.
                        src: ['**/*.scss', "!**/_*.scss"], // Actual pattern(s) to match.
                        dest: 'site/assets/css/',   // Destination path prefix.
                        ext: '.css'   // Dest filepaths will have this extension.
                    }
                ]
            }
        },


        /**
         * Watch
         */
        watch: {
            watch: {
                css: {
                    files: 'www/assets/sass/**/*.scss',
                    tasks: ['sass'],
                    options: {
                        livereload: true,
                        atBegin: true
                        // port: 9000,
                        // key: grunt.file.read('path/to/ssl.key'),
                        // cert: grunt.file.read('path/to/ssl.crt')
                        // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
                        // }
                    },
                },
                templates: {
                    files: ['content/**/*.json', 'templates/**/*.j2'],
                    tasks: ['template'],
                    options: {
                        livereload: true,
                        atBegin: true
                        // port: 9000,
                        // key: grunt.file.read('path/to/ssl.key'),
                        // cert: grunt.file.read('path/to/ssl.crt')
                        // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
                        // }
                    }
                },
                js: {
                    files: [
                        "<%= paths.javascript %>/**/*.js",
                        "!<%= paths.javascript %>/dist/*.js"
                    ],
                    tasks: ['js'],
                    options: {
                        livereload: true,
                        atBegin: true
                    }
                }
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
        "clean:javascript",
        "jshint",
        "concat",
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
