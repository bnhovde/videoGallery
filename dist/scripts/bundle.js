'use strict';

var ns = ns || {};

(function (window, document, undefined) {

    'use strict';

    /**
    * helpers Module
    */

    ns.helpers = function () {

        /**
        * @name closest
        * @desc Walks up the DOM and returns the closest parent element of supplied tag type
        * @attr origin (HTMLElement) - Start element in DOM
        * @attr elem (string) - Tagname to look for
        */
        var closest = function closest(origin, elem) {

            var current = origin;
            elem = elem.toLowerCase();

            while (current.tagName.toLowerCase() !== 'body' && current.tagName.toLowerCase() !== elem) {
                current = current.parentNode;
            }

            if (current.tagName.toLowerCase() === 'body') {
                return false;
            }
            return current;
        };

        /**
        * @name closestClass
        * @desc Walks up the DOM and returns the closest parent element of supplied class
        * @attr origin (HTMLElement) - Start element in DOM
        * @attr className (string) - Classname to look for
        */
        var closestClass = function closestClass(origin, _className) {

            var current = origin;
            var className = _className.toLowerCase();

            while (current.tagName.toLowerCase() !== 'body' && !_hasClass(current, className)) {
                current = current.parentNode;
            }

            if (current.tagName.toLowerCase() === 'body') {
                return false;
            }
            return current;
        };

        /**
        * @name _hasClass
        * @desc Checks if element has class, returns true if so
        * @attr el (HTMLelement) - Element to check
        * @attr className (string) - Class to look for
        */
        var _hasClass = function _hasClass(el, className) {
            if (el.classList) {
                return el.classList.contains(className);
            } else {
                return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
            }
        };

        /**
        * @name getQueryVariable
        * @desc Checks URL for query variable
        * @attr variable (string) - var to check
        * @returns value (string), false if none found
        */
        var getQueryVariable = function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');

            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return false;
        };

        //////////////////

        return {
            closest: closest,
            closestClass: closestClass
        };
    }();
})(window, document);
'use strict';

var ns = ns || {};

ns.panel = function () {

    /**
    * Sliding panel
    */

    var settings = {};
    var defaults = {
        initialState: 'hidden',
        DOM: {
            panel: document.getElementById('panel'),
            close: document.getElementById('panel-close'),
            play: document.getElementById('panel-play'),
            title: document.getElementById('panel-title'),
            year: document.getElementById('panel-year'),
            description: document.getElementById('panel-description'),
            actors: document.getElementById('panel-actors'),
            directors: document.getElementById('panel-directors')
        }
    };

    /**
     * init
     * 
     * Initialise panel
     * @params userOptions (object) - User config
     */
    var init = function init(userOptions) {

        // Merge settings with defaults
        settings = Object.assign(defaults, userOptions);

        // Set initial state
        settings.DOM.panel.setAttribute('data-panel-state', settings.initialState);

        // Attach event listeners to buttons
        settings.DOM.close.addEventListener('click', hide, false);
        settings.DOM.play.addEventListener('click', play, false);
    };

    /**
     * show
     * 
     * Show the bottom panel with movie info
     * @params movieId (object)        - JSON data
     */
    var show = function show(movieId) {

        ns.videoPlayer.stop();

        var movie = ns.videoData.get(movieId);
        var id = movie.id;
        var description = movie.description;
        var title = movie.title;
        var cover = movie.images.cover;
        var releaseYear = movie.meta.releaseYear;

        // Create directors and actors strings

        var actors = movie.meta.actors.map(function (d) {
            return d.name;
        }).join(', ');
        var directors = movie.meta.directors.map(function (d) {
            return d.name;
        }).join(', ');

        // Populate dom elements
        settings.DOM.title.textContent = title;
        settings.DOM.year.textContent = releaseYear;
        settings.DOM.description.textContent = description;
        settings.DOM.actors.textContent = 'Actors: ' + actors;
        settings.DOM.directors.textContent = 'Directors: ' + directors;

        settings.DOM.panel.setAttribute('data-panel-state', 'visible');
    };

    /**
     * hide
     * 
     * Hide the bottom panel
     * @param movieId    (int)  - ID of movie
     */
    var hide = function hide() {
        settings.DOM.panel.setAttribute('data-panel-state', 'hidden');
    };

    /**
     * play
     * 
     * play the selected video
     */
    var play = function play() {
        hide();
        ns.videoPlayer.loadVideo();
    };

    //////////////////

    return {
        init: init,
        show: show,
        hide: hide
    };
}();
"use strict";

var ns = ns || {};

ns.videoData = function () {

    /**
    * Video data store
    */

    var settings = {};
    var defaults = {
        quality: 1.0,
        videoLimit: 10
    };

    /**
     * init
     * 
     * Initialise videoController
     * @params userOptions (object) - User config
     */
    var init = function init(userOptions) {

        // Merge settings with defaults
        settings = Object.assign(defaults, userOptions);
    };

    /**
     * set
     * 
     * Set movie store
     * @params data (object)        - JSON data
     */
    var set = function set(movieData) {
        settings.data = movieData;
    };

    /**
     * get
     * 
     * Get movie data
     * @param movieId    (int)      - ID of movie
     * @returns response (object)   - movie data
     */
    var get = function get() {
        var movieId = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        return settings.data.find(function (movie) {
            return parseInt(movie.id, 10) === parseInt(movieId, 10);
        });
    };

    //////////////////

    return {
        init: init,
        set: set,
        get: get
    };
}();
'use strict';

var ns = ns || {};

ns.videoGallery = function () {

    /**
    * Video Controller
    */

    var settings = {};
    var defaults = {
        quality: 1.0,
        videoLimit: 10,
        DOM: {
            container: document.getElementById('cover-container')
        }
    };

    /**
     * init
     * 
     * Initialise videoController
     * @param userOptions (object) - user settings
     */
    var init = function init(userOptions) {

        // Merge settings with defaults
        settings = Object.assign(defaults, userOptions);
    };

    /**
     * render
     * 
     * Process movie data and render to DOM
     * @param data (object) - Movie data to process
     */
    var render = function render(data) {

        var markup = '';

        // Loop over results and pick out desired data
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var movie = _step.value;

                markup += createMovieMarkup(movie);
            }

            // Add to DOM
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        settings.DOM.container.innerHTML = markup;
    };

    /**
     * createMovieMarkup
     * 
     * Create markup for a single movie item
     * @param movie     (object) - Movie object
     * @returns markup  (string) - generated markup
     */
    var createMovieMarkup = function createMovieMarkup(movie) {
        var id = movie.id;
        var title = movie.title;
        var cover = movie.images.cover;
        var releaseYear = movie.meta.releaseYear;


        var markup = '\n            <button class="cover" data-video-id="' + id + '">\n                <div class="cover__image" style="background-image: url(\'assets/images/covers/' + cover + '\');">\n                    <div class="cover__overlay">\n                        <svg class="icon-eye"><use xlink:href="#icon-eye"></use></svg>\n                    </div>\n                </div>\n                <h4 class="cover__title">' + title + '</h4>\n                <p class="cover__year">' + releaseYear + '</p>\n            </button>';

        return markup;
    };

    //////////////////

    return {
        init: init,
        render: render
    };
}();
'use strict';

var ns = ns || {};

ns.videoPlayer = function () {

    /**
    * Video data store
    */

    var settings = {};
    var defaults = {
        quality: 1.0,
        videoLimit: 10,
        videoSupport: [],
        videoSources: [{ type: 'mp4', element: document.getElementById('mp4video') }, { type: 'webm', element: document.getElementById('webmvideo') }, { type: 'ogv', element: document.getElementById('ogvvideo') }],
        DOM: {
            video: document.getElementById('video'),
            container: document.getElementById('video-container'),
            title: document.getElementById('video-title'),
            year: document.getElementById('video-year'),
            directors: document.getElementById('video-directors'),
            actors: document.getElementById('video-actors')
        }
    };

    /**
     * init
     * 
     * Initialise videoController
     * @params userOptions (object) - User config
     */
    var init = function init(userOptions) {

        // Merge settings with defaults
        settings = Object.assign(defaults, userOptions);

        // Check browser video support
        var myVideo = document.createElement('video');

        if (myVideo.canPlayType('video/mp4')) {
            settings.videoSupport.push('.m4v');
        }
        if (myVideo.canPlayType('video/ogv')) {
            settings.videoSupport.push('.ogv');
        }
        if (myVideo.canPlayType('video/webm')) {
            settings.videoSupport.push('.webm');
        }
    };

    /**
     * show
     * 
     * Shows movie in player
     * @params movieId (int) - ID of movie
     */
    var show = function show() {
        var movieId = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

        var movie = ns.videoData.get(movieId);
        var streams = movie.streams;
        var title = movie.title;
        var placeholder = movie.images.placeholder;
        var releaseYear = movie.meta.releaseYear;

        // Create directors and actors strings

        var actors = movie.meta.actors.map(function (d) {
            return d.name;
        }).join(', ');
        var directors = movie.meta.directors.map(function (d) {
            return d.name;
        }).join(', ');

        // Populate dom elements
        settings.DOM.title.textContent = title;
        settings.DOM.actors.textContent = 'Actors: ' + actors;
        settings.DOM.directors.textContent = 'Directors: ' + directors;
        settings.DOM.year.textContent = '(' + releaseYear + ')';
        settings.DOM.video.style.backgroundImage = 'url("assets/images/' + placeholder + '")';

        // Update the video sources
        updateSources(streams);
    };

    /**
     * updateSources
     * 
     * update the video source elements
     * @params streams (object) - video sources
     */
    var updateSources = function updateSources(streams) {

        settings.DOM.video.pause();

        // Populate new video source
        settings.videoSources.map(function (source) {
            source.element.src = '';
            var newSrc = streams.find(function (stream) {
                return stream.type === source.type;
            });
            if (newSrc !== undefined) {
                source.element.src = newSrc.url;
                source.element.setAttribute('src', newSrc.url);
            }
        });

        settings.DOM.video.load();
    };

    /**
     * play
     * 
     * Plays currently shown movie
     */
    var loadVideo = function loadVideo() {

        // Play the video when loaded
        if (settings.DOM.video.readyState >= settings.DOM.video.HAVE_FUTURE_DATA) {
            play();
        } else {
            settings.DOM.video.addEventListener('canplay', play);
            settings.DOM.video.load();
            settings.DOM.container.setAttribute('data-video-state', 'loading');
        }
    };

    /**
     * play
     * 
     * Plays currently shown movie
     */
    var play = function play() {
        settings.DOM.video.play();
        settings.DOM.container.setAttribute('data-video-state', 'ready');
    };

    /**
     * stop
     * 
     * stops currently playing movie
     */
    var stop = function stop() {
        settings.DOM.video.pause();
    };

    //////////////////

    return {
        init: init,
        show: show,
        loadVideo: loadVideo,
        stop: stop
    };
}();
'use strict';

var ns = ns || {};

(function (window, document, undefined) {

    /**
    * Main.js
    */

    // App config and variables
    var DOM = {
        coverContainer: document.getElementById('cover-container')
    };

    // Initialise modules
    ns.videoData.init();
    ns.videoGallery.init();
    ns.videoPlayer.init();
    ns.panel.init();

    // Load videodata from API
    fetch('api/movies.json').then(function (response) {
        return response.json();
    }).then(function (json) {
        ns.videoData.set(json);
        ns.videoGallery.render(json);
        ns.videoPlayer.show();
    }).catch(function (error) {
        console.log('Error in fetching chain: ', error);
    });

    // Event listeners
    DOM.coverContainer.addEventListener('click', function (e) {

        var clickedEl = e.target;
        var button = ns.helpers.closestClass(clickedEl, 'cover');

        if (button) {
            var videoId = button.getAttribute('data-video-id');
            ns.videoPlayer.show(videoId);
            ns.panel.show(videoId);
        }
    });
})(window, document);

//# sourceMappingURL=bundle.js.map