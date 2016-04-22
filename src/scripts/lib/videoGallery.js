var ns = ns || {};

ns.videoGallery = (function(){
    
    /**
    * Video Controller
    */
    
    let settings = {};
    const defaults = {
        quality     : 1.0,
        videoLimit  : 10,
        DOM : {
            container   : document.getElementById('cover-container')
        }
    }

    /**
     * init
     * 
     * Initialise videoController
     * @param userOptions (object) - user settings
     */  
    const init = function(userOptions) {
        
        // Merge settings with defaults
        settings = Object.assign(defaults, userOptions);
    }

    /**
     * render
     * 
     * Process movie data and render to DOM
     * @param data (object) - Movie data to process
     */
    const render = function(data){
        
        let markup = '';
        
        // Loop over results and pick out desired data
        for (let movie of data) {
            markup += createMovieMarkup(movie);
        }
        
        // Add to DOM
        settings.DOM.container.innerHTML = markup;
    }
    
    /**
     * createMovieMarkup
     * 
     * Create markup for a single movie item
     * @param movie     (object) - Movie object
     * @returns markup  (string) - generated markup
     */
    const createMovieMarkup = function(movie){
        
        const { id, title, images: { cover }, meta: { releaseYear } } = movie;
        
        let markup = `
            <button class="video-cover" data-video-id="${id}">
                <div class="video-cover__cover" style="background-image: url('assets/images/covers/${cover}');">
                    <div class="video-cover__overlay">
                        <svg class="icon-eye"><use xlink:href="#icon-eye"></use></svg>
                    </div>
                </div>
                <h4 class="video-cover__title">${title}</h4>
                <p class="video-cover__year">${releaseYear}</p>
            </button>`;
        
        return markup;
    }
    
    //////////////////
    
    return {
        init,
        render
    }
    
}());