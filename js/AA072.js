var AA072 = (function () {
    var searchManager;
    var fromTimer = new Date();

    var mapPromise = null;
    var apiPromise = null;
    
    function startTimer() {
        // Update the count down every 1 second
        var timer = setInterval(function () {
            var result = UTILS.formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss');
            document.getElementById("timer").innerHTML = result;
        }, 1000);

        return timer;
    }

    function interval_get() {
        var timer = setInterval(function () {            
            loadMessages(fromTimer);
            fromTimer = new Date();
        }, 10000);

        return timer;
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
                apiPromise = new Promise((resolve, reject) => {
                    resolve(result.Positions);
                });  
                
                var interval = setInterval(() => {
                    if (mapPromise) {
                        // process 2 promises
                        Promise.all([mapPromise, apiPromise]).then(result => { 
                            var positions = result && result[1];
                            setPushpin(positions);
                        });
                        // clear interval
                        clearInterval(interval);
                    }     
                }, 1000);                
            }
        });
    }

    var i = 0, j = 0;
    function setPushpin(positions) 
    {           
        // clear pin
        map.entities.clear();

        i = 0; j = 0;
        positions && positions.forEach(position => {
            if (position.Type === 1) i = i + 1; else j = j + 1;
            
            var loc = new Microsoft.Maps.Location(
                position.Lat,
                position.Lng);
    
            //Create custom Pushpin
            var pin = new Microsoft.Maps.Pushpin(loc, {
                title: position.Phone,
                subTitle: position.Type === 1 ? 'Guest' : 'Driver',
                text: (position.Type === 1 ? i : j) + ''
            });
    
            //Add the pushpin to the map
            map.entities.push(pin);
        });                
    }

    function geocodeQuery(query, callback) {
        //If search manager is not defined, load the search module.
        if (!searchManager) {
            //Create an instance of the search manager and call the geocodeQuery function again.
            Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                searchManager = new Microsoft.Maps.Search.SearchManager(map);
                geocodeQuery(query, callback);
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

                        callback(r);
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
    
    function callback(value) {        
        // 1. callback be 1st
        // 2. api 2sd
        mapPromise = new Promise((resolve, reject) => {
            resolve(value);
        });        
    }

    function init() {
        startTimer();
        interval_get();
    }

    init();

    return {
        geocodeQuery: geocodeQuery,
        callback: callback
    };

})();

var map;
function GetMap() {
    map = new Microsoft.Maps.Map('#map', {
        credentials: 'AuZD1lfJajlhr_Cx6GVG9uR4jzS5Y-PF3EWWGrM0SgdGBUh_8D3fvER4D-Xxco2r'
    });

    //Make a request to geocode New York, NY.
    AA072.geocodeQuery("12 tôn đản quận 4", AA072.callback);
}
