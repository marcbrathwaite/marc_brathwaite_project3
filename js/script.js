$(function () {

    const displayMod = (function() {

        //If negative return -$num else $num
        function negativeCheck(num) {
            // console.log(typeof num);
            return num < 0 ? `-$${Math.abs(num).toFixed(2)}` : `$${num.toFixed(2)}`;
        }
        return {
            //Function to display user input
            displayEntry: function(date, transaction, category, description, amount ) {
                const allHtml = `<ul class="output-disp-row">
                            <li class="output-disp-col-med-all">
                                ${date}
                            </li>
                            <li class="output-disp-col-med-all">
                                ${transaction}
                            </li>
                            <li class="output-disp-col-med-all">
                                ${category}
                            </li>
                            <li class="output-disp-col-big-all">
                                ${description}
                            </li>
                            <li class="output-disp-col-med-all">
                                $${amount}
                            </li>
                            <li class="output-disp-col-small-all">
                                <i class="fas fa-times-circle"></i>
                            </li>
                        </ul>`;
                
                        const specHtml = `<ul class="output-disp-row">
                            <li class="output-disp-col-med">
                                ${date}
                            </li>
                            <li class="output-disp-col-med">
                                ${category}
                            </li>
                            <li class="output-disp-col-big">
                                ${description}
                            </li>
                            <li class="output-disp-col-med">
                                $${amount}
                            </li>
                            <li class="output-disp-col-small">
                                <i class="fas fa-times-circle"></i>
                            </li>
                        </ul>`;

                        $('#all-tab').append(allHtml);
                        $(`#${transaction.toLowerCase()}-tab`).append(specHtml);
            },
            displayValues: function(transaction,expense, income, balance) {
                if (transaction === 'Expense') {
                    $('#expense-total').text(negativeCheck(expense));
                } else {
                    $('#income-total').text(negativeCheck(income));
                }

                $('#balance-total').text(negativeCheck(balance));

            }
        }
    })();

    const operationsMod = (function() {

        // let income = 0;
        // let expenses = 0;
        // let balance = 0;

        const values = {
            income: 0,
            expense: 0,
            balance: 0
        }


        return {
            //Update Income/Expenses or Balance
            updateValues: function(transaction, amount) {
                values[`${transaction.toLowerCase()}`] += parseFloat(amount);
                values['balance'] = values['income'] - values['expense'];
            },
            getIncome: function() {
                return values['income'];
            },
            getExpense: function() {
                return values['expense'];
            },
            getBalance: function() {
                return values['balance'];
            }


        }

    })();

    const eventHandlerMod = (function (dispMod, opsMod) {

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

            //Listener for transaction type checkbox
            $('.uinput-radio-item').on('focus', function() {
                //Display correct select box
                $(`.uinput-${$(this).val()}-select`).toggleClass('uinput-invisible');
                //Hide select box
                $(`.uinput-${$('.uinput-radio-item:checked').val()}-select`).toggleClass('uinput-invisible');
            });

            //Clicking Add Entry button
            $('#submit').on('click', function(event) {
                event.preventDefault();

                //Store transaction type from checkbox
                const transactionType = $('.uinput-radio-item:checked').val();

                //Store date
                const date = $('#date').val(); 

                //Store category from drop down
                const category = $(`.uinput-${transactionType}-select option:checked`).val();

                //store descriptiom
                const description = $('#description').val();

                //Store amount
                const amount = $('#amount').val();

            
                //Update Income or Expense and Balance
                opsMod.updateValues(transactionType,amount);

                //Display Income/Expense and Balance
                dispMod.displayValues(transactionType,opsMod.getExpense(), opsMod.getIncome(), opsMod.getBalance());


                
                //display Entry in all table and either Expense or Income
                dispMod.displayEntry(date, transactionType, category, description, amount);
                
                
                $('#description').val('');
                $('#amount').val('');



            });
        }

        return {
            init: function() {
                setupEventHandlers();
            }
        }

    })(displayMod, operationsMod);

    eventHandlerMod.init();

});