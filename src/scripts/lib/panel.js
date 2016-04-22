var ns = ns || {};

ns.panel = (function(){
    
    /**
    * Sliding panel
    */
    
    let settings = {};
    const defaults = {
        initialState  : 'hidden',
        DOM : {
            panel       : document.getElementById('panel'),
            close       : document.getElementById('panel-close'),
            play        : document.getElementById('panel-play'),
            title       : document.getElementById('panel-title'),
            year        : document.getElementById('panel-year'),
            description : document.getElementById('panel-description'),
            actors      : document.getElementById('panel-actors'),
            directors   : document.getElementById('panel-directors')
        }
    }

    /**
     * init
     * 
     * Initialise panel
     * @params userOptions (object) - User config
     */  
    const init = function(userOptions) {
        
        // Merge settings with defaults
        settings = Object.assign(defaults, userOptions);
        
        // Set initial state
        settings.DOM.panel.setAttribute('data-panel-state', settings.initialState);

        // Attach event listeners to buttons
        settings.DOM.close.addEventListener('click', hide, false);
        settings.DOM.play.addEventListener('click', play, false);
    }
    
    /**
     * show
     * 
     * Show the bottom panel with movie info
     * @params movieId (object)        - JSON data
     */
    const show = function(movieId){
        const movie = ns.videoData.get(movieId);
        const { id, description, title, images: { cover }, meta: { releaseYear } } = movie;

        // Create directors and actors strings
        const actors = movie.meta.actors.map( d => d.name).join(', ');
        const directors = movie.meta.directors.map( d => d.name).join(', ');
        
        // Populate dom elements
        settings.DOM.title.textContent = title;
        settings.DOM.year.textContent = releaseYear;
        settings.DOM.description.textContent = description;
        settings.DOM.actors.textContent = `Actors: ${actors}`;
        settings.DOM.directors.textContent = `Directors: ${directors}`;     

        settings.DOM.panel.setAttribute('data-panel-state', 'visible');
    }
    
    /**
     * hide
     * 
     * Hide the bottom panel
     * @param movieId    (int)  - ID of movie
     */
    const hide = function(){
        settings.DOM.panel.setAttribute('data-panel-state', 'hidden');
    }
    
    /**
     * play
     * 
     * play the selected video
     */
    const play = function(){
        hide();
        ns.videoPlayer.loadVideo();
    }
    
    //////////////////
    
    return {
        init,
        show,
        hide
    }
    
}());