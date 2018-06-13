var totalPromotionPage = 0;
var classPromotionPage = 'promotion-page';

$(document).ready(function () {
    /*Get list news*/
    $('#tab3').change(function () {
        getListPromotion(0);
        html = buildPaging(0, totalPromotionPage, classPromotionPage);
        $('#page-promotion').html(html);

        /*Build form news*/
        buildFormPromotion();

        /*Froala*/
        // buildFroalaEditor('promotionDetail');

        /*Datepicker*/
        var timeStart = $('#timeStart');
        var timeEnd = $('#timeEnd');
        timeStart.datepicker({
            dateFormat: 'dd/mm/yy',
            minDate: 0,
            onSelect: function (dateStr) {
                changeDate(dateStr);
            }
        });

        timeEnd.datepicker({
            dateFormat: 'dd/mm/yy'
        });

        $('body').on('click', '.btn-upload-promotion', function () {
            var numberImg = $('.selectImg').length;
            if(numberImg < 1) {
                $('#imgUpload').click();
            } else {
                alert('Không chọn quá 1 ảnh');
            }
        });

        $('#imgUpload').change(function(){
            if($(this).val() !== '')
            {
                UploadImagePromotion();
            }
        });

        $.ajax({
            type: 'POST',
            url: baseUrl + '?action=get-type',
            dataType: 'text',
            data: {
                type_of: 3,
            },
            success: function (result) {
                result = $.parseJSON(result);
                $('#promotionType').html('');
                $.each(result.data.result, function (k, v) {
                    $('#promotionType').append('<option value="' + v.type_id + '">' + v.type_name + '</option>');
                });
            },
            error: function () {
                alert('Có lỗi');
            }
        });
    });

    /*Add point button*/
    $('.add-form-promotion').click(function () {

        /*Reset value empty*/
        $('#promotionForm .promotionForm').val('');

        /*Show button upload and button add*/
        $('.btn-upload-promotion').show();
        $('#addPromotion').show();

        /*Hide edit point*/
        $('#editPromotion').hide();

        /*Remove all image preview of point detail or edit point*/
        $('.img-preview').remove();

        tinymce.init({ selector:'textarea#promotionDetail' });
        setTimeout(function(){
            tinymce.activeEditor.setContent('');
        },100);
        /*Enable form input*/
        $('#promotionForm .form-control').prop('disabled', false);
    });

    /*Event view promotion detail*/
    $('body').on('click', '.view-promotion', function () {
        $('#promotionForm .form-control').val('');
        var promotionId = $(this).data('id');
        /*Remove all image preview of promotion detail or edit promotion*/
        $('.img-preview').remove();

        getListPromotionById(promotionId, true);

        /*Disabled form input*/
        $('#promotionForm .form-control').prop('disabled', true);

        /*Hide button upload*/
        $('.btn-upload-promotion').hide();

        /*Hide button accept and edit*/
        $('#addPromotion').hide();
        $('#editPromotion').hide();

        return false;
    });

    /*Event edit promotion*/
    $('body').on('click', '.edit-promotion', function () {
        $('#promotionForm .form-control').prop('disabled', false);
        $('#promotionForm .form-control').val('');

        var promotionId = $(this).data('id');

        $('#promotionId').val(promotionId);

        $('.img-preview').remove();

        getListPromotionById(promotionId, false);

        $('#addPromotion').hide();
        $('#editPromotion').show();

    });

    /*Event Click Edit Promotion*/
    $('body').on('click', '#editPromotion', function (){
        var stringImage = '';
        $.each($('.selectImg'),function (k, v) {
            stringImage = v.currentSrc;
        });

        var key = sessionStorage.appKey;

        $.ajax({
            type: 'POST',
            url: baseUrl + '?action=edit-promotion',
            dataType: 'text',
            data: {
                promotion_id: $('#promotionId').val(),
                promotion_name: $('#promotionName').val(),
                promotion_type: $('#promotionType').val(),
                time_start: dateToTimeStamp($('#timeStart').val()),
                time_end: dateToTimeStamp($('#timeEnd').val()),
                promotion_detail: tinymce.get('promotionDetail').getContent({format : 'raw', no_events : 1}),
                promotion_note: $('#promotionNote').val(),
                promotion_image: stringImage,
                key: key
            },
            success: function (result) {
                result = $.parseJSON(result);
                switch (result.code) {
                    case 200:
                        $('#modalForm').modal('hide');
                        getListPromotion(0);
                        html = buildPaging(0, totalPromotionPage, classPromotionPage);
                        $('#page-promotion').html(html);
                        break;
                    case 401:
                        $.alert({
                            title: 'Cảnh báo!',
                            type: 'red',
                            typeAnimated: true,
                            content: '<p>Hết hạn đăng nhập</p><b>Vui lòng đăng nhập lại</b>',
                            onClose: function () {
                                sessionStorage.clear();
                                window.location.replace("login.html");
                            }
                        });
                        break;
                    default:
                        $.alert({
                            title: 'Cảnh báo!',
                            type: 'red',
                            typeAnimated: true,
                            content: result.message
                        });
                        break;
                }
            },
            error: function () {
                alert('Error');
            }
        });
    });

    /*Event Click Add Promotion*/
    $('body').on('click', '#addPromotion', function () {
        var stringImage = '';
        $.each($('.selectImg'),function (k, v) {
            stringImage = v.currentSrc;
        });

        var key = sessionStorage.appKey;

        $.ajax({
            type: 'POST',
            url: baseUrl + '?action=add-promotion',
            dataType: 'text',
            data: {
                promotion_name: $('#promotionName').val(),
                promotion_type: $('#promotionType').val(),
                time_start: dateToTimeStamp($('#timeStart').val()),
                time_end: dateToTimeStamp($('#timeEnd').val()),
                promotion_detail: tinymce.get('promotionDetail').getContent({format : 'raw', no_events : 1}),
                promotion_note: $('#promotionNote').val(),
                promotion_image: stringImage,
                key: key
            },
            success: function (result) {
                result = $.parseJSON(result);

                switch (result.code) {
                    case 200:
                        $('#modalForm').modal('hide');
                        getListPromotion(0);
                        html = buildPaging(0, totalPromotionPage, classPromotionPage);
                        $('#page-promotion').html(html);
                        break;
                    case 401:
                        $.alert({
                            title: 'Cảnh báo!',
                            type: 'red',
                            typeAnimated: true,
                            content: '<p>Hết hạn đăng nhập</p><b>Vui lòng đăng nhập lại</b>',
                            onClose: function () {
                                sessionStorage.clear();
                                window.location.replace("login.html");
                            }
                        });
                        break;
                    default:
                        $.alert({
                            title: 'Cảnh báo!',
                            type: 'red',
                            typeAnimated: true,
                            content: result.message
                        });
                        break;
                }
            },
            error: function () {
                alert('Có lỗi');
            }
        });
    });

    $('body').on('click', '.'+classPromotionPage, function () {
        var page = $(this).data('page');

        if(page !== undefined) {
            getListPromotion(page);
            html = buildPaging(page, totalPromotionPage, classPromotionPage);
            $('#page-promotion').html(html);
        }

        return false;
    });

    /*Event delete promotion*/
    $('body').on('click', '.delete-promotion', function () {
        var promotionId = $(this).data('id');
        var key = sessionStorage.appKey;
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
                            url: baseUrl + '?action=delete-promotion',
                            dataType: 'text',
                            data: {
                                promotion_id: promotionId,
                                key: key
                            },
                            success: function (result) {
                                result = $.parseJSON(result);

                                switch (result.code) {
                                    case 200:
                                        $('#modalForm').modal('hide');
                                        getListPromotion(0);
                                        html = buildPaging(0, totalPromotionPage, classPromotionPage);
                                        $('#page-promotion').html(html);
                                        break;
                                    case 401:
                                        $.alert({
                                            title: 'Cảnh báo!',
                                            type: 'red',
                                            typeAnimated: true,
                                            content: '<p>Hết hạn đăng nhập</p><b>Vui lòng đăng nhập lại</b>',
                                            onClose: function () {
                                                sessionStorage.clear();
                                                window.location.replace("login.html");
                                            }
                                        });
                                        break;
                                    default:
                                        $.alert({
                                            title: 'Cảnh báo!',
                                            type: 'red',
                                            typeAnimated: true,
                                            content: result.message
                                        });
                                        break;
                                }
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

function getListPromotion(page) {
    $('#promotion').html('');
    $.ajax({
        url: baseUrl + '?action=get-all-promotion',
        method: 'POST',
        dataType: 'text',
        data: {
            'page': page,
        },
        async: false,
        success: function (result) {
            result = $.parseJSON(result);

            promotionData = result.data.results;
            totalPromotionPage = result.data.totalPage;

            var index = 1;
            $.each(promotionData, function (k, v) {
                html = '<tr>';
                html += '<th scope="row">' + index + '</th>';
                html += '<td>' + v.promotion_name + '</td>';
                html += '<td>' + v.promotionType.type_name + '</td>';
                if(v.time_start !== null && v.time_end) {
                    html += '<td>' + getFormattedDate(v.time_start, 'date') + ' - ' + getFormattedDate(v.time_end, 'date') + '</td>';
                } else if (v.time_start !== null && v.time_end == null) {
                    html += '<td> Từ ' + getFormattedDate(v.time_start, 'date') + '</td>';
                }
                else if (v.time_end !== null && v.time_start == null) {
                    html += '<td> Kết thúc ' + getFormattedDate(v.time_end, 'date') + '</td>';
                } else {
                    html += '<td> Không thời hạn </td>';
                }

                if(v.promotion_note == null) {
                    html += '<td>-</td>';
                } else {
                    html += '<td>' + v.promotion_note + '</td>';
                }
                html += '<td><div class="dropdown">';
                html += '<a class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"\n' +
                    'aria-expanded="false">';
                html += '<i class="fas fa-ellipsis-v"></i></a>';
                html += '<div class="dropdown-menu">';
                html += '<a class="dropdown-item view-promotion" data-id="' + v.promotion_id + '" href="#">Chi tiết</a>';
                html += '<a class="dropdown-item edit-promotion" data-id="' + v.promotion_id + '" href="#">Sửa</a>';
                html += '<a class="dropdown-item delete-promotion" data-id="' + v.promotion_id + '" href="#">Xóa</a>';
                html += '</div>';
                html += '</div></td>';
                html += '</tr>';
                $('#promotion').append(html);
                index++;
            });
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });
}

function buildFormPromotion() {
    $('#form-body').html('');
    $('#form-footer').html('');

    $('#modalFormLabel').text('Thêm mới khuyến mãi');

    /*Build form body*/
    var formBodyHtml = '<form action="#" id="promotionForm">';
        formBodyHtml += '<input type="hidden" id="promotionId">';
        formBodyHtml += '<div class="row">';
            formBodyHtml += '<div class="col-12 col-md-6">';
                formBodyHtml += '<div class="form-group">';
                formBodyHtml += '<label for="promotionName">Tên bài viết</label>';
                formBodyHtml += '<input type="text" class="form-control promotionForm" id="promotionName" placeholder="Tên khuyến mãi">';
                formBodyHtml += '</div>';
            formBodyHtml += '</div>';
            formBodyHtml += '<div class="col-12 col-md-6">';
                formBodyHtml += '<div class="form-group">';
                formBodyHtml += '<label for="promotionType">Loại</label>';
                formBodyHtml += '<select class="form-control" id="promotionType"></select>';
                formBodyHtml += '</div>';
            formBodyHtml += '</div>';

            formBodyHtml += '<div class="col-12 col-md-6">';
                formBodyHtml += '<div class="form-group">';
                    formBodyHtml += '<label for="timeStart">Bắt đầu</label>';
                    formBodyHtml += '<input type="text" class="form-control promotionForm" id="timeStart">';
                    formBodyHtml += '<img src="images/calendar.png" class="img-datepicker">';
                formBodyHtml += '</div>';
            formBodyHtml += '</div>';

            formBodyHtml += '<div class="col-12 col-md-6">';
                formBodyHtml += '<div class="form-group">';
                    formBodyHtml += '<label for="timeEnd">Kết thúc</label>';
                    formBodyHtml += '<input type="text" class="form-control promotionForm" id="timeEnd">';
                    formBodyHtml += '<img src="images/calendar.png" class="img-datepicker">';
                formBodyHtml += '</div>';
            formBodyHtml += '</div>';

            formBodyHtml += '<div class="col-12">';
                formBodyHtml += '<div class="form-group">';
                formBodyHtml += '<label for="promotionDetail">Mô tả</label>';
                formBodyHtml += '<textarea name="promotionDetail" class="form-control promotionForm" id="promotionDetail" rows="3" placeholder="Mô tả"></textarea>';
                formBodyHtml += '</div>';
            formBodyHtml += '</div>';
            formBodyHtml += '<div class="col-12">';
                formBodyHtml += '<div class="form-group">';
                formBodyHtml += '<label for="promotionNote">Chú thích</label>';
                formBodyHtml += '<input type="text" class="form-control promotionForm" id="promotionNote" placeholder="Chú thích">';
                formBodyHtml += '</div>';
            formBodyHtml += '</div>';
            formBodyHtml += '<div class="col-12">';
                formBodyHtml += '<div class="form-group">';
                    formBodyHtml += '<label>Hình ảnh</label>';
                    formBodyHtml += '<div class="row prepend-img">';
                    formBodyHtml += '<div class="col-3">';
                    formBodyHtml += '<span class="btn btn-outline-success btn-upload-promotion"><span>Thêm</span></span>';
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
    formFooter += '<button type="button" class="btn btn-outline-success" id="addPromotion">Đồng ý</button>';
    formFooter += '<button type="button" class="btn btn-outline-success" id="editPromotion" style="display: none">Cập nhật</button>';

    $('#form-footer').html(formFooter);
}

/*Change date by timeStart*/
function changeDate(dateStr) {
    if (dateStr === '') {
        return;
    }
    var date_Str = '';
    for (var i = 0; i < 10; i++) {

        if (i == 1 || i == 0) {
            date_Str += dateStr.charAt(i + 3);
        } else if (i == 3 || i == 4) {
            date_Str += dateStr.charAt(i - 3);
        }
        else date_Str += dateStr.charAt(i);
    }
    $('#timeEnd').datepicker("option", {
        minDate: new Date(date_Str)
    });
}

function UploadImagePromotion() {
    var form = new FormData($("#promotionForm")[0]);
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

function getListPromotionById(id, isView){
    $.ajax({
        url: baseUrl + '?action=get-promotion',
        method: 'POST',
        dataType: 'text',
        data: {
            promotion_id: id
        },
        success: function (result){
            tinymce.init({ selector:'textarea#promotionDetail' });
            result = $.parseJSON(result);
            $('#modalForm').modal('show');
            var promotionData = result.data.result;
            $('#promotionName').val(htmlDecode(promotionData.promotion_name));
            $('#promotionType').val(promotionData.promotion_type).change();

            if(promotionData.promotion_detail !== null) {
                setTimeout(function(){
                tinymce.activeEditor.setContent(promotionData.promotion_detail);
                },100);
            }
            if(promotionData.promotion_note !== null) {
                $('#promotionNote').val(htmlDecode(     promotionData.promotion_note));
            }
            if(promotionData.time_start !== null && promotionData.time_start !== '') {
                $('#timeStart').val(getFormattedDate(promotionData.time_start, 'date'));
            }

            if(promotionData.time_end !== null && promotionData.time_end !== '') {
                $('#timeEnd').val(getFormattedDate(promotionData.time_end, 'date'));
            }
            if(promotionData.promotion_image !== '') {
                var promotionImage = promotionData.promotion_image;
                var previewImg = '<div class="col-3 img-preview">';
                if(!isView) {
                    previewImg += '<button class="close remove-img" type="button">×</button>';
                }
                previewImg += '<img src="' + promotionImage + '" class="img-thumbnail selectImg" alt="Preview">';
                previewImg += '</div>';
                $('.prepend-img').prepend(previewImg);
            }
        },
        error: function (e) {
            alert('Có lỗi');
        }
    });
}