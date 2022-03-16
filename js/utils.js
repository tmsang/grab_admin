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
