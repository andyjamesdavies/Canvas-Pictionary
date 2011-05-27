var PIC = window.PIC || {};

PIC.pages = function (pageSelector) {
    
    var $container = $(pageSelector),
        pages = {}
    
    return  {
        add: function (url, src, callback) {
            pages[url] = {
                src: src,
                callback: callback
            }
        },
        open: function (url, callback) {
            var page = pages[url];
            $container.load(page.src, function () {
                history.pushState(null, null, url);
                if (typeof page.callback === 'function') {
                    page.callback();
                }
                if (typeof callback === 'function') {
                    callback();
                }
            })
        },
        back: function () {
            
        },
        forwards: function () {
            
        }
    }
}