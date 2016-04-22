var ns = ns || {};

ns.videoData = (function(){
    
    /**
    * Video data store
    */
    
    let settings = {};
    const defaults = {
        quality     : 1.0,
        videoLimit  : 10
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

    }
    
    /**
     * set
     * 
     * Set movie store
     * @params data (object)        - JSON data
     */
    const set = function(movieData){
        settings.data = movieData; 
    }
    
    /**
     * get
     * 
     * Get movie data
     * @param movieId    (int)      - ID of movie
     * @returns response (object)   - movie data
     */
    const get = function(movieId = 1){
        return settings.data.find( movie => parseInt(movie.id, 10) === parseInt(movieId, 10)  );    
    }
    
    //////////////////
    
    return {
        init,
        set,
        get
    }
    
}());