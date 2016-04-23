var ns = ns || {};

(function(window, document, undefined) {
    
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
    fetch('api/movies.json')
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            ns.videoData.set(json)
            ns.videoGallery.render(json)
            ns.videoPlayer.show()
        }).catch(function(error) {
            console.log('Error in fetching chain: ', error)
        });
        
    
    // Event listeners
    DOM.coverContainer.addEventListener('click', function(e){
        
        var clickedEl = e.target;
        var button = ns.helpers.getClosest(clickedEl, '.cover');
        
        if (button) {
            var videoId = button.getAttribute('data-video-id');
            ns.videoPlayer.show(videoId);
            ns.panel.show(videoId);
        }
    });


})(window, document);