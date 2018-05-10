$(document).ready(function () {

    $('.btn-upload').click(function () {
        var numberImg = $('.selectImg').length;
        if(numberImg < 3) {
            $('#imgUpload').click();
        } else {
            alert('Không chọn quá 3 ảnh');
        }
    });

    $('#imgUpload').change(function(){
        UploadImage();
    });

    /*Add Point*/
    $('#addPoint').click(function () {
        var arr = [];
        $.each($('.selectImg'),function (k, v) {
            arr.push(v.currentSrc);
        });
        var stringImage = JSON.stringify(arr);
        $.ajax({
            type: 'POST',
            url: 'http://dhc.api/point/add-point',
            dataType: 'json',
            data: JSON.stringify({
                point_name: $('#pointName').val(),
                point_type: $('#pointType').val(),
                lat: $('#pointLat').val(),
                long: $('#pointLong').val(),
                point_detail: $('#pointDetail').val(),
                point_note: $('#pointNote').val(),
                point_images: stringImage
            }),
            success: function () {
                $('#modalForm').modal('hide');
            },
            error: function () {
                alert('Có lỗi');
            }
        });
    });

    /*Get list point*/
    $('#tab2').change(function () {
        getListPoint();
    });

    /*Get list news*/
    $('#tab4').change(function () {
        getListNews();
    });
});

/*Upload image ajax*/
function UploadImage() {
    var form = new FormData($("#pointForm")[0]);
    $.ajax({
        type: 'POST',
        url: 'http://dhc.api/point/upload-image',
        data: form,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            var previewImg = '<div class="col-3">';
                previewImg += '<img src="' + data.data.result + '" class="img-thumbnail selectImg" alt="Preview">';
                previewImg += '</div>';
            $('.prepend-img').prepend(previewImg);
        }
    });
}

/*Get list news ajax*/
function getListNews() {
    $('#news').html('');
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
                if(v.news_note == null) {
                    html += '<td>-</td>';
                } else {
                    html += '<td>' + v.news_note + '</td>';
                }
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
}

/*Get list point ajax*/
function getListPoint() {
    $('#point').html('');
    $.ajax({
        url: 'http://dhc.api/point/get-all-point',
        method: 'POST',
        dataType: 'json',
        success: function (result) {
            pointData = result.data.results;
            var index = 1;
            $.each(pointData, function (k, v) {
                html = '<tr>';
                html += '<th scope="row">' + index + '</th>';
                html += '<td>' + v.point_name + '</td>';
                html += '<td>' + v.pointType.type_name + '</td>';
                html += '<td>' + v.lat + ',' + v.long + '</td>';
                if(v.point_note == null) {
                    html += '<td>-</td>';
                } else {
                    html += '<td>' + v.point_note + '</td>';
                }
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
                $('#point').append(html);
                index++;
            });
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });
}