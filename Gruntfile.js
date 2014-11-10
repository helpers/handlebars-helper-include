/*
 * helper-include <https://github.com/helpers/helper-include>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('.assemblerc.yml'),

    jshint: {
      all: ['Gruntfile.js', 'test/*.js', '*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    title: 'this title is from the config (root context).',
    description: 'this description is from the config (root context).',

    // Pull down a list of repos from Github.
    assemble: {
      options: {
        flatten: true,
        site: '<%= site %>',
        subtitle: 'This subtitle is a custom property in the Assemble options',

        // Ensure that assets path calculates properly
        assets: 'test/assets',
        data: ['test/fixtures/data/*.json'],
        includes: ['test/fixtures/includes/*.hbs'],
        helpers: ['index.js'],
      },

      tests: {
        options: {
          title: 'this title is from the options.',
          description: 'this description is from the options.'
        },
        files: {
          'test/actual/options_data/': ['test/fixtures/*.hbs']
        }
      }
    },

    clean: {
      test: ['test/actual/**/*.html']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('assemble');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'clean', 'assemble']);

};
