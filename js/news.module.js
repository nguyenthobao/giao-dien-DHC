var baseApi = 'http://dhc.blo.com.vn/';
$(document).ready(function () {
    /*Get list news*/
    $('#tab4').change(function () {
        getListNews();

        /*Build form news*/
        buildFormNews();

        $('#imgUpload').change(function(){
            if($(this).val() !== '')
            {
                UploadImageNews();
            }
        });

        $.ajax({
            type: 'POST',
            url: baseApi + 'type/get-type',
            dataType: 'json',
            data: JSON.stringify({
                type_of: 1,
            }),
            success: function (result) {
                $('#newsType').html('');
                $.each(result.data.result, function (k, v) {
                    $('#newsType').append('<option value="' + v.type_id + '">' + v.type_name + '</option>');
                });
            },
            error: function () {
                alert('Có lỗi');
            }
        });
    });

    $('body').on('click', '.btn-upload-news', function () {
        var numberImg = $('.selectImg').length;
        if(numberImg < 1) {
            $('#imgUpload').click();
        } else {
            alert('Không chọn quá 1 ảnh');
        }
    });

    /*Add news button*/
    $('.add-form-news').click(function () {

        /*Reset value empty*/
        $('#newsForm .newsForm').val('');

        /*Show button upload and button add*/
        $('.btn-upload-news').show();
        $('#addNews').show();

        /*Hide edit news*/
        $('#editNews').hide();

        /*Remove all image preview of news detail or edit news*/
        $('.img-preview').remove();

        /*Enable form input*/
        $('#newsForm .form-control').prop('disabled', false);
    });

    /*Event Click Add News*/
    $('body').on('click', '#addNews', function () {
        var stringImage = '';
        $.each($('.selectImg'),function (k, v) {
            stringImage = v.currentSrc;
        });

        $.ajax({
            type: 'POST',
            url: baseApi + 'news/add-news',
            dataType: 'json',
            data: JSON.stringify({
                news_name: $('#newsName').val(),
                news_type: $('#newsType').val(),
                news_description: $('#newsDescription').val(),
                news_content: $('#newsContent').val(),
                news_note: $('#newsNote').val(),
                news_image: stringImage
            }),
            success: function () {
                $('#modalForm').modal('hide');
                getListNews();
            },
            error: function () {
                alert('Có lỗi');
            }
        });
    });

    /*Event view news detail*/
    $('body').on('click', '.view-news', function () {
        var newsId = $(this).data('id');
        /*Remove all image preview of news detail or edit news*/
        $('.img-preview').remove();

        getListNewsById(newsId, true);

        /*Disabled form input*/
        $('#newsForm .form-control').prop('disabled', true);

        /*Hide button upload*/
        $('.btn-upload-news').hide();

        /*Hide button accept and edit*/
        $('#addNews').hide();
        $('#editNews').hide();
    });

    /*Event edit point*/
    $('body').on('click', '.edit-news', function () {
        $('#newsForm .form-control').prop('disabled', false);

        var newsId = $(this).data('id');

        $('#newsId').val(newsId);

        $('.img-preview').remove();

        getListNewsById(newsId, false);

        $('#addNews').hide();
        $('#editNews').show();
    });

    /*Event Click Edit News*/
    $('body').on('click', '#editNews', function () {
        var stringImage = '';
        $.each($('.selectImg'),function (k, v) {
            stringImage = v.currentSrc;
        });

        $.ajax({
            type: 'POST',
            url: baseApi + 'news/edit-news',
            dataType: 'json',
            data: JSON.stringify({
                news_id: $('#newsId').val(),
                news_name: $('#newsName').val(),
                news_type: $('#newsType').val(),
                news_description: $('#newsDescription').val(),
                news_content: $('#newsContent').val(),
                news_note: $('#newsNote').val(),
                news_image: stringImage
            }),
            // async: false,
            success: function () {
                $('#modalForm').modal('hide');
                getListNews();
            },
            error: function () {
                alert('Error');
            }
        });
    });


    /*Event delete news*/
    $('body').on('click', '.delete-news', function () {
        var newsId = $(this).data('id');
        $.confirm({
            title: 'Xác nhận',
            content: 'Bạn chắc chắn muốn xóa ?',
            buttons: {
                confirm: {
                    text: 'Xác nhận',
                    btnClass: 'btn-danger',
                    action: function () {
                        $.ajax({
                            type: 'POST',
                            url: baseApi + 'news/delete-news',
                            dataType: 'json',
                            data: JSON.stringify({
                                news_id: newsId
                            }),
                            success: function () {
                                getListNews();
                            },
                            error: function () {
                                alert('Có lỗi');
                            }
                        });
                    }
                },
                cancel: {
                    text: 'Hủy'
                }
            }
        });
    });
});

/*Get list news ajax*/
function getListNews() {
    $('#news').html('');
    $.ajax({
        url: baseApi + 'news/get-all-news',
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
                html += '<a class="dropdown-item view-news" data-id="' + v.news_id + '" href="#">Chi tiết</a>';
                html += '<a class="dropdown-item edit-news" data-id="' + v.news_id + '" href="#">Sửa</a>';
                html += '<a class="dropdown-item delete-news" data-id="' + v.news_id + '" href="#">Xóa</a>';
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

/*Build form news*/
function buildFormNews() {
    $('#form-body').html('');
    $('#form-footer').html('');

    $('#modalFormLabel').text('Thêm mới tin tức');

    /*Build form body*/
    var formBodyHtml = '<form action="#" id="newsForm">';
            formBodyHtml += '<input type="hidden" id="newsId">';
                formBodyHtml += '<div class="row">';
                    formBodyHtml += '<div class="col-12 col-md-6">';
                        formBodyHtml += '<div class="form-group">';
                            formBodyHtml += '<label for="newsName">Tên bài viết</label>';
                            formBodyHtml += '<input type="text" class="form-control newsForm" id="newsName" placeholder="Tên bài viết">';
                        formBodyHtml += '</div>';
                    formBodyHtml += '</div>';
                    formBodyHtml += '<div class="col-12 col-md-6">';
                        formBodyHtml += '<div class="form-group">';
                            formBodyHtml += '<label for="newsType">Loại</label>';
                            formBodyHtml += '<select class="form-control" id="newsType"></select>';
                        formBodyHtml += '</div>';
                    formBodyHtml += '</div>';
                    formBodyHtml += '<div class="col-12">';
                        formBodyHtml += '<div class="form-group">';
                            formBodyHtml += '<label for="newsDescription">Mô tả</label>';
                            formBodyHtml += '<textarea class="form-control newsForm" id="newsDescription" rows="3" placeholder="Mô tả"></textarea>';
                        formBodyHtml += '</div>';
                    formBodyHtml += '</div>';
                    formBodyHtml += '<div class="col-12">';
                        formBodyHtml += '<div class="form-group">';
                            formBodyHtml += '<label for="newsContent">Nội dung</label>';
                            formBodyHtml += '<textarea class="form-control newsForm" id="newsContent" rows="3" placeholder="Nội dung"></textarea>';
                        formBodyHtml += '</div>';
                    formBodyHtml += '</div>';
                    formBodyHtml += '<div class="col-12">';
                        formBodyHtml += '<div class="form-group">';
                            formBodyHtml += '<label for="newsNote">Chú thích</label>';
                            formBodyHtml += '<input type="text" class="form-control newsForm" id="newsNote" placeholder="Chú thích">';
                        formBodyHtml += '</div>';
                    formBodyHtml += '</div>';

                    formBodyHtml += '<div class="col-12">';
                        formBodyHtml += '<div class="form-group">';
                            formBodyHtml += '<label>Hình ảnh</label>';
                            formBodyHtml += '<div class="row prepend-img">';
                                formBodyHtml += '<div class="col-3">';
                                formBodyHtml += '<span class="btn btn-outline-success btn-upload-news"><span>Thêm</span></span>';
                                formBodyHtml += '<input type="file" name="imgFile" id="imgUpload"/>';
                            formBodyHtml += '</div>';
                        formBodyHtml += '</div>';
                    formBodyHtml += '</div>';
                formBodyHtml += '</div>';
            formBodyHtml += '</div>';
        formBodyHtml += '</form>';
    $('#form-body').html(formBodyHtml);

    /*Build form footer*/
    var formFooter = '<button type="button" class="btn btn-outline-danger" data-dismiss="modal">Hủy</button>';
    formFooter += '<button type="button" class="btn btn-outline-success" id="addNews">Đồng ý</button>';
    formFooter += '<button type="button" class="btn btn-outline-success" id="editNews" style="display: none">Cập nhật</button>';

    $('#form-footer').html(formFooter);
}

function UploadImageNews() {
    var form = new FormData($("#newsForm")[0]);
    $.ajax({
        type: 'POST',
        url: baseApi + 'point/upload-image',
        data: form,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            var previewImg = '<div class="col-3 img-preview">';
            previewImg += '<button class="close remove-img" type="button">×</button>';
            previewImg += '<img src="' + data.data.result + '" class="img-thumbnail selectImg" alt="Preview">';
            previewImg += '</div>';
            $('.prepend-img').prepend(previewImg);
        }
    });
}

function getListNewsById(id, isView){
    $.ajax({
        url: baseApi + 'news/get-news',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            news_id: id
        }),
        success: function (result) {
            $('#modalForm').modal('show');
            var newsData = result.data.result;
            $('#newsName').val(newsData.news_name);
            $('#newsType').val(newsData.news_type).change();

            if(newsData.news_description !== null) {
                $('#newsDescription').val(newsData.news_description);
            }

            if(newsData.news_content !== null) {
                $('#newsContent').val(newsData.news_content);
            }

            if(newsData.news_note !== null) {
                $('#newsNote').val(newsData.news_note);
            }

            if(newsData.news_image !== '') {
                var newsImage = newsData.news_image;

                var previewImg = '<div class="col-3 img-preview">';
                if(!isView) {
                    previewImg += '<button class="close remove-img" type="button">×</button>';
                }
                previewImg += '<img src="' + newsImage + '" class="img-thumbnail selectImg" alt="Preview">';
                previewImg += '</div>';
                $('.prepend-img').prepend(previewImg);
                }
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });
}
