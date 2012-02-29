/*
 * mustache-loader.js - Mustache template loader to go with flask-mustache
 *
 * This depends on jQuery, and either:
 * - Twitter's Hogan.js:  https://github.com/twitter/hogan.js or
 * - Mustache.js:         https://github.com/janl/mustache.js
 *
 * Usage:
 *
 *   $('#target').mustache('includes/_user.mustache', {user_name:'Jan'});
 */

// authored as a jQuery plugin
(function($) {

    // this is a cached lookup table of templates
    var cache = {};

    var load = function(templateName) {
        // this function takes names like: "includes/_user.mustache"
        // and loads them from somewhere else.

        // they can be cached as functions, or as strings.
        // Strings are template content.
        if (typeof cache[templateName] === 'undefined') {
            // first we need to convert slashes to hyphens, since
            // they're DOM valid
            var domTemplateName = templateName.replace('/', '-');

            if (document.getElementById(domTemplateName)) {
                // stupid hack to turn HTML-encoded templates into strings, see:
                // http://stackoverflow.com/a/2419664/61435
                cache[templateName] = $('<div />').html(
                    $(document.getElementById(domTemplateName)).html()).text();
            }
        }

        return cache[templateName];
    };

    var render = function(templateName, context) {

        // first we need to try and load the template
        var template = load(templateName);

        if (typeof template === 'undefined') {
            $.error('Unknown template ' + templateName);
        }

        else if (typeof template === 'function') {
            // template has been pre-compiled, just return it
            return template(context);
        }

        // template hasn't been pre-compiled yet
        // so we need to do other things
        if (window.Hogan) {
            return Hogan.compile(template).render(context);
        }
        else if (window.Mustache) {
            return Mustache.render(template, context);
        }

        // we don't have Hogan or Mustache, so we need to bail
        $.error('Must have either Hogan.js or Mustache.js to load string templates');
    };

    $.fn.mustache = function(templateName, context) {
        // replaces the content of the passed in element with the content
        // rendered by Mustache

        return $(this).html(render(templateName, context));
    };

})(jQuery);