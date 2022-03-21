var AA072 = (function () {
    var searchManager;
    var fromTimer = new Date();

    function interval_get() {
        //var timer = setInterval(function () {            
        loadMessages(fromTimer);
        fromTimer = new Date();
        //}, 10000);

        //return timer;
    }

    function loadMessages(date) {
        date = UTILS.convertDateTimeToTicks(date);
        str = '';

        API.GET(URL_ADMIN_ORDER + '/interval-gets-map?date=' + date, function (result) {
            // load statistic
            if (!result) return;

            document.getElementById('totalRequests').innerHTML = result.TotalRequests;
            document.getElementById('totalNew').innerHTML = result.TotalNew;
            document.getElementById('totalProcessing').innerHTML = result.TotalProcessing;
            document.getElementById('totalCancel').innerHTML = result.TotalCancel;
            document.getElementById('totalDone').innerHTML = result.TotalDone;

            // load positions
            if (result.Positions) {

            }
        });
    }

    function geocodeQuery(query) {
        //If search manager is not defined, load the search module.
        if (!searchManager) {
            //Create an instance of the search manager and call the geocodeQuery function again.
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                searchManager = new Microsoft.Maps.Search.SearchManager(map);
                geocodeQuery(query);
            });
        } else {
            var searchRequest = {
                where: query,
                callback: function (r) {
                    //Add the first result to the map and zoom into it.
                    if (r && r.results && r.results.length > 0) {
                        var pin = new Microsoft.Maps.Pushpin(r.results[0].location);
                        map.entities.push(pin);
    
                        map.setView({ bounds: r.results[0].bestView });
                    }
                },
                errorCallback: function (e) {
                    //If there is an error, alert the user about it.
                    alert("No results found.");
                }
            };
    
            //Make the geocode request.
            searchManager.geocode(searchRequest);
        }
    }

    function init() {
        interval_get();
    }

    init();

    return {
        geocodeQuery: geocodeQuery
    };

})();

var map;
function GetMap() {
    map = new Microsoft.Maps.Map('#map', {
        credentials: 'AuZD1lfJajlhr_Cx6GVG9uR4jzS5Y-PF3EWWGrM0SgdGBUh_8D3fvER4D-Xxco2r'
    });

    //Make a request to geocode New York, NY.
    AA072.geocodeQuery("12 tôn đản quận 4");
}
