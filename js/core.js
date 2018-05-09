$(document).ready(function () {
    $.ajax({
        url: 'http://dhc.api/news/get-all-news',
        method: 'POST',
        dataType: 'json',
        success: function (result) {
            newsData = result.data.results;
            var index = 1;
            $.each(newsData, function (k, v) {
                html = '<tr>';
                html += '<th scope="row">' + index + '</th>';
                html += '<td>' + v.news_name + '</td>';
                html += '<td>' + v.newsType.type_name + '</td>';
                html += '<td>' + v.created_at + '</td>';
                html += '<td>' + v.news_note + '</td>';
                html += '<td><div class="dropdown">';
                html += '<a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"\n' +
                    'aria-expanded="false">';
                html += '<i class="fas fa-ellipsis-v"></i></a>';
                html += '<div class="dropdown-menu">';
                html += '<a class="dropdown-item" href="#">Chi tiết</a>';
                html += '<a class="dropdown-item" href="#">Sửa</a>';
                html += '<a class="dropdown-item" href="#">Xóa</a>';
                html += '</div>';
                html += '</div></td>';
                html += '</tr>';
                $('#news').append(html);
                index++;
            });
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });
})