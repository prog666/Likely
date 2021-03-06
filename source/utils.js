var config = require('./config');

var bool  = {yes: true, no: false},
    rUrl  = /(https?|ftp):\/\/[^\s\/$.?#].[^\s]*/gi;

var utils = {
    /**
     * Simple $.each, only for objects
     * 
     * @param {Object} object
     * @param {Function} callback
     */
    each: function (object, callback) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                callback(object[key], key);
            }
        }
    },

    /**
     * Convert array-like object to array
     * 
     * @param {Object} arrayLike
     * @return {Array}
     */
    toArray: function (arrayLike) {
        return Array.prototype.slice.call(arrayLike);
    },

    /**
     * Merge given dictionaries (objects) into one object
     * 
     * @param {Object} ...objects
     * @return {Object}
     */
    merge: function () {
        var result = {};
    
        for (var i = 0; i < arguments.length; i ++) {
            var arg = arguments[i];
        
            if (arg) {
                for (var key in arg) {
                    result[key] = arg[key];
                }
            }
        }
    
        return result;
    },

    /**
     * Extend one (target) object by other (subject)
     * 
     * @param {Object} target
     * @param {Object} subject
     */
    extend: function (target, subject) {
        for (var key in subject) {
            target[key] = subject[key];
        }
    },

    /**
     * Convert "yes" and "no" to true and false.
     * 
     * @param {Node} node
     */
    bools: function (node) {
        var result = {},
            data   = node.dataset;
    
        for (var key in data) {
            var value = data[key];
        
            result[key] = bool[value] || value;
        }
    
        return result;
    },

    /**
     * Map object keys in string to its values
     * 
     * @param {String} text
     * @param {Object} data
     * @return {String}
     */
    template: function (text, data) {
        return text.replace(/\{([^\}]+)\}/g, function (value, key) {
            return key in data ? data[key] : value;
        });
    },

    /**
     * Map object keys in URL to its values
     * 
     * @param {String} text
     * @param {Object} data
     * @return {String}
     */
    makeUrl: function (text, data) {
        for (var key in data) {
            data[key] = encodeURIComponent(data[key]);
        }
    
        return utils.template(text, data);
    },

    /**
     * Construct a CSS class
     * 
     * @param {String} type
     * @param {String} service
     * @return {String}
     */
    likelyClass: function (type, service) {
        var fullClass = config.prefix + type;
    
        return fullClass + " " + fullClass + "_" + service;
    },

    /**
     * Create query string out of data
     * 
     * @param {Object} data
     * @return {String}
     */
    query: function (data) {
        var filter = encodeURIComponent,
            query  = [];
    
        for (var key in data) {
            if (typeof data[key] === 'object') continue;
        
            query.push(filter(key) + '=' + filter(data[key]));
        }
    
        return query.join('&');
    },

    /**
     * Get URL of invoked script from Stack error 
     * 
     * @return {String}
     */
    getStackURL: function () {
        try {
            throw new Error;
        }
        catch (e) {
            return e.stack.match(rUrl).pop().replace(/:\d+:\d+$/, '');
        }
    },

    /**
     * Get URL from URL (Yo dawg, I heard you like URLs)
     * 
     * @param {String} url
     * @return {String}
     */
    getURL: function (url) {
        return decodeURIComponent(url.match(/url=([^&]+)/).pop());
    },

    /**
     * Set value in object using dot-notation
     * 
     * @param {Object} object
     * @param {String} key
     * @param {Object} value
     */
    set: function (object, key, value) {
        var frags = key.split('.'),
            last  = null;
    
        frags.forEach(function (key, index) {
            if (typeof object[key] === 'undefined') {
                object[key] = {};
            }
        
            if (index !== frags.length - 1) {
                object = object[key];
            }
        
            last = key;
        });
    
        object[last] = value;
    },

    /**
     * Get a value from multidimensional object
     * 
     * @param {Object} object
     * @param {String} key
     * @return {Object}
     */
    get: function (object, key) {
        var frags = key.split('.');
    
        for (var i = 0; i < frags.length; i ++) {
            var key = frags[i];
        
            if (!key in object) {
                object = null;
            
                break;
            }
        
            object = object[key];
        }
    
        return object;
    }
};

module.exports = utils; 