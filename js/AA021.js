(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
}(jQuery));

const AA021 = (function () {
    function search(targetSys, notiId, patientId, collentDt, callback) {
        API.GET(URL_NOTIFICATIONINFODISPLAY
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetSystemKbn=" + targetSys
            + "&notificationId=" + notiId
            + "&patientId=" + patientId
            + "&collectDt=" + collentDt, function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {
                    COMMON.showSearchResult();
                }
                // count data 
                else if (data.result == -2) {
                    COMMON.showSearchResult("AA021_901");
                }
                else {
                    // showMessagError("004");
                }
            });
    };

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
                //error　ログイン認証失敗
                else if (data.result == -1) {
                    // showMessagError("AA001_001");
                }
                else {
                    // showMessagError("004");
                }
            });
    }

    function loadSystemList(itemKbn, callback) {
        //apiをお呼び
        API.GET(URL_ITEMMST
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt()
            + "&itemKbn=" + itemKbn
            , function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {
                    // showMessagError("AA001_001");
                }
                else {
                    // showMessagError("004");
                }
            });
    }

    return {
        search: search,
        loadParientProfile: loadParientProfile,
        loadSystemList: loadSystemList,
    };

})();

const AA021_GUI = (function () {
    var detailTable;

    function init() {
        detailTable = loadInitTable();

        $("#searchCollectDtCal").datepicker(COMMON.dateSetting);

        var systemDate = moment(COMMON.getReferenceDt()).format(DATE_FORMAT);

        $("#searchCollectDtCal").datepicker("setDate", systemDate);

        $('#searchBtn').on('click', searchData);

        COMMON.setEnterKeyAsTab();
        loadData();
    }

    function loadInitTable() {
        var cell_byTargetSys = function (cell, formatterParams) {
            const value = cell.getValue();
            var param = null;
            // 1:検体検査 
            // 2:一般細菌検査 
            // 3:抗酸菌検査
            if (value === 1)
                param = cell.getData().sampleTestDetails[0];
            else
                param = cell.getData().microbiologicalTestDetails[0];

            if (formatterParams == "notification") {
                if (value === 1)
                    return param.examinationNm;
                return param.virusNm;
            }

            if (formatterParams == "resultValue")
                return param.resultValue;

            if (formatterParams == "unit") {
                if (value === 1)
                    return param.unit;
            }

            if (formatterParams == "collectDt") {
                return moment(param.collectDt).isValid() ? moment(param.collectDt).format(DATE_FORMAT) : "";
            }
            return "";
        };

        // Create table
        return new Tabulator("#detailTbl", {
            layout: COMMON.layout,//カラムコンテナに合わせる
            pagination: COMMON.pagination,
            paginationSize: COMMON.paginationSize,//5行でページング
            movableColumns: COMMON.movableColumns,//カラムの移動を許可する
            locale: COMMON.locale,
            langs: COMMON.langs,
            selectable: 1,
            columns: [
                { title: "通知ID", field: "notificationId", width: 100 },
                { title: "検査区分", field: "targetSystemNm", width: 150 },
                { title: "患者ID", field: "patientId", width: 150 },
                { title: "患者氏名", field: "patientNmKanji", width: 100 },
                { title: "診療科", field: "departmentNm", width: 170 },
                { title: "採取日", field: "targetSystemKbn", hozAlign: "left", width: 120, formatter: cell_byTargetSys, formatterParams: "collectDt" },
                { title: "通知項目", field: "targetSystemKbn", hozAlign: "left", formatter: cell_byTargetSys, formatterParams: "notification", width: 240 },
                { title: "結果", field: "targetSystemKbn", hozAlign: "left", formatter: cell_byTargetSys, formatterParams: "resultValue", width: 100 },
                { title: "単位", field: "targetSystemKbn", hozAlign: "left", formatter: cell_byTargetSys, formatterParams: "unit", width: 100 }
            ],
            rowClick: function (e, row) {
                showDetail(row);
                row.select();
            }
        });
    }

    function loadData() {
        //Load data for [利用者ID] datalist
        AA021.loadParientProfile(function (result) {
            var options = '';
            for (var i = 0; i < result.length; i++) {
                options += '<option value="' + result[i].patientId + ' ' + result[i].patientNmKanji + '" label="' + result[i].patientId + ' ' + result[i].patientNmKanji + '" />';
            };
            $("#patientList").html(options);
        });

        //Load data for [対象システム] list
        AA021.loadSystemList(8, function (result) {
            var options = '<option value="" label="" />';
            var itemMst = result[0];
            for (var i = 0; i < itemMst.itemDetails.length; i++) {
                options += '<option value="' + itemMst.itemDetails[i].itemCd + '" label="' + itemMst.itemDetails[i].itemNm + '" />';
            }
            $("#searchTargetSystemCmb").html(options);

        });

    }

    //tab　クリックイベント
    var triggerTabList = [].slice.call(document.querySelectorAll('#infoTab a'));
    triggerTabList.forEach(function (triggerEl) {
        var tabTrigger = new bootstrap.Tab(triggerEl);

        triggerEl.addEventListener('click', function (event) {
            event.preventDefault()
            tabTrigger.show()
        });
    });

    // Search click
    function searchData() {
        COMMON.hideMessage();
        hideDetail();
        detailTable.clearData();
        AA021.search($('#searchTargetSystemCmb').val(),
            $('#searchNotificationIdTxt').val(),
            $('#searchPatientIdLst').val().split(" ")[0],
            $('#searchCollectDtCal').val(), function (result) {
                detailTable.setData(result);
            })
    };

    /**テーブル行のデータを取得する*/
    function showDetail(row) {
        //行の中身
        var _rowData = row.getData();

        // 1:検体検査 
        // 2:一般細菌検査 
        // 3:抗酸菌検査

        hideDetail();
        if (_rowData.targetSystemKbn != 1 && _rowData.targetSystemKbn != 2 && _rowData.targetSystemKbn != 3) {
            return;
        }

        showPatientInfo(_rowData);
        //検体検査の場合
        if (_rowData.targetSystemKbn == 1) {
            showSampleTestDetail(_rowData.sampleTestDetails[0]);
        }
        else {
            showMicrobiologicalTestDetails(_rowData.microbiologicalTestDetails[0], _rowData.targetSystemNm);
        }
    }

    function hideDetail() {
        //hide control
        $('.base-info').addClass('display-none');
        $('.kentai-kensa').addClass('display-none');
        $('.saikin-ippan').addClass('display-none');
    }
    function showPatientInfo(detail) {
        $('.base-info').removeClass('display-none');
        $(".detail1NotificationIdLb").html(detail.notificationId);
        $(".detail1PatientIdLbl").html(detail.patientId);
        $(".detail1PatientNmLbl").html(detail.patientNmKanji);
        $(".detail1AgeLbl").html(detail.patientAge);
        $(".detail1GenderLbl").html(detail.patientGenderNm);
        $(".detail1HospitalizationCdLbl").html(detail.hospitalizationNm);
        $(".detail1departmentNmLbl").html(detail.departmentNm);
    }

    function showSampleTestDetail(obj) {
        $('.kentai-kensa').removeClass('display-none');
        $(".detail2ExaminationDtLbl").html(obj.examinationDt);
        $(".detail2ResultDtLbl").html(obj.resultDt);
        $(".detail2SpecimenNmLbl").html(obj.specimenNm);
        $(".detail2ExaminationNmLbl").html(obj.examinationNm);
        $(".detail2ResultValueLbl").html(obj.resultValue);
        $(".detail2UnitLbl").html(obj.unit);
        $(".detail2LowValueLbl").html(obj.lowValue);
        $(".detail2UpperValueLbl").html(obj.upperValue);
        $(".detail2JudgeLbl").html(obj.judge);
    }

    function showMicrobiologicalTestDetails(obj, targetSystemNm) {
        $('.saikin-ippan').removeClass('display-none');
        $(".detailTbl3TargetSystemNmLbl").html(targetSystemNm);
        $(".detailTbl3CollectDtLbl").html(obj.collectDt);
        $(".detailTbl3ResultDtLbl").html(obj.resultDt);
        $(".detailTbl3SpecimenNmLbl").html(obj.specimenNm);
        $(".detailTbl3SmearNmLbl").html(obj.smearNm);
        $(".detailTbl3VirusNmLbl").html(obj.virusNm);
        $(".detailTbl3QuantityNmLbl").html(obj.quantityNm);
        $(".detailTbl3ResultNmLbl").html(obj.resultValue);
        $(".detailTbl3CommentLbl").html(obj.comment);
    }

    $("#searchNotificationIdTxt").inputFilter(function (value) {
        return /^\d*$/.test(value);
    });


    return {
        init: init,
    };

})();

$(document).ready(function () {
    AA021_GUI.init();
});