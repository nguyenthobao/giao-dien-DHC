$(document).ready(function () {
    getUserInfo();
    /*Get user info*/
    $('#tab1').change(function () {
        getUserInfo();
    });
    
    $('body').on('click', '#updateUserInfo', function () {
        var fullname = $('#fullNameTxt').val();

        if(fullname == '') {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Tên hiển thị là bắt buộc',
            });
            return;
        }

        $.ajax({
            type: 'POST',
            url: baseUrl + '?action=change-user-info',
            dataType: 'text',
            data: {
                fullname: fullname,
                email: $('#emailTxt').val(),
                phone: $('#phoneTxt').val(),
                address: $('#addressTxt').val(),
                key: key
            },
            success: function (result) {
                result = $.parseJSON(result);
                switch (result.code) {
                    case 200:
                        $('#fullname').text(fullname);
                        $.alert({
                            title: 'Thông báo!',
                            type: 'green',
                            typeAnimated: true,
                            content: 'Cập nhật thông tin thành công',
                        });
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
                            title: 'Thông báo!',
                            type: 'red',
                            typeAnimated: true,
                            content: 'Cập nhật thông tin thất bại',
                        });
                        break;
                }
            },
            error: function () {
                alert('Có lỗi');
            }
        });
    });
    
    $('body').on('click', '#updatePass', function () {
        var currentPass = $('#currentPass').val();
        var newPass = $('#newPass').val();
        var reNewPass = $('#reNewPass').val();

        if (currentPass.length < 6) {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Mật khẩu hiện tại không được ít hơn 6 ký tự',
            });
            return;
        }

        if (newPass.length < 6) {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Mật khẩu mới không được ít hơn 6 ký tự',
            });
            return;
        }

        if (reNewPass !== newPass) {
            $.alert({
                title: 'Cảnh báo!',
                type: 'red',
                typeAnimated: true,
                content: 'Hãy nhập lại mật khẩu mới, bạn nhập không đúng',
            });
            return;
        }

        $.ajax({
            type: 'POST',
            url: baseUrl + '?action=change-password',
            dataType: 'text',
            data: {
                currentPass: currentPass,
                newPass: newPass,
                key: key
            },
            success: function (result) {
                result = $.parseJSON(result);
                switch (result.code) {
                    case 200:
                        $.alert({
                            title: 'Thông báo!',
                            type: 'green',
                            typeAnimated: true,
                            content: 'Cập nhật mật khẩu thành công',
                        });
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
                        if(result.message == 'CURRENT_PASS_INVALID') {
                            $.alert({
                                title: 'Thông báo!',
                                type: 'red',
                                typeAnimated: true,
                                content: 'Mật khẩu hiện tại không chính xác',
                            });
                        } else {
                            $.alert({
                                title: 'Thông báo!',
                                type: 'red',
                                typeAnimated: true,
                                content: 'Cập nhật thông tin thất bại',
                            });
                        }

                        break;
                }
            },
            error: function () {
                alert('Có lỗi');
            }
        });
    });
});