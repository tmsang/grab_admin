const API = (function () {
    var contentType = 'application/x-www-form-urlencoded';

    var catchError = function (error) {
        console.log(error);
        COMMON.showMessage(COMMON.getMessageById("COM_901") + "<br><hr> API error catch:<br>" + JSON.stringify(error));
    };

    const _get = function (url, callback, isNoAuthorization) {
        try {
            $.ajax({
                beforeSend: function (xhr) {
                    if (isNoAuthorization) return;
                    xhr.setRequestHeader('Authorization', 'Bearer ' + COMMON.getToken());
                },
                method: 'get',
                contentType: contentType,
                url: url,
                success: function (data) {
                    callback(data);
                },
                error: function (jqXHR, textStatus, err) {
                    catchError(jqXHR);
                }
            });
        }
        catch (error) {
            catchError(error);
        }
    };

    const _post = function (url, params, callback, isNoAuthorization) {
        try {
            $.ajax({
                beforeSend: function (xhr) {
                    if (isNoAuthorization) return;
                    xhr.setRequestHeader('Authorization', 'Bearer ' + COMMON.getToken());
                },
                method: 'post',
                contentType: contentType,
                url: url,
                data: params,
                success: function (data) {
                    callback(data)
                },
                error: function (jqXHR, textStatus, err) {
                    catchError(jqXHR);
                }
            });
        }
        catch (error) {
            catchError(error);
        }
    };

    const _put = function (url, params, callback, isNoAuthorization) {
        try {
            $.ajax({
                beforeSend: function (xhr) {
                    if (isNoAuthorization) return;
                    xhr.setRequestHeader('Authorization', 'Bearer ' + COMMON.getToken());
                },
                method: 'put',
                contentType: contentType,
                url: url,
                data: params,
                success: function (data) {
                    callback(data)
                },
                error: function (jqXHR, textStatus, err) {
                    catchError(jqXHR);
                }
            });
        }
        catch (error) {
            catchError(error);
        }
    };

    return {
        GET: _get,
        POST: _post,
        PUT: _put,
    };
})();

var UTILS = (function() {

    function formatCurrency(s) {
        s = s + '';
        return s && s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatDate(date, format) 
    { 
        var m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];            
        var day, month, year, hour, minute, second;

        if (typeof date === 'string' || date instanceof String) 
        {
            // "2022-03-10T15:03:19.153419"
            day = date.substring(8, 10) * 1;
            month = date.substring(5, 7) * 1;
            year = date.substring(0, 4) * 1;
            hour = date.substring(11, 13) * 1;
            minute = date.substring(14, 16) * 1;
            second = date.substring(17, 19) * 1;
        }        
        else if (date instanceof Date) 
        {
            day = date.getDate();
            month = date.getMonth();
            year = date.getFullYear();
            hour = date.getHours();
            minute = date.getMinutes();
            second = date.getSeconds();                                
        }                

        if (format === 'dd-MMM-yyyy hh:mm:ss') {
            return (day < 10 ? '0' : '') + day
                + '-' + m[month]
                + '-' + year + ' '
                + (hour < 10 ? '0' : '') + hour + ':'
                + (minute < 10 ? '0' : '') + minute + ':'
                + (second < 10 ? '0' : '') + second;
        }
        if (format === 'dd-MMM-yyyy hh:mm') {
            return (day < 10 ? '0' : '') + day
                + '-' + m[month]
                + '-' + year + ' '
                + (hour < 10 ? '0' : '') + hour + ':'
                + (minute < 10 ? '0' : '') + minute;
        }
        if (format === 'dd-MMM-yyyy') {
            return (day < 10 ? '0' : '') + day + '-' + m[month] + '-' + year;
        }
        if (format === 'hh:mm') {
            return (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute;
        }        
        return 'UnKown';    
    }

    function convertDateTimeToTicks(date) {
        // the number of .net ticks at the unix epoch
        var epochTicks = 621355968000000000;
        // there are 10000 .net ticks per millisecond
        var ticksPerMillisecond = 10000;
        // calculate the total number of .net ticks for your date
        var ticks = epochTicks + (date.getTime() * ticksPerMillisecond);

        return ticks;
    }

    return {
        formatCurrency: formatCurrency,
        formatDate: formatDate,
        convertDateTimeToTicks: convertDateTimeToTicks
    };
})();

var PROTOTYPE = (function() {
    

})();
