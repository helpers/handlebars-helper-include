'use strict';

var mapFiles = require('map-files');
var filterKeys = require('filter-keys');
var matter = require('gray-matter');
var _ = require('lodash');
var extend = _.extend;


/**
 * {{include}}, alternative to {{> partial }}
 *
 * @param  {String} `name` The name of the partial to use
 * @param  {Object} `context` The context to pass to the partial
 * @return {String} Returns compiled HTML
 * @xample: {{include 'foo' bar}}
 */

module.exports.register = function (Handlebars, options, params) {
  var assemble = params.assemble;
  var grunt = params.grunt;

  // Assemble options
  var opts = options || {};
  var dataFiles = grunt.config.data;

  // Allow the `includes` property to be used on the options
  var includes = mapFiles(opts.includes || assemble.partials);

  includes = _.reduce(includes, function (acc, value, key) {
    var o = matter(value.content);
    acc[key] = extend(value, o);
    return acc;
  }, {});

  Handlebars.registerHelper('include', function(pattern, locals) {
    if (Object.keys(includes).length === 0) {
      return '';
    }

    var matches = filterKeys(includes, pattern);
    var len = matches.length;
    var i = 0;

    if (len === 0) {
      return '';
    }

    var stack = '';

    while (i < len) {
      var name = matches[i++];
      var include = includes[name];

      // `context`           = the given context (second parameter)
      // `metadata`          = YAML front matter of the include
      // `opts.data[name]`   = JSON/YAML data file defined in Assemble options.data
      //                       with a basename matching the name of the include, e.g
      //                       {{include 'foo'}} => foo.json
      // `this`              = Typically either YAML front matter of the "inheriting" page,
      //                       layout, block expression, or "parent" helper wrapping this helper
      // `opts`              = Custom properties defined in Assemble options
      // `grunt.config.data` = Data from grunt.config.data
      //                       (e.g. pkg: grunt.file.readJSON('package.json'))

      var context = {};
      extend(context, this);
      extend(context, opts);
      extend(context, dataFiles);
      extend(context, opts.data[name]);
      extend(context, include.data);
      extend(context, locals);

      context = grunt.config.process(context);

      var fn = Handlebars.compile(include.content);
      var res = fn(context);

      // Prepend result with the filepath to the original include
      var includeOpts = opts.include || opts.data.include || {};
      if(includeOpts.origin === true) {
        res = '<!-- ' + include.path + ' -->\n' + res;
      }

      stack += res;
    }

    return new Handlebars.SafeString(stack.replace(/^\s+|\s+$/g, ''));
  });
};
