var AA010 = (function() {

    function tab (key) {
        if (key === 'guest') {
            // ...
            return;
        }
        if (key === 'driver') {
            // ...
            return;
        }
        if (key === 'admin') {
            // ...
            return;
        }
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