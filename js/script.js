$(function () {

    const eventHandler = (function () {

        const setupEventHandlers = function () {
            //Click All Button
            $('#all-btn').on('click', function () {
                if (!$('#all-tab').hasClass("output-disp-top")) {
                    $('#all-tab').addClass("output-disp-top");
                    $('#income-tab').removeClass("output-disp-top");
                    $('#expense-tab').removeClass("output-disp-top");
                }
            });

            //Click Expense Button
            $('#expense-btn').on('click', function () {
                if (!$('#expense-tab').hasClass("output-disp-top")) {
                    $('#expense-tab').addClass("output-disp-top");
                    $('#all-tab').removeClass("output-disp-top");
                    $('#income-tab').removeClass("output-disp-top");
                }
            });
            //Click Income Button
            $('#income-btn').on('click', function () {
                if (!$('#income-tab').hasClass("output-disp-top")) {
                    $('#income-tab').addClass("output-disp-top");
                    $('#expense-tab').removeClass("output-disp-top");
                    $('#all-tab').removeClass("output-disp-top");
                }
            });
            //Clicking Add Entry button
            $('#submit').on('click', function(event) {
                event.preventDefault();

                console.log($('.uinput-radio-item:checked').val());

                console.log($('.uinput-date').val());

                if ()

                console.log($('.uinput-category-select option:selected'));





            });



        }

        return {
            init: function() {
                setupEventHandlers();
            }
        }

    })();

    eventHandler.init();

});