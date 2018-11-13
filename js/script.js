$(function () {
    // Uncheck checkbox when link in Mobile Nav is clicked, cauing menu to slide in. Also, removed position:fixed from body
    $('#all-btn').on('click', function () {
        if (!$('#all-tab').hasClass("output-disp-top")) {
            $('#all-tab').addClass("output-disp-top");
            $('#income-tab').removeClass("output-disp-top");
            $('#expense-tab').removeClass("output-disp-top");
        }
    });
    $('#expense-btn').on('click', function () {
        if (!$('#expense-tab').hasClass("output-disp-top")) {
            $('#expense-tab').addClass("output-disp-top");
            $('#all-tab').removeClass("output-disp-top");
            $('#income-tab').removeClass("output-disp-top");
        }
    });
    $('#income-btn').on('click', function () {
        if (!$('#income-tab').hasClass("output-disp-top")) {
            $('#income-tab').addClass("output-disp-top");
            $('#expense-tab').removeClass("output-disp-top");
            $('#all-tab').removeClass("output-disp-top");
        }
    });
});