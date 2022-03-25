var AA010 = (function () {
    console.log('AA010');
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
            <li>
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
                                <input type="checkbox" class=""
                                    onclick="AA010.active('{Id}', this)" />
                            </div>
                            <div class="cell-locked">
                                <input type="checkbox" class=""
                                    onclick="AA010.lock('{Id}', this)" />
                            </div>
                            <div class="cell-hidden">
                                <button onclick="AA010.hide('{Id}')">Hide</button>
                            </div>
                        </div>
                    </summary>

                    {F_SUB}                    

                </details>
            </li> 
        `,
        sub: `
            <div class="history-container">
                <div class="history">
                    <div class="sub-header">
                        <div class="sub-cell-no">No</div>     
                        <div class="sub-cell-date">Happen Date</div>
                        <div class="sub-cell-status">Status</div>
                        <div class="sub-cell-description">Description</div>
                    </div>    
                    {F_SUB}
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
        loadDataByType(key, items => {
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

    function search(value) {

    }

    function email(id, value) {
        console.log('email', id, value);
    }

    function phone(id, value) {
        console.log('phone', id, value);
    }

    function active(id, obj) {
        console.log('active', id, obj.checked);
    }

    function lock(id, obj) {
        console.log('lock', id, obj.checked);
    }

    function hide(id) {
        console.log('hide', id);
    }

    function loadDataByType(type, callback) {
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

        var searchFullname = document.getElementById('searchFullName').value;
        var searchPhone = document.getElementById('searchPhone').value;
        var searchEmail = document.getElementById('searchEmail').value;

        var accountStatus = null;
        if (isActive) accountStatus = 1;
        if (isLock) accountStatus = -1;
        if (isHide) accountStatus = -2;

        var result = histories && histories.filter(p => {
            var condition = accountStatus !=
            return p.Status == accounntStatus;
        });
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
            if (field === 'F_SUB') {
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
            if (field === 'F_SUB') {
                return subs;
            }

            return item[field];
        });

        return body;
    }

    function init() {
        tab('guest');
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
