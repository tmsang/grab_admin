var AA071 = (function () {

    var requests = [];
    var fromTimer = new Date();

    function startTimer() {
        // Update the count down every 1 second
        var timer = setInterval(function () {
            var result = UTILS.formatDate(new Date(), 'dd-MMM-yyyy hh:mm');
            document.getElementById("timer").innerHTML = result;
        }, 1000);

        return timer;
    }

    function interval_get() {
        var timer = setInterval(function () {
            loadMessages(fromTimer, new Date());
            fromTimer = new Date();
        }, 5000);

        return timer;
    }

    function loadMessages(from, to) { 
        from = UTILS.convertDateTimeToTicks(from);
        to = UTILS.convertDateTimeToTicks(to);
        debugger;
        API.GET(URL_ADMIN_ORDER + '/interval-gets?from='+from+'&to='+to, function (result) {
            if (result) {
                requests = requests.concat(result);

                // load requests
                requests && requests.length > 0 && requests.forEach(request => {
                    request._Distance = UTILS.formatCurrency(request.Distance);
                    request._Cost = UTILS.formatCurrency(request.Cost);
                    request._Status = COMMON.getStatusWithClassCss(request.Status);
                    request._RequestDateTime = UTILS.formatDate(request.RequestDateTime, 'hh:mm');

                    var template = requestTemplate(request);
                    var li = document.createElement('li');
                    li.id = request.OrderId;
                    li.innerHTML = template;
                    document.getElementById('list-messages').appendChild(li);
                });

                // load statistic                                
                var statistic = COMMON.getStatistic(requests);
                document.getElementById('totalRequests').innerHTML = statistic.totalRequests;
                document.getElementById('totalNew').innerHTML = statistic.totalNew;
                document.getElementById('totalProcessing').innerHTML = statistic.totalProcessing;
                document.getElementById('totalCancel').innerHTML = statistic.totalCancel;
                document.getElementById('totalDone').innerHTML = statistic.totalDone;
            }
        });

        function requestTemplate(request) {
            var s = `
                <details>
                    <summary>
                        <div class="clearfix">
                            <div class="left">
                                {GuestName} ({GuestPhone}) - {_Distance} (km) - {_Cost} (vnd)                                
                            </div>                            

                            <div class="right">
                                <span class="position">
                                    <span class="progress {_Status}">&nbsp;</span>
                                </span>

                                <span id="icon_1" class="icon" data-toggle="modal" data-target="#directionModal">
                                    0.0 
                                </span><i class="fas fa-biking icon1"></i>
                                <span id="icon_2" class="icon" data-toggle="modal" data-target="#directionModal">
                                    0.0 
                                </span><i class="fas fa-biking icon2"></i>
                                <span id="icon_3" class="icon" data-toggle="modal" data-target="#directionModal">
                                    0.0 
                                </span><i class="fas fa-biking icon3"></i>

                                <span class="timer">{_RequestDateTime}</span>
                            </div>                            
                        </div>
                    </summary>
                    <div class="address"><b>From: </b> {FromAddress}</div>
                    <div class="address"><b>To: </b> {ToAddress}</div>
                </details>
            `;

            var result = s.replace(/{\w+}/gi, function (match) {
                var field = match.replace(/[{}]/gi, '');
                return request[field];
            });

            return result;
        }
    }

    function init() {
        startTimer();

        interval_get();
    }

    init();

    return {

        startTimer: startTimer,
        loadMessages: loadMessages
    };
})();
