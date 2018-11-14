//Module for the User interface
const uiModule = (function () {

    const totalObjs = {
        allObj: {},
        expenseObj: {},
        incomeObj: {}
    };
    // const allObj = {};
    // const expenseObj = {};
    // const incomeObj = {};
    let id = 0;

    //If negative return -$num else $num
    function negativeCheck(num) {
        return num < 0 ? `-$${Math.abs(num).toFixed(2)}` : `$${num.toFixed(2)}`;
    }
    return {
        //Function to display user input
        displayEntry: function (date, transaction, category, description, amount) {

            const htmlID = `${transaction.toLowerCase()}-${id}`;

            totalObjs["allObj"][htmlID] = {
                date: date,
                transaction: transaction,
                category: category,
                description: description,
                amount: amount
            };

            // console.log(totalObjs["allObj"]);

            totalObjs[`${transaction.toLowerCase()}Obj`][htmlID] = {
                date: date,
                category: category,
                description: description,
                amount: amount
            }



            const allHtml = `<ul class="output-disp-row" id="${htmlID}-list">
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
                                $${parseFloat(amount).toFixed(2)}
                            </li>
                            <li class="output-disp-col-small-all">
                                <i class="fas fa-times-circle" id="${htmlID}"></i>
                            </li>
                        </ul>`;

            const specHtml = `<ul class="output-disp-row" id="${htmlID}-list">
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
                                $${parseFloat(amount).toFixed(2)}
                            </li>
                            <li class="output-disp-col-small">
                                <i class="fas fa-times-circle" id="${htmlID}"></i>
                            </li>
                        </ul>`;

            $('#all-tab').append(allHtml);
            $(`#${transaction.toLowerCase()}-tab`).append(specHtml);
            id++; //increment ID
        },
        //Function to display Expence/Income and Balance on the Dom
        displayValues: function (transaction, expense, income, balance) {
            // if (transaction === 'Expense') {
            if (/expense/i.test(transaction)) { 
                $('#expense-total').text(negativeCheck(expense));
            } else {
                $('#income-total').text(negativeCheck(income));
            }

            $('#balance-total').text(negativeCheck(balance));

        },
        //Check whether enter amount is a valid dollar amount
        isValidAmount: function(amount) {
            amount = amount.replace(/^\$/,"");
            return $.isNumeric(amount) ? amount : false;
        },
        //Remove entry from the All table
        removeFromTables: function(id) {
            $(`#all-tab #${id}-list`).remove();
            delete totalObjs["allObj"][id];
            if(/expense/.test(id)) {
                $(`#expense-tab #${id}-list`).remove();
                delete totalObjs["expenseObj"][id];
            } else {
                $(`#income-tab #${id}-list`).remove();
                delete totalObjs["incomeObj"][id];
            }
        }, 
        getAllObj: function() {
            return totalObjs["allObj"];
        },
        getIncomeObj: function() {
            return totalObjs["incomeObj"];
        },
        getExpenseObj: function() {
            return totalObjs["expenseObj"];
        }
    }
})();

//Module for handling calculations
const opsModule = (function () {

    // let income = 0;
    // let expenses = 0;
    // let balance = 0;

    const values = {
        income: 0,
        expense: 0,
        balance: 0
    }

    const updateBalance = function(){
        values['balance'] = values['income'] - values['expense'];
    };


    return {
        //Update Income/Expenses or Balance after input
        addValues: function (transaction, amount) {
            values[`${transaction.toLowerCase()}`] += parseFloat(amount);
            // values['balance'] = values['income'] - values['expense'];
            updateBalance();
        },
        subtractValues: function(id, allObj) {
            if (/expense/.test(id)) {
                values["expense"] -= allObj[id].amount;
            } else {
                values["income"] -= allObj[id].amount;
            }
            updateBalance();
        },
        getIncome: function () {
            return values['income'];
        },
        getExpense: function () {
            return values['expense'];
        },
        getBalance: function () {
            return values['balance'];
        }


    }

})();

//Module for handling user interactions
const budgetModule = (function (uiMod, opsMod) {

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
        $('.uinput-radio-item').on('focus', function () {
            //Display correct select box
            $(`.uinput-${$(this).val()}-select`).toggleClass('uinput-invisible');
            //Hide select box
            $(`.uinput-${$('.uinput-radio-item:checked').val()}-select`).toggleClass('uinput-invisible');
        });

        //Clicking Add Entry button
        $('#submit').on('click', function (event) {
            event.preventDefault();

            //Store transaction type from checkbox
            const transactionType = $('.uinput-radio-item:checked').val();

            //Store date
            const date = $('#date').val();

            //Store category from drop down
            const category = $(`.uinput-${transactionType}-select`).val();

            //store descriptiom
            const description = $('#description').val();

            //Check if amount is a number

            //Store amount
            const amount = uiMod.isValidAmount($('#amount').val());


            if (amount && date) {
                //Update Income or Expense and Balance
                opsMod.addValues(transactionType, amount);
    
                //Display Income/Expense and Balance
                uiMod.displayValues(transactionType, opsMod.getExpense(), opsMod.getIncome(), opsMod.getBalance());
    
    
    
                //display Entry in all table and either Expense or Income
                uiMod.displayEntry(date, transactionType, category, description, amount);
    
    
                $('#description').val('');
                $('#amount').val('');
            } else {
                //if amount is invalid, display message
                //if date is empty. display message
            }
        });
        //Clicking x to remove entry in all-tab
        $('#all-tab,#income-tab,#expense-tab').on('click', 'i', function() {
        
            //subtract either Income or Expense
            opsMod.subtractValues(this.id,uiMod.getAllObj());
            
            //Remove Entry from Tables
            uiMod.removeFromTables(this.id);

            //display updated Income, Expense or Balance
            uiMod.displayValues(this.id, opsMod.getExpense(), opsMod.getIncome(), opsMod.getBalance());
        });


    }

    return {
        init: function () {
            setupEventHandlers();
        }
    }
})(uiModule, opsModule);

$(function () {
    budgetModule.init();
});