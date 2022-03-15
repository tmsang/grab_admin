const API = (function () {
    const _get = function (url, callback) {
        console.log("get " + url + ": " + new Date());
        try {
            $('#background').modal('show');
            $.ajax({
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                },
                crossDomain: true,
                url: url,
                dataType: 'json',
                processData: false,
                contentType: false,
                success: function (data) {
                    console.log("get success" + url + ": " + new Date());
                    if (!isLoading)// when loading is slow, don't hide . it will be hide at page need
                        $('#background').modal('hide')
                    //0:正常 1:異常 2:排他　-1：データなし	
                    if (data.result < -2 && !data.errorMsg)
                        COMMON.logout();
                    else
                        if (data.result == "0" || data.result == -1 || data.result == -2)
                            callback(data)
                        else if (data.errorMsg)
                            COMMON.showMessage(data.errorMsg);
                        else COMMON.showMessageById("COM_901")
                },
                error: function (jqXHR, textStatus, err) {
                    $('#background').modal('hide')
                    console.log("get error " + url + ": " + new Date());
                    console.log(jqXHR, '\n', textStatus, '\n', err)
                    COMMON.showMessage(COMMON.getMessageById("COM_901") + "<br><hr> API GET error:<br>" + url + "<br>" + textStatus + ":" + err);
                }
            });
        }
        catch (error) {
            $('#background').modal('hide')
            COMMON.showMessage(COMMON.getMessageById("COM_901") + "<br><hr> get error catch:<br>" + JSON.stringify(error));
            console.log(error);
        }
    };
    const _post = function (url, formData, callback) {
        try {
            $.ajax({
                method: 'post',                
                dataType: 'application/x-www-form-urlencoded',                                
                url: url,
                data: formData,
                success: function (data) {
                    //0:正常 1:異常 2:排他　-1：データなし										
                    if (data.result == "1")
                        COMMON.showMessageById("COM_901")
                    else if (data.result == "2")
                        COMMON.showMessage("排他エラー")
                    else
                        callback(data)
                },
                error: function (jqXHR, textStatus, err) {
                    console.log(jqXHR, '\n', textStatus, '\n', err)
                    COMMON.showMessage(url + "<br>" + textStatus + ":" + err);
                }
            });
        }
        catch (error) {
            COMMON.showMessage(COMMON.getMessageById("COM_901") + "<br><hr>" + JSON.stringify(error));
            console.log(error);
        }
    };

    const _put = function (url, formData, callback) {
        $('#background').modal('show');
        console.log(formData);
        try {
            $.ajax({
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                processData: false,
                contentType: false,
                url: url,
                data: JSON.stringify(formData),
                success: function (data) {
                    $('#background').modal('hide')
                    //0:正常 1:異常 2:排他　-1：データなし		
                    //2-2で返却されたJSONオブジェクトにエラーメッセージが格納されている場合、格納されたエラーメッセージを表示して、処理を終了する。
                    if (data.result < -1 && !data.errorMsg)
                        COMMON.logout();
                    else
                        if (data.errorMsg) {
                            // COMMON.showMessage(data.errorMsg + "<br><hr>" + url + "<br><u>→data from API:</u><br>" + JSON.stringify(data) + "<br><u>→data send to API:</u><br>" + JSON.stringify(formData));
                            COMMON.showMessage(data.errorMsg);
                        }
                        else if (data.result == "1")
                            // COMMON.showMessage(data.errorMsg);
                            COMMON.showMessage(COMMON.getMessageById("COM_901") + "<hr>" + JSON.stringify(formData));
                        else if (data.result == "2")
                            COMMON.showMessage("排他エラー")
                        else if (data.result == "-1")
                            COMMON.showMessage(data.result + "<br>" + data.errorMsg + "<br>" + JSON.stringify(formData));
                        else {
                            callback(data)
                            $(".alert-danger").html(JSON.stringify(formData))
                        }
                },
                error: function (jqXHR, textStatus, err) {
                    $('#background').modal('hide')
                    console.log("put error " + url + ": " + new Date());
                    console.log(jqXHR, '\n', textStatus, '\n', err)
                    COMMON.showMessage(url + "<br>" + textStatus + ":" + err + JSON.stringify(formData));
                }
            });
        }
        catch (error) {
            $('#background').modal('hide')
            COMMON.showMessage(COMMON.getMessageById("COM_901") + "<br>" + JSON.stringify(error));
            console.log(error);
        }
    };


    return {
        GET: _get,
        POST: _post,
        PUT: _put,
    };
})();
