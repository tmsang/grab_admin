var AA071 = (function () {

    var requests = [];
    var fromTimer = new Date();
    var str = '';

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
            loadMessages(fromTimer);
            fromTimer = new Date();
        }, 10000);

        return timer;
    }

    function loadMessages(date) { 
        date = UTILS.convertDateTimeToTicks(date);        
        str = '';
        
        API.GET(URL_ADMIN_ORDER + '/interval-gets?date='+date, function (result) {
            if (result.Requests) {
                requests = result.Requests;

                // load requests
                requests && requests.length > 0 && requests.forEach(request => {
                    request._Distance = UTILS.formatCurrency(request.Distance);
                    request._Cost = UTILS.formatCurrency(request.Cost);
                    request._Status = COMMON.getStatusWithClassCss(request.Status);
                    request._RequestDateTime = UTILS.formatDate(request.RequestDateTime, 'hh:mm');

                    // show Messages
                    var template = requestTemplate(request);
                    str += template;                                       
                });
                document.getElementById('list-messages').innerHTML = str;

                // show No1, No2, No3
                requests && requests.length > 0 && requests.forEach(request => {                                                                                
                    if (result.NearestDrivers) {
                        var nearestDrivers = result.NearestDrivers;
                        nearestDrivers = nearestDrivers.filter(p => {
                            return p.OrderId == request.OrderId;
                        });

                        var no1 = nearestDrivers && getIndexOrderBy(nearestDrivers, 0);
                        var no2 = nearestDrivers && getIndexOrderBy(nearestDrivers, 1);
                        var no3 = nearestDrivers && getIndexOrderBy(nearestDrivers, 2);
                        
                        var pos1 = arrangement(1, no1, no2, no3);
                        var pos2 = arrangement(2, no1, no2, no3);
                        var pos3 = arrangement(3, no1, no2, no3);

                        $('#' + request.OrderId + ' #icon_1').html(pos1 + '');
                        $('#' + request.OrderId + ' #icon_2').html(pos2 + '');
                        $('#' + request.OrderId + ' #icon_3').html(pos3 + '');
                    }
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

        function arrangement(index, p1, p2, p3) {
            if (index === 1) {
                if (p1 > 0 && p1 <= 1) return p1;
                if (p2 > 0 && p2 <= 1) return p2;
                if (p3 > 0 && p3 <= 1) return p3;
                return 0;
            }
            if (index === 2) {
                if (p1 > 1 && p1 <= 3) return p1;
                if (p2 > 1 && p2 <= 3) return p2;
                if (p3 > 1 && p3 <= 3) return p3;
                return 0;
            }
            if (index === 3) {
                if (p1 > 3 && p1 <= 5) return p1;
                if (p2 > 3 && p2 <= 5) return p2;
                if (p3 > 3 && p3 <= 5) return p3;
                return 0;
            }
        }

        function getIndexOrderBy(arr, index) {
            if (!arr) return 0;
            arr.sort(compare);
            var result = arr.length > index && arr[index];
            
            return result ? result.Distance : 0;
        }        

        function compare(a, b) {
            if (a.Distance < b.Distance) return -1;
            if (a.Distance > b.Distance ) return 1;            
            return 0;
        }

        function requestTemplate(request) {
            var s = `
                <li id="{OrderId}">
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
                </li>                
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
