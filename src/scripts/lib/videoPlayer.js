var ns = ns || {};

ns.videoPlayer = (function(){
    
    /**
    * Video data store
    */
    
    let settings = {};
    const defaults = {
        quality     : 1.0,
        videoLimit  : 10,
        videoSupport: [],
        videoSources : [
            { type : 'mp4', element : document.getElementById('mp4video') }, 
            { type : 'webm', element : document.getElementById('webmvideo') }, 
            { type : 'ogv', element : document.getElementById('ogvvideo') }
        ],
        DOM : {
            video       : document.getElementById('video'),
            container   : document.getElementById('video-container'),
            title       : document.getElementById('video-title'),
            year        : document.getElementById('video-year'),
            directors   : document.getElementById('video-directors'),
            actors      : document.getElementById('video-actors')
        }
    }

    /**
     * init
     * 
     * Initialise videoController
     * @params userOptions (object) - User config
     */  
    const init = function(userOptions) {
        
        // Merge settings with defaults
        settings = Object.assign(defaults, userOptions);
        
        // Check browser video support
        const myVideo = document.createElement('video');

        if (myVideo.canPlayType('video/mp4')) { settings.videoSupport.push('.m4v'); }
        if (myVideo.canPlayType('video/ogv')) { settings.videoSupport.push('.ogv'); }
        if (myVideo.canPlayType('video/webm')) { settings.videoSupport.push('.webm'); }
    }
    
    /**
     * show
     * 
     * Shows movie in player
     * @params movieId (int) - ID of movie
     */
    const show = function(movieId = 1){
        const movie = ns.videoData.get(movieId);
        const { streams, title, images: { placeholder }, meta: { releaseYear } } = movie;
        
        // Create directors and actors strings
        const actors = movie.meta.actors.map( d => d.name).join(', ');
        const directors = movie.meta.directors.map( d => d.name).join(', ');
        
        // Populate dom elements
        settings.DOM.title.textContent = title;
        settings.DOM.actors.textContent = `Actors: ${actors}`;
        settings.DOM.directors.textContent = `Directors: ${directors}`;
        settings.DOM.year.textContent = `(${releaseYear})`;
        settings.DOM.video.style.backgroundImage = `url("/assets/images/${placeholder}")`;
        
        // Update the video sources
        updateSources(streams);
    }
    
    /**
     * updateSources
     * 
     * update the video source elements
     * @params streams (object) - video sources
     */
    const updateSources = function(streams){
        
        settings.DOM.video.pause();
        
        // Populate new video source
        settings.videoSources.map( source => {
            source.element.src = '';
            let newSrc = streams.find( stream => stream.type === source.type );  
            if (newSrc !== undefined) { 
                source.element.src = newSrc.url;
                source.element.setAttribute('src', newSrc.url);
            }
        })
        
        settings.DOM.video.load();
    }
    
    /**
     * play
     * 
     * Plays currently shown movie
     */
    const loadVideo = function(){
        
        // Play the video when loaded
        if (settings.DOM.video.readyState >= settings.DOM.video.HAVE_FUTURE_DATA) {
            play();
        } else {
            settings.DOM.video.addEventListener('canplay', play );
            settings.DOM.video.load();
            settings.DOM.container.setAttribute('data-video-state', 'loading');
        }        
    }
    
    /**
     * play
     * 
     * Plays currently shown movie
     */
    const play = function(){
        settings.DOM.video.play();
        settings.DOM.container.setAttribute('data-video-state', 'ready');
    }

    
    //////////////////
    
    return {
        init,
        show,
        loadVideo
    }
    
}());