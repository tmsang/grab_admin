/*=============================================
    AA09x: action on Master Data

    AA091: enable, disable, block Account
    
    FLOW:
        1. Search & load Data
            . Define Tablulator (grid) [cell, row, column] + events
            . Fill data into
        2. Add record & save
        3. Edit record & save
        4. Delete record & save
==============================================*/

const mid_char = " ";
var listUserIdForDatalist = '';


const AA091 = (function () {
    const MAX_TERMINALINFO = "10";
    const MAX_REMARK = "50";

    function updateData(editedRow, callback) {
        var value = [];
        var updateValue = {};
        var startDt = moment(DATE_DEFAULT_BEGIN).format(DATE_FORMAT);
        var endDt = moment(DATE_DEFAULT_END).format(DATE_FORMAT);

        editedRow.forEach(function (row) {
            data = row.getData();
            value.push({
                "hospitalCd": COMMON.getHospitalCd(),
                "destinationId": data.destinationId ? data.destinationId : null,
                "userId": data.userId,
                "terminalInfo": data.terminalInfo,
                "startDt": data.startDt ? data.startDt : startDt,
                "endDt": data.endDt ? data.endDt : endDt,
                "remarks": data.remarks,
                "deleteFlg": data.deleteFlg
            });
        });
        updateValue = {
            "details": value
        };

        API.PUT(URL_DESTINATIONMST
            + "?token=" + COMMON.getToken()
            , updateValue, function (data) {
                //0:正常、 1:異常、 -1：データなし
                if (data.result == -1) {
                    COMMON.showMessage(data.errorMsg);
                } else {
                    callback(data);
                }

            });

    }

    function checkValidateEditData(tabObj, listUserId) {
        COMMON.hideMessage();
        msg = "";
        if (tabObj.getSelectedRows().length == 0)
            msg = " " + COMMON.getMessageById("COM_002");
        if (!msg) {

            tabObj.getSelectedRows().forEach(function (row) {
                msg = msg + checkValidate(row.getData(), tabObj.getData(), listUserId);
                if (msg) {
                    msg = msg + "<br>";
                }
            });
        }
        if (msg) {
            COMMON.showMessage(msg)
            return false;
        }
        return true;
    }

    function loadUserMst(callback) {
        API.GET(URL_USERMST
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

    function search(userId, delFlg, mainGrid, callback) {
        API.GET(URL_DESTINATIONMSTDISPLAY
            + "?token=" + COMMON.getToken()
            + "&hospitalCd=" + COMMON.getHospitalCd()
            + "&userId=" + userId
            + "&deleteFlg=" + delFlg, function (data) {

                //0:正常、 1:異常、 -1：データなし
                if (data.result == 0) {
                    callback(data.details);
                }
                //error　ログイン認証失敗
                else if (data.result == -1) {
                    mainGrid.clearData();
                    COMMON.showSearchResult();
                }
                else if (data.result == -2) {
                    mainGrid.clearData();
                    COMMON.showSearchResult("AA021_901");
                }
                else {
                    COMMON.showMessageById("COM_901");
                }
            });
    };

    // Check exist data
    function isDuplicate(rowData, tableData) {
        var matchData = $.grep(tableData, function (n, i) {
            return n.userId + n.terminalInfo == rowData.userId + rowData.terminalInfo;
        });

        if (matchData.length > 1) {
            return COMMON.getMessageById("AA091_901", rowData.userId, rowData.terminalInfo);
        }
        return "";
    };

    // Check validate
    function checkValidate(checkData, tableData, listUserId) {
        msg = "";
        if (!checkData.userId)
            msg = msg + "<br>" + COMMON.getMessageById("COM_902", "利用者");
        else if (!listUserId.includes(checkData.userId))
            msg = msg + "<br>" + COMMON.getMessageById("COM_905", "利用者");

        if (!checkData.terminalInfo || checkData.terminalInfo.trim() === "")
            msg = msg + "<br>" + COMMON.getMessageById("COM_902", "通知先端末情報");

        if (!msg)
            msg = isDuplicate(checkData, tableData);

        if (checkData.startDt > checkData.endDt)
            msg = msg + "<br>" + COMMON.getMessageById("COM_906");

        if (msg)
            return "通知先ID[" + (checkData.destinationId ? checkData.destinationId : "新規") + "]:" + msg;
        return msg;
    }

    return {
        checkValidateEditData: checkValidateEditData,
        loadUserMst: loadUserMst,
        search: search,
        updateData: updateData,
        MAX_TERMINALINFO: MAX_TERMINALINFO,
        MAX_REMARK: MAX_REMARK
    };

})();


const AA091_GUI = (function () {
    var mainGrid;
    var listUserId = [];
    var detailListUserId = [];

    function init() {
        COMMON.setEnterKeyAsTab();
        mainGrid = defineGridStructure();
        loadData();

        $('#updateBtn').on('click', updateServerAll);

        $('#detailAddRowBtn').on('click', addNewRow);

        $('#searchBtn').on('click', searchData);

        $("#userList").html("")

        //IE
        $("#searchUserIdLst").on('keydown', setUserDatalist);
        $("#searchUserIdLst").on('blur', setUserDatalist);
        $("#searchUserIdLst").on('click', setUserDatalist);

    }

    function setUserDatalist() {
        if (!$("#userList").html())
            $("#userList").html(listUserIdForDatalist);
    }

    function defineGridStructure() 
    {        
        var isInputUser = function (cell, value, parameters) {
            if (!value) {
                COMMON.showMessageById("COM_902", "利用者");
                return false;
            };
            COMMON.hideMessage();
            return true;
        };

        var isInputTerminalInfo = function (cell, value, parameters) {
            if (!value || value.trim() === "") {
                COMMON.showMessageById("COM_902", "通知先端末情報");
                return false;
            };
            COMMON.hideMessage();
            return true;
        };

        // Create Date Editor
        var dateEditor = function (cell, onRendered, success, cancel) {
            //cell - the cell component for the editable cell
            //onRendered - function to call when the editor has been rendered
            //success - function to call to pass the successfuly updated value to Tabulator
            //cancel - function to call to abort the edit and return to a normal cell
            cellValue = null;
            //create and style input
            if (typeof cell.getValue() !== "undefined") {
                cellValue = moment(cell.getValue()).format(DATE_FORMAT);
            }
            input = document.createElement("input");

            input.setAttribute("type", "date");

            input.style.padding = "4px";
            input.style.width = "100%";
            input.style.boxSizing = "border-box";
            if (cellValue) input.value = cellValue;

            onRendered(function () {
                input.focus();
                input.style.height = "100%";
                $(".datepicker").hide();
                $(".tabulator-edit-select-list").hide();

                $(input).datepicker(COMMON.dateSetting)
                    .on("changeDate", function (e) {
                        onChange(e);
                    }); //turn input into datepicker 
            });

            function onChange(e) {
                var isDate = moment(input.value).isValid();
                if (!isDate || input.value == cellValue) {
                    cancel();
                }
                else {
                    success(input.value);
                    cell.setValue(input.value)
                }

            }

            //submit new value on blur or change
            input.addEventListener("blur", onChange);

            //submit new value on enter
            input.addEventListener("keydown", function (e) {
                if (e.keyCode == KEY_CODE_ENTER) {
                    onChange();
                }

                if (e.keyCode == KEY_CODE_ESC) {
                    cancel();
                }
            });

            return input;
        };

        var cell_user = function customConditionFormatter(cell) {
            var value = cell.getValue();

            for (var i = 0; i < detailListUserId.length; i++) {
                if (detailListUserId[i].value == value) {
                    // Store value to cell dataset
                    value = detailListUserId[i].label;
                    break;
                }
            }
            return value;
        }

        // Create structure grid (tabulator)
        return new Tabulator("#detailTbl", {
            layout: COMMON.layout,                  
            pagination: COMMON.pagination,
            paginationSize: COMMON.paginationSize,  // 5 lines
            movableColumns: COMMON.movableColumns,  // allow column move
            locale: COMMON.locale,
            langs: COMMON.langs,
            addRowPos: "top",
            validationMode: "highlight",
            cellEdited: function (cell) {
                cell.getRow().select();
            },
            keybindings: {
                "navNext": "tab",                   // bind redo function to ctrl + r
            },
            columns: [
                { 
                    title: "Id", field: "Id", width: 150 
                },
                {
                    title: "Full Name", field: "FullName", width: 200, editor: "autocomplete",
                    editorParams: function (cell) {
                        return {
                            showListOnEmpty: true,
                            freetext: false,
                            // allowEmpty: true, 
                            values: detailListUserId
                        };
                    },
                    formatter: cell_user,
                    validator: [{
                        type: isInputUser
                    }]
                },
                {
                    title: "Email", field: "Email", width: 200, editor: "input",
                    editorParams: {
                        elementAttributes: {
                            maxlength: AA091.MAX_TERMINALINFO,
                        }
                    },
                    validator: [{
                        type: isInputTerminalInfo
                    }]
                },
                {
                    title: "Happen Date", field: "HappenDate", hozAlign: "left", width: 191, editor: dateEditor, formatter: function (cell) {
                        const value = cell.getValue();
                        return !value ? "" : moment(value).format(DATE_FORMAT);
                    }
                },                
                {
                    title: "Description", field: "Description", formatter: "textarea", width: 200, editor: "textarea",
                    editorParams: {
                        elementAttributes: {
                            maxlength: AA091.MAX_REMARK,
                        }
                    }
                },
                {
                    title: "Delete", field: "deleteFlg", formatter: "tickCross", width: 100, formatter: function (cell) {
                        if (cell.getValue()) {
                            return '<input type="checkbox" class="chkDel" name="chkDel" checked />'
                        } else {
                            return '<input type="checkbox" class="chkDel" name="chkDel" />'
                        }
                    },
                    cellClick: function (e, cell) {
                        var element = cell.getElement();
                        var chkbox = element.querySelector('.chkDel');

                        chkbox.checked = !cell.getData().deleteFlg;
                        cell.getData().deleteFlg = !cell.getData().deleteFlg;
                        cell.getData().deleteFlg = cell.getData().deleteFlg ? 1 : 0;
                        cell.getRow().select();
                    },
                }
            ]
        });
    }

    function loadData() {
        // Load data for [利用者ID] datalist
        AA091.loadUserMst(function (result) {
            var options = '';
            for (var i = 0; i < result.length; i++) {
                options += '<option value="' + result[i].userId + mid_char + result[i].userNmKanji + '" label="' + result[i].userId + mid_char + result[i].userNmKanji + '" />';
                listUserId.push(result[i].userId);
                detailListUserId[i] = {
                    value: result[i].userId,
                    label: result[i].userId + mid_char + result[i].userNmKanji
                };
            };
            //document.getElementById('userList').innerHTML = options;
            listUserIdForDatalist = options;
            $("#searchUserIdLst").focus();
        });

    }

    // Add row click
    function addNewRow() {
        mainGrid.addRow({
            "destinationId": undefined,
            "departmentCd": undefined,
            "departmentNm": undefined,
            "userId": undefined,
            "userNm": undefined,
            "terminalInfo": undefined,
            "startDt": undefined,
            "endDt": undefined,
            "remarks": "",
            "deleteFlg": 0
        }, true).then(function (row) {
            row.select();
        });
    };

    // Search click
    function searchData(holdMsgFlg) {
        mainGrid.clearData();
        COMMON.hideMessage();
        search();
    };

    function search() {
        AA091.search($('[name="searchUserIdLst"]').val().split(mid_char)[0],
            ($('#searchDeleteFlgChk').prop('checked') ? "1" : "0"),
            mainGrid,
            function (result) {
                mainGrid.setData(result);
            })
    }

    // Update click
    function updateServerAll() {
        if (AA091.checkValidateEditData(mainGrid, listUserId))
            AA091.updateData(mainGrid.getSelectedRows(), function (data) {
                if (data.result == 0) {
                    COMMON.showMessageById("COM_001", "", "", "success");
                    search();
                }
                else {
                    COMMON.showMessage("result:" + data.result + "<br>" + data.errorMsg)
                }
            });
    };

    $("#updateBtn").keydown(function (e) {
        if (e.keyCode === KEY_CODE_TAB) {
            document.querySelector('.focusFirstItem').focus();
        }
    });

    return {
        init: init,
    };
})();

$(document).ready(function () {
    AA091_GUI.init();
});
