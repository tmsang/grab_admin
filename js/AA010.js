var AA010 = (function () {
    console.log('AA010');
    var currentTab = 'guest';
    var str = '';
    var i = 0;

    var data = {};        // data[type] store data after load back [type: 'guest', 'driver', 'admin']   
    var template = {
        header: `
            <li class="header">
                <details>
                    <summary>
                        <div class="dong full">
                            <div class="cell-no">No</div>
                            <div class="cell-id">Id</div>
                            <div class="cell-fullname">Full Name</div>
                            <div class="cell-email">Email</div>
                            <div class="cell-phone">Phone</div>
                            <div class="cell-modify">Modified Date</div>
                            <div class="cell-actived">Actived</div>
                            <div class="cell-locked">Locked</div>
                            <div class="cell-hidden">Hiden</div>
                        </div>
                    </summary>                    
                </details>
            </li>
        `,
        item: `
            <li class="{Id}">
                <details>
                    <summary>
                        <div class="dong full">
                            <div class="cell-no">{F_Index}</div>
                            <div class="cell-id" title="{Id}">{F_Id}</div>
                            <div class="cell-fullname">{FullName}</div>
                            <div class="cell-email">
                                <span
                                    onclick="AA010.email('{Id}', '{Email}')">{Email}</span>
                            </div>
                            <div class="cell-phone">
                                <span
                                    onclick="AA010.phone('{Id}', '{Phone}')">{Phone}</span>
                            </div>
                            <div class="cell-modify">{F_ModifiedDate}</div>
                            <div class="cell-actived">
                                <input type="checkbox" title="actived" class="{Id}" {F_Active}
                                    onclick="AA010.active('{Id}', this)" />
                            </div>
                            <div class="cell-locked">
                                <input type="checkbox" title="locked" class="{Id}" {F_Lock}
                                    onclick="AA010.lock('{Id}', this)" />
                            </div>
                            <div class="cell-hidden">
                                <input type="checkbox" title="hidden" class="{Id}" {F_Hide}
                                    onclick="AA010.hide('{Id}', this)" />                                
                            </div>
                        </div>
                    </summary>

                    {F_HISTORIES}                    

                </details>
            </li> 
        `,
        sub: `
            <div class="history-container">
                <div class="history {Id}">
                    <div class="sub-header">
                        <div class="sub-cell-no">No</div>     
                        <div class="sub-cell-date">Happen Date</div>
                        <div class="sub-cell-status">Status</div>
                        <div class="sub-cell-description">Description</div>
                    </div>    
                    {F_HISTORY_ITEM}
                </div>
            </div>
        `,
        subItem: `
            <div class="sub-body">
                <div class="sub-cell-no">{F_Index}</div>     
                <div class="sub-cell-date">{F_HappenDate}</div>
                <div class="sub-cell-status">{F_Status}</div>
                <div class="sub-cell-description">{Description}</div>
            </div>
        `
    };

    function tab(key) {
        currentTab = key;
        loadDataByType(key);        // base on filter value [check box, text]
    }

    function search(obj) {
        if (!obj) {
            document.getElementById('searchFullName').focus();
        }
        loadDataByType(currentTab);        // base on filter value [check box, text]
    }

    function email(id, value) {
        console.log('email', id, value);
    }

    function phone(id, value) {
        console.log('phone', id, value);
    }

    function active(id, obj) {
        var status = 1;
        API.POST(URL_ADMIN + '/accounts', { 'Id': id, 'AccountType': currentTab, 'Status': status }, function (result) {
            arrangeCheckbox(obj);
            addRecordToHistory(id, status);
        });
    }

    function lock(id, obj) {
        var status = -1;
        API.POST(URL_ADMIN + '/accounts', { 'Id': id, 'AccountType': currentTab, 'Status': status }, function (result) {
            arrangeCheckbox(obj);
            addRecordToHistory(id, status);
        });
    }

    function hide(id, obj) {
        var status = -2;
        API.POST(URL_ADMIN + '/accounts', { 'Id': id, 'AccountType': currentTab, 'Status': status }, function (result) {
            arrangeCheckbox(obj);
            addRecordToHistory(id, status);
        });
    }

    // 2 factors: id, title -> reset check on checkboxes
    function arrangeCheckbox(obj) {        
        if (obj.title === 'actived') {
            $('li.' + obj.className + ' summary .cell-actived input').prop("checked", true);
            $('li.' + obj.className + ' summary .cell-locked input').prop("checked", false);
            $('li.' + obj.className + ' summary .cell-hidden input').prop("checked", false);
        }
        else if (obj.title === 'locked') {
            $('li.' + obj.className + ' summary .cell-actived input').prop("checked", false);
            $('li.' + obj.className + ' summary .cell-locked input').prop("checked", true);
            $('li.' + obj.className + ' summary .cell-hidden input').prop("checked", false);
        }
        else if (obj.title === 'hidden') {
            $('li.' + obj.className + ' summary .cell-actived input').prop("checked", false);
            $('li.' + obj.className + ' summary .cell-locked input').prop("checked", false);
            $('li.' + obj.className + ' summary .cell-hidden input').prop("checked", true);
        }
    }

    function addRecordToHistory(id, status) {
        var now = new Date();        

        // update record + add record into Histories of data[type]
        var items = data[currentTab].filter(p => { return p.Id == id; });
        if (!items || items.length <= 0) {
            console.log('Id is not exists in temp array data.');
            return;
        }

        var modifiedDate = UTILS.formatDate(now, 'yyyy-MM-ddThh:mm:ss');
        items[0].ModifiedDate = modifiedDate;
        items[0].Status = status;
        items[0].Histories.unshift({
            'Id': (items[0].Histories[0].Id + 1),
            'HappenDate': modifiedDate,             // 2022-03-28T15:22:49.492963
            'Status': status,
            'Description': 'Change status account ' + COMMON.getStatusWithClassCss(status)
        });

        // add GUI    
        var html = template.subItem.replace(/{\w+}/gi, function (match) {
            var field = match.replace(/[{}]/gi, '');

            if (field === 'F_Index') return 1;
            if (field === 'F_HappenDate') {
                var _v = UTILS.formatDate(now, 'dd-MMM-yyyy hh:mm:ss');
                return _v;
            }
            if (field === 'F_Status') {
                var _v = COMMON.getStatusWithClassCss(status);
                return _v.toUpperCase() || '';
            }
            if (field === 'Description') {
                return 'Change status account ' + COMMON.getStatusWithClassCss(status);
            }
        });
        $(html).insertAfter('.history-container .history.' + id + ' .sub-header');

        // change No 1, 2, 3, ...  [histories]      
        $('.history-container .history.' + id + ' .sub-body').each((index, subBody) => {
            var noObj = $(subBody).find('.sub-cell-no');
            noObj && noObj[0] && $(noObj[0]).html(index + 1);
        });

        // update [modified date]
        $('li.' + id + ' summary div .cell-modify').html(UTILS.formatDate(now, 'dd-MMM-yyyy hh:mm:ss'));
    }

    function loadDataByType(key) {
        loadDataByTypeWithCallback(key, items => {
            i = 0;
            str = template.header;
            items && items.forEach(item => {
                i = i + 1;
                var template = historyTemplate(item, i);
                str += template;
            });
            $(".account-container .grid-container #accounts").html(str);
        });
    }

    function loadDataByTypeWithCallback(type, callback) {
        var temp;
        if (data && data[type]) {
            temp = filterData(data[type]);
            callback(temp);
            return;
        }
        API.GET(URL_ADMIN + '/accounts?type=' + type, function (histories) {
            // set data here
            data[type] = histories;
            temp = filterData(data[type]);
            callback(temp);
        });
    }

    function filterData(histories) {
        var isActive = document.getElementById('chkShowActiveAccount').checked;
        var isLock = document.getElementById('chkShowLockAccount').checked;
        var isHide = document.getElementById('chkShowHiddenAccount').checked;

        var accountStatus = null;
        if (isActive) accountStatus = 1;
        if (isLock) accountStatus = -1;
        if (isHide) accountStatus = -2;

        var searchFullname = lower(document.getElementById('searchFullName').value);
        var searchPhone = lower(document.getElementById('searchPhone').value);
        var searchEmail = lower(document.getElementById('searchEmail').value);

        var accountText = null;
        if (searchFullname || searchPhone || searchEmail) accountText = 'have_value';

        var result = histories && histories.filter(p => {
            // filter by checkbox (status)
            var statusCondition = accountStatus === null ? true : (p.Status == accountStatus);
            // filter by FullName | Phone | Email
            var textCondition = accountText === null ? true : (
                lower(p.FullName).indexOf(searchFullname) >= 0 &&
                lower(p.Phone).indexOf(searchPhone) >= 0 &&
                lower(p.Email).indexOf(searchEmail) >= 0
            );

            return statusCondition && textCondition;
        });

        return result;
    }

    function lower(value) {
        if (!value) return '';
        return value.toLowerCase();
    }

    function historyTemplate(item, index) {
        var s = template.item;
        var u = template.sub;
        var v = template.subItem;

        // replace sub (first)
        var sub = '';
        var j = 0;
        item && item.Histories && item.Histories.forEach(history => {
            j = j + 1;
            var _s = v.replace(/{\w+}/gi, function (match) {
                var field = match.replace(/[{}]/gi, '');

                if (field === 'F_Index') return j;
                if (field === 'F_HappenDate') {
                    // 2022-03-25T10:48:28
                    var _v = UTILS.formatDate(history['HappenDate'], 'dd-MMM-yyyy hh:mm:ss');
                    return _v;
                }
                if (field === 'F_Status') {
                    var _v = COMMON.getStatusWithClassCss(history['Status']);
                    return _v.toUpperCase() || '';
                }
                return history[field];
            });

            sub = sub + _s;
        });
        var subs = u.replace(/{\w+}/gi, function (match) {
            var field = match.replace(/[{}]/gi, '');
            if (field === 'Id') {
                return item.Id;
            }
            if (field === 'F_HISTORY_ITEM') {
                return sub;
            }
        });

        // replace body (second)        
        var body = s.replace(/{\w+}/gi, function (match) {
            var field = match.replace(/[{}]/gi, '');

            if (field === 'F_Index') return index;
            if (field === 'F_Id') {
                var _s = item['Id']
                return _s.substring(0, 8) + '...';
            }
            if (field === 'F_ModifiedDate') {
                // 2022-03-25T10:48:28
                var _s = UTILS.formatDate(item['ModifiedDate'], 'dd-MMM-yyyy hh:mm:ss');
                return _s;
            }
            if (field === 'F_Active') {
                return item['Status'] === 1 ? 'checked' : '';
            }
            if (field === 'F_Lock') {
                return item['Status'] === -1 ? 'checked' : '';
            }
            if (field === 'F_Hide') {
                return item['Status'] === -2 ? 'checked' : '';
            }
            if (field === 'F_HISTORIES') {
                return subs;
            }

            return item[field];
        });

        return body;
    }

    function init() {
        search();
    }

    init();

    return {
        tab: tab,
        search: search,
        email: email,
        phone: phone,
        active: active,
        lock: lock,
        hide: hide
    };
})();
