var baseApi = 'http://dhc.blo.com.vn/';
var key = '';

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