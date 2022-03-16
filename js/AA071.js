var AA071 = (function () {

    function startTimer() {                
        // Update the count down every 1 second
        var timer = setInterval(function () {
            var now = new Date();
            var day = now.getDate();
            var month = now.getMonth();
            var year = now.getFullYear();
            var hour = now.getHours();
            var minute = now.getMinutes();

            var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            var result = (day < 10 ? '0' : '') + day
                + '-' + m[month]
                + '-' + year + ' '
                + (hour < 10 ? '0' : '') + hour + ':'
                + (minute < 10 ? '0' : '') + minute;

            document.getElementById("timer").innerHTML = result;
        }, 1000);

        return timer;
    }

    function loadMessages() {        
        API.GET(URL_ADMIN_ORDER + '/requests', function (requests) {
            if (requests) {  
                debugger;                              
                return;
            }                        
        });
    }

    function init() {
        startTimer();
        loadMessages();
    }

    init();

    return {

        startTimer: startTimer,
        loadMessages: loadMessages
    };
})();
