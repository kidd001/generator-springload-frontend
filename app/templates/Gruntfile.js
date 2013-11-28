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
            javascript: "<%= jsPath %>",
            minifiedJavascript: "<%= jsPath %>/dist/",
            sprites: "<%= spritePath %>",
            images: "<%= imgPath %>",
            css: "<%= cssPath %>",
            sass: "<%= sassPath %>"
        },

        /**
         * Concat
         */
        concat: {

            js: {
                src: '<%%= paths.javascript %>/lib/{.*,*}/*.js',
                dest: '<%%= paths.minifiedJavascript %>/scripts.js'
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
                    "<%%= paths.minifiedJavascript %>/{.*,*}/*.js",
                    "!<%%= paths.minifiedJavascript %>/.svn"
                ]
            },
            server: '.tmp'
        },

        /**
         * Minify images and svgs
         */
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= paths.assets %>/images/',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%%= paths.assets %>/images/'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= paths.assets %>/images/',
                    src: '{,*/}*.svg',
                    dest: '<%%= paths.assets %>/images/'
                }]
            }
        },

        /**
         * Minify the production Javascript
         */
        uglify: {
            options: {
                banner: "/*! <%%= pkg.name %> <%%= grunt.template.today(\"yyyy-mm-dd\") %> */\n",
                mangle: {
                    except: ["jQuery", "Backbone", "<%= nameSpace %>"]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,   // remove all unnecessary nesting
                        src: "<%%= paths.minifiedJavascript %>/*.js",  // source files mask
                        dest: "<%%= paths.minifiedJavascript %>",    // destination folder
                        ext: '.min.js'   // replace .js to .min.js
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
                    "<%%= paths.minifiedJavascript %>/*.js",
                    "<%%= paths.javascript %>/lib/{.*,*}/*.js",
                    "/**/*.min.js",
                    "/**/*.mini.js",
                    "/**/jquery.js",
                    "/**/jquery.*.js"
                ]
            },
            all: ['<%%= paths.javascript %>/{.*,*}/*.js']
        },

        /**
         * Copy Bower dependencies
         */
        copy: {
            main: {

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

        crawl: {
            css: {
                paths: ["<%%= paths.assets %>/css/lib/**/*.css"],
                output: "<%%= paths.assets %>/css/cssassets.md"
            }
        },


        exec: {
            <% if (requireRambo) { %>
            sprites: {
                command: "rambo --input <%%= paths.sprites %> --output <%%= paths.images %> --csspath <%%= paths.css %> --sasspath <%%= paths.sass %>/sprites --cssfile _sprites.scss --testpage_dir <%%= paths.assets %> --testpage_name sprite_test_page.html",
            }
            <% } %>
        },



        /**
         * Watch
         */
        watch: {

            css: {
                files: '<%%= paths.assets %>/sass/{,*/}*.scss',
                tasks: ['sass']
            },

            js: {
                files: [
                    "<%%= paths.javascript %>/{,*/}*.js",
                    "!<%%= paths.javascript %>/dist/*.js"
                ],
                tasks: ['js']
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
        }<% if (requireFred) { %>,
        subgrunt: {
            fred: {
                projects: {
                    // For each of these projects, the specified grunt task will be executed:
                    'bower_components/fred': 'default'
                }
            }
        } <% } %>
    });

    // The cool way to load your grunt tasks
    Object.keys( pkg.dependencies ).forEach( function( dep ){
        if( dep.substring( 0, 6 ) === 'grunt-' ) grunt.loadNpmTasks( dep );
    });

    /**
     * Creates a file with all CSS imports
     * --------------------------------------------------------------------
     */
    grunt.registerMultiTask("crawl", "Create a file with all CSS assets", function() {
        var paths = grunt.file.expand( this.data.paths ),
            out = this.data.output,
            contents = "", contentsCss = "", contentsCssImport = "";
        paths.forEach(function( path ) {
            contentsCss += '<link rel="stylesheet" type="text/css" href="' + path + '" />\n';
            contentsCssImport += '@import url("' + path + '");\n';
        });
        contents += contentsCssImport + "\n\n" + contentsCss;
        grunt.file.write( out, contents );
    });


    /**
     * Register all the tasks
     * --------------------------------------------------------------------
     */


    // Grunting runs the Compass task by default
    grunt.registerTask("default", [
        "copy:bower",
        "sass",
        "crawl:css",
        "js",
    ]);

    grunt.registerTask("js", [
        "clean:js",
        "jshint",
        "concat:js",
        "uglify:dist"
    ]);

    grunt.registerTask("default", [
        "sass",
        "js"
    grunt.registerTask("image", [
        "imagemin",
        "svgmin"
    ]);

    var installTasks = [
        <% if (requireFred) { %>"subgrunt:fred",<% } %>
        "sass",
        "js"
    ];

    <% if (requireRambo) { %>
    grunt.registerTask("sprites", [
        "exec:sprites"
    ]);
    <% } %>

    grunt.registerTask("install", installTasks) ;
};
