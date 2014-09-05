/**
 * Handlebars Helper: {{include}}
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var minimatch = require('minimatch');
var matter = require('gray-matter');
var file = require('fs-utils');
var _ = require('lodash');


module.exports.register = function (Handlebars, options, params) {

  var assemble = params.assemble;
  var grunt = params.grunt;
  var opts = options || {};

  /**
   * {{include}}
   * Alternative to {{> partial }}
   *
   * @param  {String} name    The name of the partial to use
   * @param  {Object} context The context to pass to the partial
   * @return {String}         Returns compiled HTML
   * @xample: {{include 'foo' bar}}
   */
  Handlebars.registerHelper('include', function(name, context) {
    var partials = assemble.partials;

    if(!Array.isArray(assemble.partials)) {
      partials = [partials];
    }

    // first try to match on the full name in the partials array
    var filepaths = _.filter(partials, function(filepath) {
      return file.basename(filepath) === name;
    });

    // if no matches, then try minimatch
    if (!filepaths || filepaths.length <= 0) {
      filepaths = partials.filter(minimatch.filter(name));
    }

    var results = filepaths.map(function(filepath) {
      name = file.basename(filepath);

      // Process context, using YAML front-matter, grunt config and Assemble
      // options.data
      var metadata = matter.read(filepath).context;

      // `context`           = the given context (second parameter)
      // `metadata`          = YAML front matter of the partial
      // `opts.data[name]`   = JSON/YAML data file defined in Assemble options.data
      //                       with a basename matching the name of the partial, e.g
      //                       {{include 'foo'}} => foo.json
      // `this`              = Typically either YAML front matter of the "inheriting" page,
      //                       layout, block expression, or "parent" helper wrapping this helper
      // `opts`              = Custom properties defined in Assemble options
      // `grunt.config.data` = Data from grunt.config.data
      //                       (e.g. pkg: grunt.file.readJSON('package.json'))
      grunt.verbose.write(metadata);
      var ctx = _.extend({}, grunt.config.data, opts, this, opts.data[name], metadata, context);
      ctx = grunt.config.process(ctx);

      var template = Handlebars.partials[name];
      var fn = Handlebars.compile(template);

      var output = fn(ctx).replace(/^\s+/, '');

      // Prepend output with the filepath to the original partial
      var include = opts.include || opts.data.include || {};
      if(include.origin === true) {
        output = '<!-- ' + filepath + ' -->\n' + output;
      }

      return output;
    }).join('\n');

    return new Handlebars.SafeString(results);
  });
};
