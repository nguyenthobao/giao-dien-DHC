var baseApi = 'http://dhc.blo.com.vn/';
var baseUrl = 'http://admindhc.blo.com.vn/restful/';
var key = '';

$(document).ready(function () {
    /*Check login*/
    if (typeof(Storage) !== "undefined") {
        if(sessionStorage.appKey !== undefined && sessionStorage.appKey !== '') {
            var key = sessionStorage.appKey;
            $.ajax({
                type: 'POST',
                url: baseUrl + '?action=check-login',
                dataType: 'text',
                data: {
                    key: key
                },
                success: function (result) {
                    result = $.parseJSON(result);
                    if(result.code != 200) {
                        window.location.replace("login.html");
                    }
                    $('#fullname').text(result.data.fullName);
                    $('#content').show();
                    $('#navbarResponsive').show();
                },
                error: function () {
                    $.alert({
                        title: 'Cảnh báo!',
                        type: 'red',
                        typeAnimated: true,
                        content: 'Không thể kết nối',
                    });
                }
            });
        } else {
            window.location.replace("login.html");
        }

    } else {
        $.alert({
            title: 'Cảnh báo!',
            type: 'red',
            typeAnimated: true,
            content: 'Trình duyệt quá cũ, hệ thống không thể hoạt động',
        });
    }
    
    /*Logout*/
    $('body').on('click', '#user-logout', function () {
        sessionStorage.clear();
        window.location.replace("login.html");
    });

});

function getFormattedDate(unix_timestamp, methor) {
    var date = new Date(unix_timestamp*1000);
    str = '';
    if (methor === 'time') {
        str = $.format.date(date.getTime(), 'HH:mm')
    } else if(methor === 'date') {
        str = $.format.date(date.getTime(), 'dd/MM/yyyy')
    } else {
        str = $.format.date(date.getTime(), 'HH:mm, dd/MM/yyyy')
    }

    return str;
}

function dateToTimeStamp(dateStr) {
    if (dateStr === '') {
        return;
    }

    var parts = dateStr.split("/");

    var newDateStr = parts[1] + '/' + parts[0] + '/' + parts[2];

    var unixTime = Date.parse(newDateStr);

    return unixTime/1000;
}