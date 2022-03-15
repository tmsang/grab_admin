const mid_char = " ";
var AA011 = (function () {
    function sendCmt(detailTable, callback) {
        var data = {
            "details": []
        }
        var selectedRows = detailTable.getSelectedRows();
        for (i = 0; i < selectedRows.length; i++) {
            rowData = selectedRows[i].getData();

            //sDetails準備
            idsArr = rowData.ids.split(',')
            sdtails = [];
            for (j = 1; j < idsArr.length; j++) {
                sdtails.push({
                    notificationSeq: j,
                    destinationId: Number(idsArr[j]),
                    verificationFlg: 1//(未読)固定 
                })
            }

            //データを追加
            data.details.push({
                "hospitalCd": COMMON.getHospitalCd(),
                "notificationId": Number(rowData.notificationId),
                "sendUserId": COMMON.loginData().userId,//ログイン時の利用者ID
                "sendDt": COMMON.getReferenceDt(),//date
                "sendCm": rowData.sendCm,
                "notificationKbn": rowData.notificationKbn,
                "sendSt": 2,//(送信済)固定 rowData.sendSt,
                "verificationSt": 1,//(未読)固定 rowData.verificationSt,
                "sDetails": sdtails,
                "deleteFlg": Number(rowData.deleteFlg),
            });
        }
        API.PUT(URL_NOTIFICATIONINFO + "?token=" + COMMON.getToken(),
            data, function (result) {
                callback(result);
            })
    }
    function loadDestination(callback) {
        //apiをお呼び
        API.GET(URL_DESTINATIONMSTDISPLAY
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt()
            , function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    if (!data.details)
                        callback("<optgroup label='" + COMMON.getMessageById("COM_905", "通知先") + "'></optgroup><option value='-1'>無し</option>")
                    else {
                        department = "";
                        content = "";
                        for (var i = 0; i < data.details.length; i++) {
                            if (department != data.details[i].departmentCd) {
                                if (i != 0) {
                                    content = content + group + "</optgroup>";

                                }
                                group = "<optgroup label='" + data.details[i].departmentNm + "'>";
                                department = data.details[i].departmentCd;
                            }
                            group = group + "<option value='" + data.details[i].destinationId + "'>" + data.details[i].userNm + "</option>";
                        }
                        content = content + group + "</optgroup>";
                        callback(content);
                    }
                }
                else if (data.result == -1) {
                    callback("<optgroup label='" + COMMON.getMessageById("COM_905", "通知先") + "'></optgroup><option value='-1'>無し</option>")
                }
            });
    }

    function loadItem(callback) {
        //apiをお呼び
        API.GET(URL_ITEMMST
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt()
            + "&itemKbn=5"//固定
            , function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data);
                }

            });
    }

    function loadParientProfile(callback) {
        //apiをお呼び
        API.GET(URL_PATIENTPROFILE
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt()
            , function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);

                }
            });
    }

    function search(patientId, sendSt, verificationSt1, verificationSt2, verificationSt3, deleteFlg, callback) {
        //apiをお呼び
        API.GET(URL_NOTIFICATIONINFODISPLAY
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&patientId=" + patientId
            + "&sendSt=" + sendSt
            + "&verificationSt1=" + verificationSt1
            + "&verificationSt2=" + verificationSt2
            + "&verificationSt3=" + verificationSt3
            + "&deleteFlg=" + deleteFlg
            , function (data) {
                //0:正常、 1:異常、 -1：データなし
                callback(data);

            });
    }

    function getReadLog(notificationId, callback) {
        API.GET(URL_NOTIFICATIONINFODISPLAY
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&notificationId=" + notificationId
            , function (data) {
                //0:正常、 1:異常、 -1：データなし
                callback(data);
            });
    }

    //前回値確認モーダル表示
    function getHistory(notificationId, callback) {
        // console.log("getHistory  が呼ばれた");
        API.GET(URL_NOTIFICATIONINFODISPLAY
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&notificationId=" + notificationId
            , function (data) {
                //0:正常、 1:異常、 -1：データなし
                callback(data);
            });
    }
    return {
        loadDestination: loadDestination,
        loadItem: loadItem,
        loadParientProfile: loadParientProfile,
        search: search,
        getReadLog: getReadLog,
        getHistory: getHistory,
        sendCmt: sendCmt,
    }
})();
const AA011_GUI = (function () {
    var detailTable = null;    //検索結果
    var hisTable = null;       //ログ履歴
    var hisMicroTable = null;  //microログ履歴
    var readTable = null;      //既読
    var multiSelection = null; //通知先のControl
    var itemLst = [];          //通知区分のデータ一覧
    var cellClicked = null;    //通知先を選択したcellを保存
    var autoChange;            //ページ自動更新 
    var lsPatientHTML = "";

    function init() {
        isLoading = true;
        loadItem();
        loadParientProfile();
        loadDestination();

        hisMicroTable = loadHistryMicroTable();
        hisTable = loadHistryTable();
        readTable = loadReadTable();
        detailTable = loadDetailTable();
        setPageRefresh();

        $('#searchBtn').on('click', clearMessageAndSearch);//検索ボタン
        $('#selectConfirmBtn').on('click', selectDestination);//通知先Popupの選択ボタン
        $('#sendBtn').on('click', sendCmt);//通知送信ボタン
        $('#pageRefreshSwc').on('change', setPageRefresh);//ページ自動更新CheckBox
        $('#searchPatientId').focus();//患者ID　Input
        $("#searchPatientIdLst").html("")

        //IE
        $("#searchPatientId").on('keydown', setPatientDatalist);
        $("#searchPatientId").on('blur', setPatientDatalist);
        $("#searchPatientId").on('click', setPatientDatalist);

        $("#sendBtn").keydown(function (e) {
            if (e.keyCode == KEY_CODE_TAB) {
                $('#pageRefreshSwc').focus();
            }
        });
        COMMON.setEnterKeyAsTab();

    }

    function setPatientDatalist() {
        if (!$("#searchPatientIdLst").html())
            $("#searchPatientIdLst").html(lsPatientHTML);
    }

    //ページ自動更新
    function setPageRefresh() {
        if ($("input[name=pageRefreshSwc]:checked").val()) {
            clearMessageAndSearch();
            //５分１回自動更新
            autoChange = setInterval(search, 5 * 60 * 1000);
        }
        else {
            clearInterval(autoChange);
            autoChange = null;
        }
    }



    function getNameOfItem(value) {
        var item = $.grep(itemLst, function (n, i) {
            return n.value == value;
        });
        if (item.length) {
            return item[0].label;
        }
        return value;
    }

    function loadDetailTable() {

        let kbnEditFlg = false;     //通知区分は名を表示が、リストを選択とIDを渡す
        var cell_color = function (cell, formatterParams) {
            //セルの値を取得    
            var val = cell.getValue();
            //未読の場合
            if (val == "未送信" || val == "未読") {
                cell.getElement().style.background = "#ff7f50";
                cell.getElement().style.color = "red";
                return val;
            }
            if (formatterParams != "既読状況")
                return val;

            //既読状況 column
            //直接HTMLを書き込む
            val = "<a href=\"javascript:AA011_GUI.showReadLog('" + cell.getData().notificationId + "');\">" + val + "</a>";
            return val;
        };

        var cell_sDetails = function (cell, formatterParams) {
            const value = cell.getValue();
            if (value.length) {
                if (formatterParams == "verificationDt")
                    return moment(value[0].verificationDt).isValid() ? moment(value[0].verificationDt).format("YYYY-MM-DD HH:mm:ss") : "";
                if (formatterParams == "userNmKanji")
                    return value[0].userNmKanji;
            }
            return "";
        };

        var cell_byTargetSys = function (cell, formatterParams) {
            const value = cell.getValue();
            var param = null;
            // 1:検体検査 
            // 2:一般細菌検査 
            // 3:抗酸菌検査
            if (value == TARGETSYSTEMKBN_SPECIMEN)
                param = cell.getData().sampleTestDetails[0];
            else
                param = cell.getData().microbiologicalTestDetails[0];
            if (formatterParams == "resultDt")
                return param.resultDt;
            if (formatterParams == "specimenNm")
                return param.specimenNm;
            if (formatterParams == "name") {
                if (value == 1)
                    return param.examinationNm;
                return param.virusNm;
            }
            if (formatterParams == "result") {
                // if (value == 1)
                return param.resultValue;
                // return param.resultNm;
            }
            if (formatterParams == "unit") {
                return param.unit;
            }
            return "";
        };

        var cell_Destinations = function (cell) {
            const value = cell.getValue();
            txt = "";
            ids = "";
            if (value) {
                for (i = 0; i < value.length; i++) {
                    if (value[i].destinationId) {
                        // txt = txt + "," + value[i].destinationId + ":" + value[i].userNmKanji
                        txt = txt + "," + value[i].userNmKanji
                        ids = ids + "," + value[i].destinationId
                    }
                }
                txt = txt.substr(1);
                cell.getData().ids = ids;
            }
            return '<div class="row" style = "margin-top:-7px"><div class="col"><input value="' + txt + '" class="form-control" type="text" placeholder="" aria-label="readonly input example" style="width:135px" readonly></div><div class="col">' +
                '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#selectNoticeModal" onclick="javascript:AA011_GUI.showDestinationPopup(this)" >選択</button></div></div>';

        };

        var cell_patientId = function (cell) {
            const value = cell.getData().notificationId;
            if (value) {
                if (cell.getData().targetSystemKbn == TARGETSYSTEMKBN_SPECIMEN)//
                    return '<a href="javascript:AA011_GUI.showHistory(\'' + value + '\');">' + cell.getData().patientId + '</a>';
                else
                    return '<a href="javascript:AA011_GUI.showHistoryMicro(\'' + value + '\');">' + cell.getData().patientId + '</a>';
            }
        };

        var deleteFlg_cellClick = function (e, cell) {
            var element = cell.getElement();
            var chkbox = element.querySelector('.chkDel');
            // change status
            cell.getData().deleteFlg = cell.getData().deleteFlg == "1" ? "0" : "1";
            chkbox.checked = cell.getData().deleteFlg == "1";
            changeColorRowEdited(cell);
        };

        var cell_notificationNm = function customConditionFormatter(cell) {
            var value = cell.getValue();

            return getNameOfItem(value);
        }

        return new Tabulator("#detailTblAA011", {
            layout: COMMON.layout,//カラムコンテナに合わせる
            pagination: COMMON.pagination,
            paginationSize: COMMON.paginationSize,//5行でページング
            movableColumns: COMMON.movableColumns,//カラムの移動を許可する
            locale: COMMON.locale,
            langs: COMMON.langs,
            keybindings: {
                "navNext": "tab",
            },
            cellEdited: function (cell) {
                if (cell.getValue() || cell.getOldValue())
                    changeColorRowEdited(cell);
            },
            columns: [

                { title: "通知ID", field: "notificationId", width: 103 },
                { title: "条件ID", field: "termsId", width: 103 },
                { title: "検査区分", field: "targetSystemNm", width: 121 },
                {
                    title: "送信", formatter: "rowSelection", titleFormatter: "rowSelection", hozAlign: "center", headerSort: false, cellClick: function (e, cell) {
                        cell.getRow().toggleSelect();
                    }
                },
                { title: "送信状況", field: "sendStNm", hozAlign: "center", width: 114, formatter: cell_color },
                { title: "送信者", field: "sendUserNm", width: 111 },
                {
                    title: "既読状況", field: "verificationStNm", hozAlign: "center", width: 115, formatter: cell_color, formatterParams: "既読状況"
                },
                {
                    title: "最終確認日時", field: "sDetails", width: 150, formatter: cell_sDetails, formatterParams: "verificationDt"
                },
                {
                    title: "最終確認者", field: "sDetails", width: 130, formatter: cell_sDetails, formatterParams: "userNmKanji"
                },
                {
                    title: "患者ID", field: "patientId", width: 115, formatter: cell_patientId
                },
                { title: "患者氏名", field: "patientNmKanji", width: 115 },
                { title: "依頼科", field: "departmentNm", width: 190 },
                { title: "検査結果確定日時", field: "targetSystemKbn", formatter: cell_byTargetSys, formatterParams: "resultDt", width: 200 },
                { title: "検体", field: "targetSystemKbn", formatter: cell_byTargetSys, formatterParams: "specimenNm", width: 155 },
                { title: "通知項目", field: "targetSystemKbn", formatter: cell_byTargetSys, formatterParams: "name", width: 190 },
                { title: "結果", field: "targetSystemKbn", formatter: cell_byTargetSys, formatterParams: "result", width: 86 },
                { title: "単位", field: "targetSystemKbn", formatter: cell_byTargetSys, formatterParams: "unit", width: 95 },
                {
                    title: "通知先", field: "sDetails", width: 250, formatter: cell_Destinations,
                    cellClick: function (e, cell) {
                        cellClicked = cell;
                    },
                },
                {
                    title: "通知区分", field: "notificationKbn", width: 150, formatter: cell_notificationNm, editor: "select", editorParams: function (cell) {

                        return {
                            values: itemLst
                        };
                    }
                },
                {
                    title: "送信時コメント", field: "sendCm", formatter: "textarea", width: 200, editor: "textarea",
                    editorParams: {
                        elementAttributes: {
                            maxlength: "50", //set the maximum character length of the textarea element to 10 characters
                        },
                        // mask:"AAA-999",
                        // Placeholder: "（担当技師入力欄）",
                        verticalNavigation: "editor", //navigate cursor around text area without leaving the cell
                    }
                },
                {
                    title: "削除フラグ", field: "deleteFlg", formatter: "html", width: 100, formatter: function (cell) {
                        return '<input type="checkbox" class="chkDel" id="chkDel"' + (cell.getValue() == "1" ? 'checked' : '') + ' />'
                    },
                    cellClick: deleteFlg_cellClick
                }
            ],
        });
    }

    function loadReadTable() {
        return new Tabulator("#detailReadTbl", {
            layout: COMMON.layout,//カラムコンテナに合わせる
            pagination: COMMON.pagination,
            paginationSize: COMMON.paginationSize,//5行でページング
            movableColumns: COMMON.movableColumns,//カラムの移動を許可する
            locale: COMMON.locale,
            langs: COMMON.langs,
            columns: [

                { title: "通知先", field: "userNmKanji", width: 242 },
                { title: "確認日時", field: "verificationDt", width: 232 },//sendDt
                {
                    title: "確認状況", field: "verificationFlgNm", width: 139
                },
            ]
        });
    }

    function loadHistryTable() {
        return new Tabulator("#detailHistryTbl", {
            layout: COMMON.layout,//カラムコンテナに合わせる
            pagination: COMMON.pagination,
            paginationSize: COMMON.paginationSize,//5行でページング
            movableColumns: COMMON.movableColumns,//カラムの移動を許可する
            locale: COMMON.locale,
            langs: COMMON.langs,
            columns: [

                { title: "検査結果確定日時", field: "resultDt", width: 227 },
                { title: "通知項目", field: "examinationNm", width: 174 },
                { title: "結果値", field: "resultValue", hozAlign: "right", width: 99 },
                { title: "単位", field: "unit", width: 113 },
            ]
        });
    }

    function loadHistryMicroTable() {
        var cell_targetSystemNm = function (cell) {
            return $("#headerMicroTargetSystemNmLbl").text();
        }
        return new Tabulator("#detailHistryMiroTbl", {
            layout: COMMON.layout,//カラムコンテナに合わせる
            pagination: COMMON.pagination,
            paginationSize: COMMON.paginationSize,//5行でページング
            movableColumns: COMMON.movableColumns,//カラムの移動を許可する
            locale: COMMON.locale,
            langs: COMMON.langs,
            columns: [

                { title: "最終報告日時", field: "resultDt", width: 147 },
                { title: "検査区分", field: "targetSystemKbn", width: 122, formatter: cell_targetSystemNm },
                { title: "検査方法", field: "smearNm", width: 186 },//検査方法
                { title: "検体", field: "specimenNm", width: 137 },
                { title: "菌名", field: "virusNm", width: 187 },
                { title: "結果", field: "resultValue", width: 83 },//resultNm
                { title: "コメント", field: "comment", width: 212 },
            ]
        });
    }

    function clearMessageAndSearch() {
        COMMON.hideMessage();
        search();
    }

    function search() {
        AA011.search($("#searchPatientId").val().split(mid_char)[0]
            , $("input[name=processOptions]:checked").val()
            , (!$("#searchUnreadChk:checked").val() ? 0 : 1)
            , (!$("#searchPartiallyReadChk:checked").val() ? 0 : 1)
            , (!$("#searchReadChk:checked").val() ? 0 : 1)
            , (!$("#searchDeleteFlgChk:checked").val() ? 0 : 1), function (data) {
                if (data.result == -2) {
                    COMMON.showSearchResult("AA021_901");
                    detailTable.clearData();
                }
                else if (data.result == -1 || data.details.length == 0) {
                    COMMON.showSearchResult();
                    detailTable.clearData();
                }
                else {
                    detailTable.setData(data.details);
                }
                $("#timeLbl").text(COMMON.getReferenceDt);
                if (isLoading) {//when loading
                    isLoading = false;
                    $('#background').modal('hide')
                    $('#searchPatientId').focus();//患者ID　Input
                }


            });
    }

    function loadParientProfile() {
        AA011.loadParientProfile(function (result) {
            for (var i = 0; i < result.length; i++) {
                // $("#searchPatientIdLst").append($("<option>").attr('value', result[i].patientId + mid_char + result[i].patientNmKanji).text(result[i].patientId + mid_char + result[i].patientNmKanji));
                lsPatientHTML += "<option value = '" + result[i].patientId + mid_char + result[i].patientNmKanji + "' label ='" + result[i].patientId + mid_char + result[i].patientNmKanji + "' />";
            }
        })
    }

    function loadDestination() {
        AA011.loadDestination(function (result) {
            $("#detailDepartmentOptg").html(result);

            multiSelection = $('#detailDepartmentOptg').multiSelect({
                selectableOptgroup: true,
                // afterSelect: function(value){
                // },
                // afterDeselect: function(value){
                // }
            }).data('multiselect');
        });
    }

    function loadItem() {
        AA011.loadItem(function (data) {
            itemDetails = data.details[0].itemDetails;
            for (var i = 0; i < itemDetails.length; i++) {
                itemLst.push({
                    label: itemDetails[i].itemNm,
                    value: itemDetails[i].itemCd
                });
            }
        })
    }

    function changeColorRowEdited(cell) {
        // cell.getData().edited = "1";
        cell.getRow().select();//.getElement().style.backgroundColor = "yellow";
        // cell.getRow().getElement().style.backgroundColor = "yellow";
    }

    //既読ログ確認
    function showReadLog(notificationId) {
        $('.kidoku-log').trigger("click");
        AA011.getReadLog(notificationId, function (data) {
            if (data.result == -1) {
                $("#headrPatientIdLbl").text("")
                $("#headrPatientNmLbl").text("")
                $("#headrExaminationNmLbl").text("")
                $("#headrResultValueLbl").text("")
                $("#headrUnitLbl").text("")
                $("#headrSendDtLbl").text("")
                readTable.clearData();
            } else if (data.result == 0) {
                result = data.details;
                $("#headrPatientIdLbl").text(result[0].patientId)
                $("#headrPatientNmLbl").text(result[0].patientNmKanji)
                $("#headrExaminationNmLbl").text(result[0].sampleTestDetails[0].examinationNm)
                $("#headrResultValueLbl").text(result[0].sampleTestDetails[0].resultValue)
                $("#headrUnitLbl").text(result[0].sampleTestDetails[0].unit)
                $("#headrSendDtLbl").text(result[0].sendDt)

                readTable.setData(result[0].sDetails);
            }
        });
    }

    //前回値確認モーダル表示 _検体検査
    function showHistory(notificationId) {
        // console.log("showHistory が呼ばれた");
        $('.history-val').trigger("click");
        AA011.getHistory(notificationId, function (data) {
            //【ヘッダー部】
            if (data.result == -1) {
                $("#headerPatientIdLbl").text("")
                $("#headerPatientNmLbl").text("")
                $("#headerDepartmentLbl").text("")
                $("#headerResultDtLbl").text("")
                $("#headerExaminationNmLbl").text("")
                $("#headerResultValueLbl").text("")
                $("#headerUnitLbl").text("")

                hisTable.clearData();
            } else if (data.result == 0) {
                result = data.details;
                $("#headerPatientIdLbl").text(result[0].patientId)
                $("#headerPatientNmLbl").text(result[0].patientNmKanji)
                $("#headerDepartmentLbl").text(result[0].departmentNm)
                $("#headerResultDtLbl").text(result[0].sampleTestDetails[0].resultDt)
                $("#headerExaminationNmLbl").text(result[0].sampleTestDetails[0].examinationNm)
                $("#headerResultValueLbl").text(result[0].sampleTestDetails[0].resultValue)
                $("#headerUnitLbl").text(result[0].sampleTestDetails[0].unit)

                hisTable.setData(result[0].sampleTestDetails[0].SampleTestDetailsBef);
            }
        });
    }

    //前回値確認モーダル表示 細菌検査
    function showHistoryMicro(notificationId) {
        // console.log("showHistoryMicro が呼ばれた");
        $('.history-micro-val').trigger("click");
        AA011.getHistory(notificationId, function (data) {
            //【ヘッダー部】
            if (data.result == -1) {
                $("#headerMicroPatientIdLbl").text("")
                $("#headerMicroPatientNmLbl").text("")
                $("#headerMicroDepartmentLbl").text("")
                $("#headerMicroResultDtLbl").text("")
                $("#headerMicroTargetSystemNmLbl").text("")
                $("#要確認").text("")
                $("#headrMicroSpecimenNmLbl").text("")
                $("#headerMicroVirusNmLbl").text("")
                $("#headerMicroResultNmLbl").text("");//resultNm)
                $("#headerMicroCommentLbl").text("")

                hisMicroTable.clearData();
            } else if (data.result == 0) {
                result = data.details;

                $("#headerMicroPatientIdLbl").text(result[0].patientId)
                $("#headerMicroPatientNmLbl").text(result[0].patientNmKanji)
                $("#headerMicroDepartmentLbl").text(result[0].departmentNm)
                $("#headerMicroResultDtLbl").text(result[0].microbiologicalTestDetails[0].resultDt)
                $("#headerMicroTargetSystemNmLbl").text(result[0].targetSystemNm)
                $("#要確認").text(result[0].microbiologicalTestDetails[0].smearNm)
                $("#headrMicroSpecimenNmLbl").text(result[0].microbiologicalTestDetails[0].specimenNm)
                $("#headerMicroVirusNmLbl").text(result[0].microbiologicalTestDetails[0].virusNm)
                $("#headerMicroResultNmLbl").text(result[0].microbiologicalTestDetails[0].resultValue);//resultNm)
                $("#headerMicroCommentLbl").text(result[0].microbiologicalTestDetails[0].comment)
                // targetSystemKbn
                hisMicroTable.setData(result[0].microbiologicalTestDetails[0].microbiologicalTestDetailsBef);
            }
        });
    }

    function showDestinationPopup(obj) {

        $(obj).parent().click();
        multiSelection.deselect_all();
        multiSelection.select(cellClicked.getData().ids.split(','));
        $(".ms-hover").removeClass('ms-hover');
    }

    function selectDestination() {
        ids = "";
        text = "";
        $("#detailDepartmentOptg option[selected]").each(function () {
            ids = ids + "," + $(this).val();
            // text = text + "," + $(this).val() + ":" + $(this).text();
            text = text + "," + $(this).text();
        });
        $($(cellClicked.getElement()).find("input")).val(text.substr(1))
        cellClicked.getData().ids = ids;
        changeColorRowEdited(cellClicked);
        if (ids) {
            $("#closeConfirmBtn").click();
        }
        else {
            COMMON.showMessageById("COM_907", "通知先");
        }
    }

    function checkValidBeforeSend() {
        msg = "";
        COMMON.hideMessage();
        var selectedRows = detailTable.getSelectedRows();
        if (selectedRows.length == 0)
            msg = " " + COMMON.getMessageById("COM_907", "送信対象")
        if (!msg) {
            for (i = 0; i < selectedRows.length; i++) {
                if (!selectedRows[i].getData().ids)
                    msg = msg + ",通知ID[" + selectedRows[i].getData().notificationId + "]:" + COMMON.getMessageById("COM_907", "通知先") + "<br/>"
                if (!selectedRows[i].getData().notificationKbn)
                    msg = msg + ",通知ID[" + selectedRows[i].getData().notificationId + "]:" + COMMON.getMessageById("COM_907", "通知区分") + "<br/>"
            }
        }
        if (msg) {
            COMMON.showMessage(msg.substr(1))
            return false
        }
        return true;
    }

    function sendCmt() {
        if (checkValidBeforeSend()) {

            AA011.sendCmt(detailTable, function (data) {
                if (data.result == 0) {
                    COMMON.showMessageById("COM_001", "", "", "success")
                    //最新の情報を画面に表示する。
                    search();
                }
                else {
                    COMMON.showMessage("result:" + data.result + "<br>" + data.errorMsg)
                }
            })
        }
    }
    return {
        init: init,
        showReadLog: showReadLog,
        showHistory: showHistory,
        showHistoryMicro: showHistoryMicro,
        showDestinationPopup: showDestinationPopup,
    };
})();
$(document).ready(function () {
    AA011_GUI.init();
});
