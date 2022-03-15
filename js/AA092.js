const mid_char = " ";

const AA092 = (function () {

    function update(editTable, newEditParam, callback) {
        var value = [];
        var values = {};
        var i = 1;
        var startDt = moment(DATE_DEFAULT_BEGIN).format(DATE_FORMAT);
        var endDt = moment(DATE_DEFAULT_END).format(DATE_FORMAT);        

        var data = editTable.getRows()[0] != null ? editTable.getRows()[0].getData() : {};

        if (newEditParam.CtlTargetSystemKbnCmb == TARGETSYSTEMKBN_SPECIMEN) {
            value.push({
                termsSeq: i,
                logic: "AND",
                itemKbn: "1",
                item: data.editexaminationCdLst ? data.editexaminationCdLst : "",
                lowValue: data.editResultLowValueTxt ? data.editResultLowValueTxt : "",
                lowTerms: data.editLowTermsCmb ? (data.editLowTermsCmb == 0 ? "" : data.editLowTermsCmb) : "",
                upperValue: data.editResultUpperValueTxt ? data.editResultUpperValueTxt : "",
                upperTerms: data.editUpperTermsCmb ? (data.editUpperTermsCmb == 0 ? "" : data.editUpperTermsCmb) : ""
            });
            i++;
        }

        if (newEditParam.CtlTargetSystemKbnCmb != TARGETSYSTEMKBN_SPECIMEN) {
            value.push({
                termsSeq: i++,
                logic: "AND",
                itemKbn: "2",
                item: newEditParam.CtlTargetSystemKbnCmb == "2" ? newEditParam.CtlGnrbacteriologicalLst : "",
                lowValue: newEditParam.CtlTargetSystemKbnCmb == "2" ? newEditParam.CtlGnrResultValueCmb : newEditParam.CtlMtbResultValueCmb,
                lowTerms: "=",
                upperValue: "",
                upperTerms: ""
            });
        }

        if (newEditParam.CtlDepartmentCmb)
            value.push({
                termsSeq: i++,
                logic: "AND",
                itemKbn: "3",
                item: "",
                lowValue: newEditParam.CtlDepartmentCmb,
                lowTerms: "=",
                upperValue: "",
                upperTerms: ""
            });
        if (newEditParam.CtlHospitalizationCmb)
            value.push({
                termsSeq: i++,
                logic: "AND",
                itemKbn: "4",
                item: "",
                lowValue: newEditParam.CtlHospitalizationCmb,
                lowTerms: "=",
                upperValue: "",
                upperTerms: ""
            });
        if (newEditParam.CtlGenderCmb)
            value.push({
                termsSeq: i++,
                logic: "AND",
                itemKbn: "5",
                item: "",
                lowValue: newEditParam.CtlGenderCmb,
                lowTerms: "=",
                upperValue: "",
                upperTerms: ""
            });

        if (newEditParam.CtlTargetSystemKbnCmb == TARGETSYSTEMKBN_GENERAL) {
            if (newEditParam.CtlGnrSpecimenLst)
                value.push({
                    termsSeq: i++,
                    logic: "AND",
                    itemKbn: "6",
                    item: "",
                    lowValue: newEditParam.CtlGnrSpecimenLst,
                    lowTerms: "=",
                    upperValue: "",
                    upperTerms: ""
                });
        }

        if (newEditParam.CtlTargetSystemKbnCmb != TARGETSYSTEMKBN_SPECIMEN) {
            var paramValue = newEditParam.CtlTargetSystemKbnCmb == "2" ? newEditParam.CtlGnrExaminationKbnCmb : newEditParam.CtlMtbExaminationKbnCmb;
            if (paramValue)
                value.push({
                    termsSeq: i++,
                    logic: "AND",
                    itemKbn: "7",
                    item: "",
                    lowValue: paramValue,
                    lowTerms: "=",
                    upperValue: "",
                    upperTerms: ""
                });
        }

        if (newEditParam.CtlTargetSystemKbnCmb == TARGETSYSTEMKBN_GENERAL) {
            if (newEditParam.CtlGnrCommentTxt)
                value.push({
                    termsSeq: i++,
                    logic: "AND",
                    itemKbn: "8",
                    item: "",
                    lowValue: newEditParam.CtlGnrCommentTxt,
                    lowTerms: "=",
                    upperValue: "",
                    upperTerms: ""
                });
        }

        newEditParam.CtlDeleteFlgChk = newEditParam.CtlDeleteFlgChk ? 1 : 0;

        values = {
            details: [{
                hospitalCd: COMMON.getHospitalCd(),
                termsId: newEditParam.termsId,
                targetSystemKbn: newEditParam.CtlTargetSystemKbnCmb,
                termsNm: newEditParam.CtlTermsNmTxt,
                notificationDetail: newEditParam.CtlNotificationDetailTxt,
                termDetails: value,
                startDt: newEditParam.CtlStartDtCal ? newEditParam.CtlStartDtCal : startDt,
                endDt: newEditParam.CtlEndDtCal ? newEditParam.CtlEndDtCal : endDt,
                deleteFlg: newEditParam.CtlDeleteFlgChk
            }]
        };

        API.PUT(URL_TERMMST
            + "?token=" + COMMON.getToken(), values, function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == -1) {
                    COMMON.showMessage(data.errorMsg);
                } else {
                    callback(data);
                }
            });
    }

    function search(searchDep, searchHospitalization, searchGender, searchTargetSystemKbn, delFlg, callback) {
        API.GET(URL_TERMMSTDISPLAY
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetSystemKbn=" + searchTargetSystemKbn
            + "&departmentCd=" + searchDep
            + "&hospitalizationKbn=" + searchHospitalization
            + "&genderKbn=" + searchGender
            + "&deleteFlg=" + delFlg, function (data) {

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
                    COMMON.showMessageById("COM_901");
                }
            });
    }

    function loadDepartment(callback) {
        //apiをお呼び
        API.GET(URL_DEPARTMENTMST
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt(), function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {

                }
                else {
                    COMMON.showMessageById("COM_901");
                }
            });

    };

    function loadExamination(callback) {
        API.GET(URL_EXAMINATIONMST
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt(), function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {

                }
                else {
                    COMMON.showMessageById("COM_901");
                }
            });
    };

    function loadVirus(callback) {
        API.GET(URL_VIRUSMST
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt(), function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {

                }
                else {
                    COMMON.showMessageById("COM_901");
                }
            });
    };

    function loadSpecimen(callback) {
        API.GET(URL_SPECIMENMST
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt(), function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {

                }
                else {
                    COMMON.showMessageById("COM_901");
                }
            });
    };

    function loadItem(itemKbn, callback) {
        API.GET(URL_ITEMMST
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&targetDt=" + COMMON.getReferenceDt()
            + "&itemKbn=" + itemKbn, function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {

                }
                else {
                    COMMON.showMessageById("COM_901");
                }
            });

    };

    function getRowData(termsId, callback) {
        //行の中身
        API.GET(URL_TERMMST
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&termsId=" + termsId, function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {

                }
                else {
                    COMMON.showMessageById("COM_901");
                }
            });
    };

    return {
        loadDepartment: loadDepartment,
        loadExamination: loadExamination,
        loadVirus: loadVirus,
        loadSpecimen: loadSpecimen,
        loadItem: loadItem,
        getRowData: getRowData,
        search: search,
        update: update,
    };
})();

const AA092_GUI = (function () {
    var detailListDepartmentCd = [];
    var detailListVirusCd = [];
    var detailListSpecimenCd = [];
    var listDepartmentCd = [];
    var listDepartmentNm = [];
    var listVirusCd = [];
    var listVirusNm = [];
    var listSpecimenCd = [];
    var listSpecimenNm = [];
    var listTargetSys = [];
    var detailListResult = [];
    var editTermList = {};
    var editExaminationList = {};
    var detailTable;
    var editTable;

    var oldEditParam = null;
    var newEditParam = null;
    var dataEditTable = null;
    var isCellEdit = false;


    function init() {
        COMMON.setEnterKeyAsTab();
        detailTable = loadDetailTable();
        editTable = loadEditTable();
        loadData();

        $("#editStartDtCal").datepicker(COMMON.dateSetting);

        $("#editEndDtCal").datepicker(COMMON.dateSetting);

        $('#updateBtn').on('click', updateServerAll);

        $('#searchBtn').on('click', searchData);
        // Check Input 条件名称
        $("#editTargetSystemKbnCmb").focusout(function () {
            var editTargetSystemKbnCmb = $(this).val();

            if (editTargetSystemKbnCmb.length === 0) {
                COMMON.showMessageById("COM_907", "検査区分");
                return false;
            }

            COMMON.hideMessage();
        });

        $("#editTargetSystemKbnCmb").keydown(function (e) {
            var editTargetSystemKbnCmb = $("#editTargetSystemKbnCmb").val();

            if (editTargetSystemKbnCmb.length === 0 && (e.which === KEY_CODE_TAB || e.which === KEY_CODE_ENTER)) {
                COMMON.showMessageById("COM_907", "検査区分");
                return false;
            }

            COMMON.hideMessage();
        });

        $("#editTermsNmTxt").focusout(function () {
            var editTermsNmTxt = $("#editTermsNmTxt").val();

            if (editTermsNmTxt.length === 0) {
                COMMON.showMessageById("COM_902", "条件名称");
                return false;
            }

            COMMON.hideMessage();
        });

        $("#editTermsNmTxt").keydown(function (e) {
            var editTermsNmTxt = $("#editTermsNmTxt").val();

            if (editTermsNmTxt.length === 0 && (e.which === KEY_CODE_TAB || e.which === KEY_CODE_ENTER)) {
                COMMON.showMessageById("COM_902", "条件名称");
                return false;
            }

            COMMON.hideMessage();
        });

        $("#editNotificationDetailTxt").focusout(function () {
            var editNotificationDetailTxt = $(this).val();

            if (editNotificationDetailTxt.length === 0) {
                COMMON.showMessageById("COM_902", "通知内容");
                return false;
            }

            COMMON.hideMessage();
        });

        $("#editNotificationDetailTxt").keydown(function (e) {
            var editNotificationDetailTxt = $("#editNotificationDetailTxt").val();

            if (editNotificationDetailTxt.length === 0 && (e.which === KEY_CODE_TAB || e.which === KEY_CODE_ENTER)) {
                COMMON.showMessageById("COM_902", "通知内容");
                return false;
            }

            COMMON.hideMessage();
        });

        $("#editTargetSystemKbnCmb").change(function () {
            var typeTest = $('#editTargetSystemKbnCmb').val();
            displayControlByType(typeTest);
        });

        $("#updateBtn").keydown(function (e) {
            if (e.keyCode === KEY_CODE_TAB) {
                $(".focusguard").focus();
            }
        });

        $('#focusguard-1').on('focus', function () {
            var searchOpt = $("input:radio[name=searchOpt]:checked").val();
            if (searchOpt == "add")
                document.getElementById('searchAddOpt').focus();
            if (searchOpt == "edit")
                document.getElementById('searchEditOpt').focus();
            if (searchOpt == "copy")
                document.getElementById('searchCopyOpt').focus();
        });

    }

    function loadDetailTable() {
        var customFormatter = function (cell, formatterParams) {
            var getTermDetails = cell.getValue();
            var returnValue = '';
            for (var i = 0; i < getTermDetails.length; i++) {
                var getDetailValue = getTermDetails[i];
                if (formatterParams.code === "1") {
                    if (getDetailValue.itemKbn === "1") {
                        returnValue += getDetailValue.itemCd + " " + getDetailValue.lowValue + " " + (getDetailValue.lowTermsNm || '') + " " + getDetailValue.upperValue + " " + (getDetailValue.upperTermsNm || '') + ", ";
                    } else if (getDetailValue.itemKbn === "2") {
                        var getResultValue = getDetailValue.lowValue === '' ? '' : getLabel(getDetailValue.lowValue, detailListResult);
                        returnValue += (getDetailValue.itemNm || '') + " " + getResultValue + ", ";
                    } else {
                        if (getDetailValue.itemKbn === "8") {
                            returnValue += (getDetailValue.lowValue || '') + ", ";
                        } else if (getDetailValue.itemKbn !== "3" && getDetailValue.itemKbn !== "4" && getDetailValue.itemKbn !== "5" && getDetailValue.itemKbn !== "8") {
                            returnValue += (getDetailValue.lowValueNm || '') + ", ";
                        }
                    }
                } else {
                    if (getDetailValue.itemKbn === formatterParams.code) {
                        
                        if (formatterParams.code === "3") {
                            if (getDetailValue.lowValue == "OrgCd1") {
                                returnValue += getDetailValue.lowValue + " " + "救急以外";
                            } else {
                                returnValue += getDetailValue.lowValue + " " + (getDetailValue.lowValueNm || '');
                            }        
                        } else {
                            returnValue += getDetailValue.lowValue + " " + (getDetailValue.lowValueNm || '');
                        }                    
                    }
                }
            }

            if (formatterParams.code === "1") {
                returnValue = returnValue.slice(0, -2);
            }

            return returnValue;
        };

        var formatterDt = function (cell, formatterParams) {
            var value = cell.getValue();
            var inputFormat = formatterParams.inputFormat || DATE_FORMAT;
            var invalid = typeof formatterParams.invalidPlaceholder !== "undefined" ? formatterParams.invalidPlaceholder : "";

            var newDatetime = moment(value);

            if (newDatetime.isValid()) {
                return newDatetime.format(inputFormat);
            }

            return invalid ? value : invalid;

        }

        // Create table
        return new Tabulator("#detailTbl", {
            layout: "fitColumns",//カラムコンテナに合わせる
            pagination: "local",
            paginationSize: 5,//5行でページング
            movableColumns: true,//カラムの移動を許可する
            addRowPos: "top",          //when adding a new row, add it to the top of the table
            locale: "jp",
            langs: COMMON.langs,
            selectable: 1,
            columns: [
                { title: "条件ID", field: "termsId", width: 80, headerSort: false },
                { title: "条件名称", field: "termsTitleNm", width: 200, headerSort: false },
                { title: "通知内容", field: "notificationDetail", width: 200, headerSort: false },
                { title: "診療科", field: "termDetails", width: 200, headerSort: false, formatterParams: { code: "3" }, formatter: customFormatter },
                { title: "入外区分", field: "termDetails", width: 80, headerSort: false, formatterParams: { code: "4" }, formatter: customFormatter },
                { title: "性別", field: "termDetails", width: 80, headerSort: false, formatterParams: { code: "5" }, formatter: customFormatter },
                { title: "通知条件", field: "termDetails", width: 300, headerSort: false, formatterParams: { code: "1" }, formatter: customFormatter },
                { title: "開始日", field: "startDt", hozAlign: "left", width: 120, headerSort: false, formatter: formatterDt },
                { title: "終了日", field: "endDt", hozAlign: "left", width: 120, headerSort: false, formatter: formatterDt },
                {
                    title: "削除", field: "deleteFlg", width: 80, headerSort: false, formatter: function (cell) {
                        return cell.getValue() != 0 ? "削除" : "";
                    },

                }
            ],
            rowClick: function (e, row) {
                var searchOpt = $("input:radio[name=searchOpt]:checked").val();
                COMMON.hideMessage();
                if (searchOpt === "edit" || searchOpt === "copy") {
                    AA092.getRowData(row.getData().termsId, function (data) {
                        setRowDataToEdit(data);
                    });
                    row.select();
                }
            },
        });
    }

    function loadEditTable() {
        //
        var customConditionFormatter = function (cell) {
            var value = cell.getValue();

            for (var i = 0; i < Object.keys(editTermList).length; i++) {
                if (editTermList[i].itemCd == value) {
                    // Store value to cell dataset
                    value = editTermList[i].itemNm;
                    break;
                }
            }
            return value == 0 ? "" : value;
        }

        var disableCell = function (cell) {
            var typeTest = $("#editTargetSystemKbnCmb").val();
            var data = cell.getRow().getData();
            if (typeTest !== "1") {
                return;
            }
            return data;
        }

        var editorTermCmb = function (cell) {
            var values = {};
            values[0] = "";
            for (var i = 1; i <= Object.keys(editTermList).length; i++) {
                var data = editTermList[i - 1];
                values[data.itemCd] = data.itemNm;
            };
            return { values: values };
        }

        // Create table
        return new Tabulator("#editTbl", {
            layout: "fitData",//カラムコンテナに合わせる
            minHeight: 100,
            movableColumns: true,//カラムの移動を許可する
            addRowPos: "top",          //when adding a new row, add it to the top of the table
            keybindings: {
                "navNext": "tab",
            },
            cellEdited: function (cell) {
                isCellEdit = true;
                cell.getRow().select();
            },
            columns: [
                {
                    title: "項目", field: "editexaminationCdLst", width: 160, headerSort: false, editor: "select",
                    editorParams: function (cell) {
                        var values = {};
                        for (var i = 0; i <= Object.keys(editExaminationList).length - 1; i++) {
                            var data = editExaminationList[i];
                            values[data.examinationCd] = data.examinationNm;
                        };
                        return { values: values };
                    },
                    editable: disableCell
                },
                { title: "", field: "editFixedCharLbl", width: 75, headerSort: false },
                { title: "下限値", field: "editResultLowValueTxt", width: 100, editor: "input", headerSort: false, editable: disableCell },
                {
                    title: "条件", field: "editLowTermsCmb", width: 80, headerSort: false, editor: "select",
                    editorParams: editorTermCmb,
                    formatter: customConditionFormatter,
                    editable: disableCell
                },
                { title: "上限値", field: "editResultUpperValueTxt", width: 100, editor: "input", headerSort: false, editable: disableCell },
                {
                    title: "条件", field: "editUpperTermsCmb", width: 80, headerSort: false, editor: "select",
                    editorParams: editorTermCmb,
                    formatter: customConditionFormatter,
                    editable: disableCell
                },
            ],
            rowClick: function (e, row) {
                var typeTest = $("#editTargetSystemKbnCmb").val();
                if (typeTest !== "1") {
                    row.deselect();
                }
            },
        });
    }

    function loadData() {
        $("#searchEditOpt").prop("checked", true);

        $("input:radio[id=searchAddOpt], input:radio[id=searchEditOpt], input:radio[id=searchCopyOpt]").change(function () {
            COMMON.hideMessage();
            var searchAddOpt = $("input:radio[id=searchAddOpt]:checked").val();
            var searchEditOpt = $("input:radio[id=searchEditOpt]:checked").val();
            var searchCopyOpt = $("input:radio[id=searchCopyOpt]:checked").val();
            var startDt = moment(DATE_DEFAULT_BEGIN).format(DATE_FORMAT);
            var endDt = moment(DATE_DEFAULT_END).format(DATE_FORMAT);
            clearAllInput();
            $(".specimen-test").removeClass("display-none");
            $(".virus-test").removeClass("display-none");
            $(".fast-test").removeClass("display-none");

            if (searchEditOpt || searchCopyOpt) {
                $("#edit").find("*").prop('disabled', false);

            } else if (searchAddOpt) {
                $("#edit").find("*").prop('disabled', true);
                $("#add").find("*").prop('disabled', false);
                $("#editStartDtCal").val(startDt);
                $("#editEndDtCal").val(endDt);
                $("#editStartDtCal").datepicker("setDate", startDt); // YYYY/MM/DD をセット
                $("#editEndDtCal").datepicker("setDate", endDt); // YYYY/MM/DD をセット
            }

        }).trigger('change');

        // Load data for [診療科] datalist
        AA092.loadDepartment(function (result) {
            var options = '';
            var j = 0;
            for (var i = 0; i < result.length; i++) {
                options += '<option value="' + result[i].departmentCd + mid_char + result[i].departmentNm + '" label="' + result[i].departmentCd + mid_char + result[i].departmentNm + '" />';
                listDepartmentCd.push(result[i].departmentCd);
                listDepartmentNm.push(result[i].departmentNm);
                detailListDepartmentCd[i] = {
                    value: result[i].departmentCd,
                    label: result[i].departmentCd + mid_char + result[i].departmentNm
                };
                j=i+1;
            }
            options += '<option value="OrgCd1 救急以外" label="OrgCd1 救急以外" />';
            listDepartmentCd.push("OrgCd1");
            listDepartmentNm.push("救急以外");
            detailListDepartmentCd[j] = {
                value: "OrgCd1",
                label: "OrgCd1" + mid_char + "救急以外"
            };
            $("#searchDepartmentList").html(options);
            $("#editDepartmentList").html(options);
        });

        // Load data for [検査項目] datalist
        AA092.loadExamination(function (result) {
            for (var i = 0; i < result.length; i++) {
                editExaminationList[i] = {
                    examinationCd: result[i].examinationNm,
                    examinationNm: result[i].examinationNm
                };
            }
        });

        // Load data for [菌名] datalist
        AA092.loadVirus(function (result) {
            var options = '';
            for (var i = 0; i < result.length; i++) {
                options += '<option value="' + result[i].virusCd + mid_char + result[i].virusNm + '" label="' + result[i].virusCd + mid_char + result[i].virusNm + '" />';
                listVirusCd.push(result[i].virusCd);
                listVirusNm.push(result[i].virusNm);
                detailListVirusCd[i] = {
                    value: result[i].virusCd,
                    label: result[i].virusCd + mid_char + result[i].virusNm
                };
            }
            $("#editGnrbacteriologicalList").html(options);
        });

        // Load data for [検体] datalist
        AA092.loadSpecimen(function (result) {
            var options = '';
            for (var i = 0; i < result.length; i++) {
                options += '<option value="' + result[i].specimenCd + mid_char + result[i].specimenNm + '" label="' + result[i].specimenCd + mid_char + result[i].specimenNm + '" />';
                listSpecimenCd.push(result[i].specimenCd);
                listSpecimenNm.push(result[i].specimenNm);
                detailListSpecimenCd[i] = {
                    value: result[i].specimenCd,
                    label: result[i].specimenCd + mid_char + result[i].specimenNm
                };
            }
            $("#editGnrSpecimenList").html(options);
        });

        // Load data for [入外区分]  datalist
        AA092.loadItem(1, function (result) {
            var options = '<option value="" label="" />';
            var itemMst = result[0];

            for (var i = 0; i < itemMst.itemDetails.length; i++) {
                options += '<option value="' + itemMst.itemDetails[i].itemCd + '" label="' + itemMst.itemDetails[i].itemNm + '" />';
            }
            $("#searchHospitalizationCdCmb").html(options);
            $("#editHospitalizationCmb").html(options);
        });

        // Load data for [性別]  datalist
        AA092.loadItem(2, function (result) {
            var options = '<option value="" label="" />';
            var itemMst = result[0];

            for (var i = 0; i < itemMst.itemDetails.length; i++) {
                options += '<option value="' + itemMst.itemDetails[i].itemCd + '" label="' + itemMst.itemDetails[i].itemNm + '" />';
            }
            $("#searchGenderCdCmb").html(options);
            $("#editGenderCmb").html(options);
        });

        AA092.loadItem(4, function (result) {
            var itemMst = result[0];
            for (var i = 0; i < itemMst.itemDetails.length; i++) {
                editTermList[i] = {
                    itemCd: itemMst.itemDetails[i].itemCd,
                    itemNm: itemMst.itemDetails[i].itemNm
                };
            }
        });

        // Load data for [検査区分]  datalist
        AA092.loadItem(8, function (result) {
            var options = '<option value="" label="" />';
            var itemMst = result[0];

            for (var i = 0; i < itemMst.itemDetails.length; i++) {
                options += '<option value="' + itemMst.itemDetails[i].itemCd + '" label="' + itemMst.itemDetails[i].itemNm + '" />';
                listTargetSys.push(itemMst.itemDetails[i].itemCd);
            }
            $("#searchTargetSystemKbnCmb").html(options);
            $("#editTargetSystemKbnCmb").html(options);
        });

        // Load data for [検査方法]  datalist
        AA092.loadItem(10, function (result) {
            var options = '<option value="" label="" />';
            var itemMst = result[0];

            for (var i = 0; i < itemMst.itemDetails.length; i++) {
                options += '<option value="' + itemMst.itemDetails[i].itemCd + '" label="' + itemMst.itemDetails[i].itemNm + '" />';
            }
            $("#editGnrExaminationKbnCmb").html(options);
            $("#editMtbExaminationKbnCmb").html(options);
        });

        // Load data for [+, -]  datalist
        AA092.loadItem(11, function (result) {
            var options = '<option value="" label="" />';
            var itemMst = result[0];

            for (var i = 0; i < itemMst.itemDetails.length; i++) {
                options += '<option value="' + itemMst.itemDetails[i].itemCd + '" label="' + itemMst.itemDetails[i].itemNm + '" />';
                detailListResult[i] = {
                    value: itemMst.itemDetails[i].itemCd,
                    label: itemMst.itemDetails[i].itemNm
                };
            }
            $("#editMtbResultValueCmb").html(options);
            $("#editGnrResultValueCmb").html(options);
        });

    }
    function searchData() {
        COMMON.hideMessage();
        search();
    };

    // Search click
    function search() {
        var searchDep = $('[name="searchDepartmentCdLst"]').val().split(mid_char)[0];
        var searchHospitalization = $('[name="searchHospitalizationCdCmb"]').val();
        var searchGender = $('[name="searchGenderCdCmb"]').val();
        var searchTargetSystemKbn = $('[name="searchTargetSystemKbnCmb"]').val();
        var delFlg = $('#searchDeleteFlgChk').prop('checked');

        clearAllInput();

        AA092.search(searchDep, searchHospitalization, searchGender, searchTargetSystemKbn, delFlg ? 1 : 0, function (result) {
            detailTable.setData(result);
        });
    };

    // Update data to server
    function updateServerAll() {
        var startDt = moment(DATE_DEFAULT_BEGIN).format(DATE_FORMAT);
        var endDt = moment(DATE_DEFAULT_END).format(DATE_FORMAT);
        if (!checkValidDataBeforeSave())
            return;
        AA092.update(editTable, newEditParam, function (data) {
            if (data.result == 0) {
                COMMON.showMessageById("COM_001", "", "", "success");
                var searchAddOpt = $("input:radio[id=searchAddOpt]:checked").val();
                if (!searchAddOpt) {
                    search();
                } else {
                    clearAllInput();
                    $("#editStartDtCal").datepicker("setDate", startDt); // YYYY/MM/DD をセット
                    $("#editEndDtCal").datepicker("setDate", endDt); // YYYY/MM/DD をセット
                }
            }
        });
    };

    function checkValidDataBeforeSave() {
        COMMON.hideMessage();
        var searchOpt = $("input:radio[name=searchOpt]:checked").val();
        newEditParam = getParamFromControl();
        if (searchOpt == "edit") {
            if (oldEditParam)
                newEditParam.termsId = oldEditParam.termsId;
            if (detailTable.getSelectedRows().length == 0) {
                COMMON.showMessageById("AA092_902");
                return false;
            }
            if (!isEdited() && !isCellEdit) {
                COMMON.showMessageById("COM_002");
                return false;
            }                
        }
        if (!checkEmpty(newEditParam.CtlTargetSystemKbnCmb))
            return false;
        if (newEditParam.CtlTargetSystemKbnCmb == TARGETSYSTEMKBN_SPECIMEN) {
            if (!checkValidateRow()) return false;
        }
        if (!checkValidateInput())
            return false;

        return true;
    }

    function checkEmpty(ctlTargetSystemKbnCmb) {
        if (newEditParam.CtlTargetSystemKbnCmb.length === 0) {
            COMMON.showMessageById("COM_907", "検査区分");
            $("#editTargetSystemKbnCmb").focus();
        }
        else if (newEditParam.CtlTermsNmTxt.length === 0) {
            COMMON.showMessageById("COM_902", "条件名称");
            $("#editTermsNmTxt").focus();
        }
        else if (newEditParam.CtlNotificationDetailTxt.length === 0) {
            COMMON.showMessageById("COM_902", "通知内容");
            $("#editNotificationDetailTxt").focus();
        }
        else {
            if (ctlTargetSystemKbnCmb == TARGETSYSTEMKBN_GENERAL) {
                if (!newEditParam.CtlGnrExaminationKbnCmb &&
                    !newEditParam.CtlGnrbacteriologicalLst && 
                    !newEditParam.CtlGnrSpecimenLst &&
                    !newEditParam.CtlGnrResultValueCmb &&
                    !newEditParam.CtlGnrCommentTxt) {
                        COMMON.showMessageById("AA092_901")
                        $("#editGnrExaminationKbnCmb").focus();
                } else if (!newEditParam.CtlGnrbacteriologicalLst && newEditParam.CtlGnrResultValueCmb) {
                    COMMON.showMessageById("AA092_901")
                    $("#editGnrbacteriologicalLst").focus();
                } else if (!newEditParam.CtlGnrResultValueCmb && newEditParam.CtlGnrbacteriologicalLst) {                    
                    COMMON.showMessageById("AA092_901")
                    $("#editGnrResultValueCmb").focus();
                } else 
                    return true;    
            } else if (ctlTargetSystemKbnCmb == TARGETSYSTEMKBN_ACID) {
                if (!newEditParam.CtlMtbExaminationKbnCmb) {
                    COMMON.showMessageById("AA092_901")
                    $("#editMtbExaminationKbnCmb").focus();
                } else if (!newEditParam.CtlMtbResultValueCmb) {
                    COMMON.showMessageById("AA092_901")
                    $("#editMtbResultValueCmb").focus();
                } else 
                    return true;  
            } else {
                return true;
            }
        }   
        return false;
    }

    function checkValidateInput() {
        if ($("#editDepartmentCmb").val() && !listDepartmentCd.includes($("#editDepartmentCmb").val().split(mid_char)[0]) && !listDepartmentNm.includes($("#editDepartmentCmb").val().split(mid_char)[1])) {
            COMMON.showMessageById("COM_905", "診療科");
            $("#editDepartmentCmb").focus();
        }
        else if (!listTargetSys.includes(parseInt($("#editTargetSystemKbnCmb").val()))) {
            COMMON.showMessageById("COM_905", "検査項目");
            $("#editTargetSystemKbnCmb").focus();
        } else if ($("#editStartDtCal").val() > $("#editEndDtCal").val()) {
            COMMON.showMessageById("COM_906");
            $("#editEndDtCal").focus();
        } else if (newEditParam.CtlTargetSystemKbnCmb == TARGETSYSTEMKBN_GENERAL) {
            if ($("#editGnrbacteriologicalLst").val() && !listVirusCd.includes($("#editGnrbacteriologicalLst").val().split(mid_char)[0]) && !listVirusNm.includes($("#editGnrbacteriologicalLst").val().split(mid_char)[1])) {
                COMMON.showMessageById("COM_905", "菌名");
                $("#editGnrbacteriologicalLst").focus();
            } else if ($("#editGnrSpecimenLst").val() && !listSpecimenCd.includes($("#editGnrSpecimenLst").val().split(mid_char)[0]) && !listSpecimenNm.includes($("#editGnrSpecimenLst").val().split(mid_char)[1])) {
                COMMON.showMessageById("COM_905", "検体");
                $("#editGnrSpecimenLst").focus();
            }
            else
                return true;
        }
        else

            return true;
        return false;
    };

    function checkValidateRow() {
        checkData = editTable.getData()[0];
        var editLowTermsCmb = checkData.editLowTermsCmb ? (checkData.editLowTermsCmb == 0 ? "" : checkData.editLowTermsCmb) : "";
        var editUpperTermsCmb = checkData.editUpperTermsCmb ? (checkData.editUpperTermsCmb == 0 ? "" : checkData.editUpperTermsCmb) : "";
        if (!checkData.editexaminationCdLst) {
            COMMON.showMessageById("AA092_901");
            
        } else if ((!checkData.editResultLowValueTxt) ||
            (!editLowTermsCmb) ||
            (!checkData.editResultUpperValueTxt) ||
            (!editUpperTermsCmb)) {

                if (((!checkData.editResultLowValueTxt) && (editLowTermsCmb)) ||  ((checkData.editResultLowValueTxt) && (!editLowTermsCmb))) {
                    COMMON.showMessageById("AA092_901");
                } else if (((!checkData.editResultUpperValueTxt) && (editUpperTermsCmb)) ||  ((checkData.editResultUpperValueTxt) && (!editUpperTermsCmb))) {
                    COMMON.showMessageById("AA092_901");
                } else if ((!checkData.editResultLowValueTxt) &&
                (!editLowTermsCmb) &&
                (!checkData.editResultUpperValueTxt) &&
                (!editUpperTermsCmb)) {
                    COMMON.showMessageById("AA092_901");
                } else {
                    return true;
                }
        }
        else 
            return true;

        return false;
    };

    function setRowDataToEdit(data) {

        var termMst = data.details[0];
        var startDt = moment(termMst.startDt).format(DATE_FORMAT);
        var endDt = moment(termMst.endDt).format(DATE_FORMAT);

        //検査区分
        $('#editTargetSystemKbnCmb').val(termMst.targetSystemKbn);
        //条件名称
        $("#editTermsNmTxt").val(termMst.termsNm);
        //通知内容
        $("#editNotificationDetailTxt").val(termMst.notificationDetail);
        // 開始日
        $("#editStartDtCal").val(startDt);
        // 終了日
        $("#editEndDtCal").val(endDt);
        // 削除フラグ
        $('#editDeleteFlgChk').prop('checked', termMst.deleteFlg === 0 ? false : true);
        $("#editStartDtCal").datepicker("setDate", startDt); // YYYY/MM/DD をセット
        $("#editEndDtCal").datepicker("setDate", endDt); // YYYY/MM/DD をセット
        dataEditTable = [];

        for (var i = 0; i <= data.details.length - 1; i++) {
            setDataToControl(data.details[i].termDetails)
        }
        //backup data to compare
        oldEditParam = getParamFromControl();
        oldEditParam.termsId = termMst.termsId;
        displayControlByType(termMst.targetSystemKbn);
    }

    function displayControlByType(typeTest) {
        //hide control
        $(".specimen-test").addClass("display-none");
        $(".virus-test").addClass("display-none");
        $(".fast-test").addClass("display-none");
        var searchOpt = $("input:radio[name=searchOpt]:checked").val();

        //検体検査の場合
        if (TARGETSYSTEMKBN_SPECIMEN === typeTest) {
            if (searchOpt == "add" || !dataEditTable || dataEditTable.length == 0) {
                dataEditTable = [];
                dataEditTable.push({
                    "editexaminationCdLst": "",
                    "editFixedCharLbl": "の値が",
                    "editResultLowValueTxt": "",
                    "editLowTermsCmb": "",
                    "editResultUpperValueTxt": "",
                    "editUpperTermsCmb": "",
                });
            }
            $(".specimen-test").removeClass("display-none");
            editTable.setData(dataEditTable);
            editTable.selectRow();
        }
        //一般細菌検査の場合
        else if (TARGETSYSTEMKBN_GENERAL === typeTest) {
            $(".virus-test").removeClass("display-none");
        }
        //抗酸菌検査の場合
        else if (TARGETSYSTEMKBN_ACID === typeTest) {
            $(".fast-test").removeClass("display-none");
        }
    }

    function setDataToControl(termMstDetail) {
        for (var j = 0; j < termMstDetail.length; j++) {
            if (termMstDetail[j].itemKbn === "1") {
                dataEditTable.push({
                    "editexaminationCdLst": termMstDetail[j].itemCd,
                    "editFixedCharLbl": "の値が",
                    "editResultLowValueTxt": termMstDetail[j].lowvalue,
                    "editLowTermsCmb": termMstDetail[j].lowterms,
                    "editResultUpperValueTxt": termMstDetail[j].uppervalue,
                    "editUpperTermsCmb": termMstDetail[j].upperterms,
                });
            } else if (termMstDetail[j].itemKbn === "2") {
                $("#editGnrbacteriologicalLst").val(getLabel(termMstDetail[j].itemCd, detailListVirusCd));
                $("#editGnrResultValueCmb").val(termMstDetail[j].lowvalue);
                // 抗酸菌検査
                $("#editMtbResultValueCmb").val(termMstDetail[j].lowvalue);
            } else if (termMstDetail[j].itemKbn === "3") {
                $("#editDepartmentCmb").val(getLabel(termMstDetail[j].lowvalue, detailListDepartmentCd));
            } else if (termMstDetail[j].itemKbn === "4") {
                $("#editHospitalizationCmb").val(termMstDetail[j].lowvalue);
            } else if (termMstDetail[j].itemKbn === "5") {
                $("#editGenderCmb").val(termMstDetail[j].lowvalue);
            } else if (termMstDetail[j].itemKbn === "6") {
                $("#editGnrSpecimenLst").val(getLabel(termMstDetail[j].lowvalue, detailListSpecimenCd));
            } else if (termMstDetail[j].itemKbn === "7") {
                // 一般細菌検査
                $("#editGnrExaminationKbnCmb").val(termMstDetail[j].lowvalue);
                // 抗酸菌検査
                $("#editMtbExaminationKbnCmb").val(termMstDetail[j].lowvalue);
            } else if (termMstDetail[j].itemKbn === "8") {
                $("#editGnrCommentTxt").val(termMstDetail[j].lowvalue);
            }
        }
    }

    function getLabel(value, listItem) {
        var returnLabel = '';
        for (var k = 0; k < listItem.length; k++) {
            if (listItem[k].value == value) {
                // Store value to cell dataset
                returnLabel = listItem[k].label;
                break;
            }
        }
        return returnLabel;
    }

    function clearAllInput() {
        $("#editTargetSystemKbnCmb").val('');
        $("#editTermsNmTxt").val('');
        $("#editStartDtCal").val('');
        $("#editEndDtCal").val('');
        $("#editDepartmentCmb").val('');
        $("#editHospitalizationCmb").val('');
        $("#editGenderCmb").val('');
        $('#editDeleteFlgChk').prop('checked', false);

        $("#editGnrExaminationKbnCmb").val('');
        $("#editGnrbacteriologicalLst").val('');
        $("#editGnrResultValueCmb").val('');
        $("#editGnrSpecimenLst").val('');
        $("#editGnrCommentTxt").val('');
        $("#editMtbExaminationKbnCmb").val('');
        $("#editMtbResultValueCmb").val('');
        $("#editNotificationDetailTxt").val('');
        detailTable.clearData();
        oldEditParam = null;
        isCellEdit = false;
        if (editTable !== undefined)
            editTable.clearData();
    };

    function getParamFromControl() {
        var screenParam = createScreenObj();
        screenParam.CtlTargetSystemKbnCmb = $("#editTargetSystemKbnCmb").val().length === 0 ? $("#editTargetSystemKbnCmb").val() : parseInt($("#editTargetSystemKbnCmb").val());
        screenParam.CtlTermsNmTxt = $("#editTermsNmTxt").val();
        screenParam.CtlNotificationDetailTxt = $("#editNotificationDetailTxt").val();
        screenParam.CtlStartDtCal = $("#editStartDtCal").val();
        screenParam.CtlEndDtCal = $("#editEndDtCal").val();
        screenParam.CtlDepartmentCmb = $("#editDepartmentCmb").val().split(mid_char)[0];
        screenParam.CtlHospitalizationCmb = $("#editHospitalizationCmb").val();
        screenParam.CtlGenderCmb = $("#editGenderCmb").val();
        screenParam.CtlDeleteFlgChk = $('#editDeleteFlgChk').prop('checked') ? 1 : 0;
        screenParam.CtlGnrExaminationKbnCmb = $("#editGnrExaminationKbnCmb").val();
        screenParam.CtlGnrbacteriologicalLst = $("#editGnrbacteriologicalLst").val().split(mid_char)[0];
        screenParam.CtlGnrResultValueCmb = $("#editGnrResultValueCmb").val();
        screenParam.CtlGnrSpecimenLst = $("#editGnrSpecimenLst").val().split(mid_char)[0];
        screenParam.CtlGnrCommentTxt = $("#editGnrCommentTxt").val();
        screenParam.CtlMtbExaminationKbnCmb = $("#editMtbExaminationKbnCmb").val();
        screenParam.CtlMtbResultValueCmb = $("#editMtbResultValueCmb").val();
        return screenParam;
    }

    function createScreenObj() {
        return {
            termsId: null,
            CtlTargetSystemKbnCmb: "",
            CtlTermsNmTxt: "",
            CtlNotificationDetailTxt: "",
            CtlStartDtCal: "",
            CtlEndDtCal: "",
            CtlDepartmentCmb: "",
            CtlHospitalizationCmb: "",
            CtlGenderCmb: "",
            CtlDeleteFlgChk: "",
            CtlGnrExaminationKbnCmb: "",
            CtlGnrbacteriologicalLst: "",
            CtlGnrResultValueCmb: "",
            CtlGnrSpecimenLst: "",
            CtlGnrCommentTxt: "",
            CtlMtbExaminationKbnCmb: "",
            CtlMtbResultValueCmb: "",
        }
    }

    function isEdited() {
        return (oldEditParam.CtlTargetSystemKbnCmb != newEditParam.CtlTargetSystemKbnCmb ||
            oldEditParam.CtlTermsNmTxt != newEditParam.CtlTermsNmTxt ||
            oldEditParam.CtlNotificationDetailTxt != newEditParam.CtlNotificationDetailTxt ||
            oldEditParam.CtlStartDtCal != newEditParam.CtlStartDtCal ||
            oldEditParam.CtlEndDtCal != newEditParam.CtlEndDtCal ||
            oldEditParam.CtlDepartmentCmb != newEditParam.CtlDepartmentCmb ||
            oldEditParam.CtlHospitalizationCmb != newEditParam.CtlHospitalizationCmb ||
            oldEditParam.CtlGenderCmb != newEditParam.CtlGenderCmb ||
            oldEditParam.CtlDeleteFlgChk != newEditParam.CtlDeleteFlgChk ||
            oldEditParam.CtlGnrExaminationKbnCmb != newEditParam.CtlGnrExaminationKbnCmb ||
            oldEditParam.CtlGnrbacteriologicalLst != newEditParam.CtlGnrbacteriologicalLst ||
            oldEditParam.CtlGnrResultValueCmb != newEditParam.CtlGnrResultValueCmb ||
            oldEditParam.CtlGnrSpecimenLst != newEditParam.CtlGnrSpecimenLst ||
            oldEditParam.CtlGnrCommentTxt != newEditParam.CtlGnrCommentTxt ||
            oldEditParam.CtlMtbExaminationKbnCmb != newEditParam.CtlMtbExaminationKbnCmb ||
            oldEditParam.CtlMtbResultValueCmb != newEditParam.CtlMtbResultValueCmb);
    }

    return {
        init: init,
    };
})();

$(document).ready(function () {
    AA092_GUI.init();
});

