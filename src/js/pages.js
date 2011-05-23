var PIC = window.PIC || {};

PIC.pages = function (pageSelector) {
    
    var $container = $(pageSelector),
        pages = {
            '/enter-name':  'enter-name.html',
            '/overview':    'overview.html',
            '/set-word':    'set-word.html',
            '/view-word':   'view-word.html',
            '/guess-word':  'guess-word.html',
            '/watch-team':  'watch-team.html'
        }
    
    return  {
        // Don't want to couple the page selector and app too tightly,
        // consider better way to do this
        getPage: function (url) {
            
        },
        goBack: function () {
            
        },
        goForwards: function () {
            
        }
    }
}