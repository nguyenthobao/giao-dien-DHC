var baseApi = 'http://dhc.blo.com.vn/';
var baseUrl = 'http://admindhc.blo.com.vn/restful/';
/*var baseApi = 'http://dhc.api/';
var baseUrl = 'http://admin.dhc.api/restful/';*/
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

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function buildPaging(page, totalPage, className) {
    html = '';
    if(page == 0) {
        html += '<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1">Trước</a></li>';
    } else {
        html += '<li class="page-item"><a class="page-link '+className+'" data-page="' + (page - 1) + '" href="#" tabindex="-1">Trước</a></li>';
    }

    var count = page;

    var limitPage = 3;
    if(totalPage < 3) {
        limitPage = totalPage;
    }

    if((totalPage - page) <= 3)
    {
        count = totalPage - limitPage;
    }

    for(var i = count; i < (count + limitPage) ; i++) {
        if(i == page) {
            html += '<li class="page-item active"><a class="page-link '+className+'" href="#">' + (i+1) + '</a></li>';
        } else {
            html += '<li class="page-item"><a class="page-link '+className+'" data-page="' + i + '" href="#">' + (i+1) + '</a></li>';
        }
    }

    if(page == (totalPage - 1)) {
        html += '<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1">Tiếp</a></li>';
    } else {
        html += '<li class="page-item"><a class="page-link '+className+'" data-page="' + (i + 1) + '" href="#" tabindex="-1">Tiếp</a></li>';
    }

    return html;
}

function buildFroalaEditor(id) {
    $('#'+id).froalaEditor({
        toolbarButtons: [
            'fullscreen',
            'bold',
            'italic',
            'underline',
            'strikeThrough',
            'subscript',
            'superscript', '|',
            'fontFamily',
            'fontSize',
            'color',
            'inlineStyle',
            'paragraphStyle', '|',
            'paragraphFormat',
            'align', 'formatOL',
            'formatUL', 'outdent',
            'indent', 'quote', '-',
            'insertImage',
            'insertVideo',
            'insertTable', '|', 'emoticons',
            'specialCharacters', 'insertHR', 'selectAll',
            'clearFormatting', '|', 'print', 'help', 'html', '|', 'undo', 'redo'
        ],
        zIndex: 2501,
        height: 300,
    });
}