//Module for the User interface
const uiModule = (function () {

    const totalObjs = {
        allObj: {},
        expenseObj: {},
        incomeObj: {}
    };

    //ID assigned to each input entry
    let id = 0;

    //Category parameters
    const expenseCategory = [
        'Food',
        'Clothing',
        'Bill',
        'Entertainment',
        'Fuel',
        'Groceries',
        'Health',
        'House',
        'Rent',
        'Travel',
        'Education',
        'Misc'
    ];

    const incomeCategory = [
        'Salary',
        'Investments',
        'Other Income'
    ];

    //If negative return -$num else $num
    function negativeCheck(num) {
        return num < 0 ? `-$${Math.abs(num).toFixed(2)}` : `$${num.toFixed(2)}`;
    }

    //Sorting elements in an object
    function arraySort(valObj, sortParam, reverse) {
        const sortedArray = [];
        for (let key in valObj) {
            sortedArray.push(valObj[key]);
        }

        if (!reverse) {
            //return array in descending order
            return sortedArray.sort((a, b) => {
                //if the sortParameter is not date
                if (sortParam !== 'date') {
                    return b[sortParam] > a[sortParam];
                }
                return new Date(b[sortParam]) > new Date(a[sortParam]);
            });
        } else {

            //return array in ascending order
            return sortedArray.sort((a, b) => {
                //if the sortParameter is not date
                if (sortParam !== 'date') {
                    return b[sortParam] < a[sortParam];
                }
                //Convert to Date type first
                return new Date(b[sortParam]) < new Date(a[sortParam]);
            });
        }

    }
    return {
        //Function to display user input
        displayEntry: function (date, transaction, category, description, amount) {

            const htmlID = `${transaction.toLowerCase()}-${id}`;

            totalObjs["allObj"][htmlID] = {
                id: htmlID,
                date: date,
                transaction: transaction,
                category: category,
                description: description,
                amount: parseFloat(amount),
                stringAmount: `$${parseFloat(amount).toFixed(2)}`
            };

            totalObjs[`${transaction.toLowerCase()}Obj`][htmlID] = {
                id: htmlID,
                date: date,
                category: category,
                description: description,
                amount: parseFloat(amount),
                stringAmount: `$${parseFloat(amount).toFixed(2)}`
            }

            //HTML for row in all table
            const allHtml = `<ul class="output-disp-row output-disp-row-entry" id="${htmlID}-list">
                            <li class="output-disp-col output-disp-col-2">
                                <p class="output-disp-entry">${date}</p>
                            </li>

                            <li class="output-disp-col output-disp-col-3">
                                <p class="output-disp-entry-mini">${transaction}</p>
                                <p class="output-disp-entry">${category}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-5">
                                <p class="output-disp-entry">${description}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-4">
                                <p class="output-disp-entry">$${parseFloat(amount).toFixed(2)}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-1">
                                <p class="output-disp-entry"><i class="fas fa-times-circle" id="${htmlID}"></i></p>
                            </li>
                        </ul>`;

            //HTML for row in either Expense or Income table
            const specHtml = `<ul class="output-disp-row output-disp-row-entry" id="${htmlID}-list">
                            <li class="output-disp-col output-disp-col-2">
                                <p class="output-disp-entry">${date}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-3">
                                <p class="output-disp-entry">${category}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-5">
                                <p class="output-disp-entry">${description}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-4">
                                <p class="output-disp-entry">$${parseFloat(amount).toFixed(2)}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-1">
                                <p class="output-disp-entry"><i class="fas fa-times-circle" id="${htmlID}"></i></p>
                            </li>
                        </ul>`;

            $('#all-tab').append(allHtml);
            $(`#${transaction.toLowerCase()}-tab`).append(specHtml);
            id++; //increment ID
        },
        //Function to display Expence/Income and Balance on the Dom
        displayValues: function (transaction, expense, income, balance) {

            if (/expense/i.test(transaction)) {
                $('#expense-total').text(negativeCheck(expense));
            } else {
                $('#income-total').text(negativeCheck(income));
            }

            $('#balance-total').text(negativeCheck(balance));

        },
        //Check whether enter amount is a valid dollar amount
        isValidAmount: function (amount) {
            amount = amount.replace(/^\$/, "");
            //If amount coutains 3 are more decimal places
            if (/\.[0-9]{3,}/.test(amount)) {
                return false;
            }
            return $.isNumeric(amount) ? amount : false;
        },
        //Remove entry from the all table and either the income or expense table
        removeFromTables: function (id) {
            $(`#all-tab #${id}-list`).remove();
            delete totalObjs["allObj"][id];
            if (/expense/.test(id)) {
                $(`#expense-tab #${id}-list`).remove();
                delete totalObjs["expenseObj"][id];
            } else {
                $(`#income-tab #${id}-list`).remove();
                delete totalObjs["incomeObj"][id];
            }
        },

        //Function splits the id tag on '-' and sends to the arraySort function e.g. all-tab => all tab. It also passes along boolean to determine which direction to sort
        sortTable: function (id, reverse) {
            return arraySort(totalObjs[`${id.split('-')[0]}Obj`], id.split('-')[1], reverse);
        },
        displaySortedTable: function (id, sortedArray) {
            const tabPrefix = id.split('-')[0];
            let html = "";

            if (tabPrefix === 'all') {
                //Creating HTML for All table from sorted Array
                for (let obj of sortedArray) {
                    html += `<ul class="output-disp-row output-disp-row-entry" id="${obj['id']}-list">
                            <li class="output-disp-col output-disp-col-2">
                                <p class="output-disp-entry">${obj['date']}</p>
                            </li>
                            
                            <li class="output-disp-col output-disp-col-3">
                                <p class="output-disp-entry-mini">${obj['transaction']}</p>
                                <p class="output-disp-entry">${obj['category']}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-5">
                                <p class="output-disp-entry">${obj['description']}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-4">
                                <p class="output-disp-entry">${obj['stringAmount']}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-1">
                                <p class="output-disp-entry"><i class="fas fa-times-circle" id="${obj['id']}"></i></p>
                            </li>
                        </ul>`;
                }
            } else {
                //Creating HTML for Income/Expense table from sorted Array
                for (let obj of sortedArray) {
                    html += `<ul class="output-disp-row output-disp-row-entry" id="${obj['id']}-list">
                            <li class="output-disp-col output-disp-col-2">
                                <p class="output-disp-entry">${obj['date']}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-3">
                                <p class="output-disp-entry">${obj['category']}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-5">
                                <p class="output-disp-entry">${obj['description']}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-4">
                                <p class="output-disp-entry">${obj['stringAmount']}</p>
                            </li>
                            <li class="output-disp-col output-disp-col-1">
                                <p class="output-disp-entry"><i class="fas fa-times-circle" id="${obj['id']}"></i></p>
                            </li>
                        </ul>`;
                }
            }

            $(`#${tabPrefix}-tab`).html(html);

        },
        getAllObj: function () {
            return totalObjs["allObj"];
        },
        getIncomeObj: function () {
            return totalObjs["incomeObj"];
        },
        getExpenseObj: function () {
            return totalObjs["expenseObj"];
        },
        //Generate drop down lists for Income and Expense categories
        generateDropDownLists: function () {
            expenseCategory.forEach((elem) => {
                $('#uinput-Expense-select').append(`
            <option value="${elem}">
                ${elem}
            </option>`);
            });

            incomeCategory.forEach((elem) => {
                $('#uinput-Income-select').append(`
            <option value="${elem}">
                ${elem}
            </option>`);
            });
        }
    }
})();

//Module for handling calculations
const opsModule = (function () {

    const values = {
        income: 0,
        expense: 0,
        balance: 0
    }

    const updateBalance = function () {
        values['balance'] = values['income'] - values['expense'];
    };

    //function rounds a number to a specified number of "Decimals" places
    const round = function (value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
    }


    return {
        //Update Income/Expenses or Balance after input
        addValues: function (transaction, amount) {
            values[transaction.toLowerCase()] = parseFloat(round(values[transaction.toLowerCase()] + parseFloat(amount), 2));

            updateBalance();
        },
        //Subtract Expense or Income value from the data object
        subtractValues: function (id, allObj) {
            if (/expense/.test(id)) {
                values["expense"] = parseFloat(round(values["expense"] - allObj[id].amount, 2));
            } else {
                values["income"] = parseFloat(round(values["income"] - allObj[id].amount, 2));
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

        //Error input handling
        $('#amount').on('click', function () {
            $('.uinput-amount-error').removeClass('error-appear');
            $('.uinput-amount').removeClass('uinput-remove-radius');
        });

        $('#date').on('click', function () {
            $('.uinput-date-error').removeClass('error-appear');
            $('.uinput-date').removeClass('uinput-remove-radius');
        });

        $('.output-disp-btn').on('click', function () {
            if (!$(this).hasClass('output-disp-btn-selected')) {
                $('.output-disp-btn').removeClass('output-disp-btn-selected');
                $(this).addClass('output-disp-btn-selected');
            }

        });

        //Click All Button
        $('#all-btn').on('click', function () {
            if (!$('#all-tab-container').hasClass("output-disp-top")) {
                $('#all-tab-container').addClass("output-disp-top");
                $('#income-tab-container').removeClass("output-disp-top");
                $('#expense-tab-container').removeClass("output-disp-top");
            }
        });

        //Click Expense Button
        $('#expense-btn').on('click', function () {
            if (!$('#expense-tab-container').hasClass("output-disp-top")) {
                $('#expense-tab-container').addClass("output-disp-top");
                $('#all-tab-container').removeClass("output-disp-top");
                $('#income-tab-container').removeClass("output-disp-top");
            }
        });
        //Click Income Button
        $('#income-btn').on('click', function () {
            if (!$('#income-tab-container').hasClass("output-disp-top")) {
                $('#income-tab-container').addClass("output-disp-top");
                $('#expense-tab-container').removeClass("output-disp-top");
                $('#all-tab-container').removeClass("output-disp-top");
            }
        });

        //Listener for transaction type checkbox
        $('.uinput-radio-button, .uinput-radio-label').on('focus', function () {
            //Display correct select box and label
            $(`#uinput-${$(this).val()}-label`).toggleClass('uinput-invisible');
            $(`#uinput-${$(this).val()}-select`).toggleClass('uinput-invisible');

            //Hide select box and label
            $(`#uinput-${$('.uinput-radio-button:checked').val()}-label`).toggleClass('uinput-invisible');
            $(`#uinput-${$('.uinput-radio-button:checked').val()}-select`).toggleClass('uinput-invisible');
        });

        //Clicking Submit button
        $('#submit').on('click', function (event) {
            event.preventDefault();

            //Store transaction type from checkbox
            const transactionType = $('.uinput-radio-button:checked').val();

            //Store date
            const date = $('#date').val();

            //If date input is empty, display error
            if (!date) {
                //Display error;
                $('.uinput-date-error').addClass('error-appear');

                //remove bottom radius of input element
                $('.uinput-date').addClass('uinput-remove-radius');
            }

            //Store category from drop down
            const category = $(`#uinput-${transactionType}-select`).val();

            //store descriptiom
            const description = $('#description').val();

            //Check if amount is a valid input. Store input if valid, else return false
            const amount = uiMod.isValidAmount($('#amount').val());

            //if amount = false, display error
            if (!amount) {
                //Display Error
                $('.uinput-amount-error').addClass('error-appear');

                //remove bottom radius of input element
                $('.uinput-amount').addClass('uinput-remove-radius');
            }


            if (amount && date) {
                //Update Income or Expense and Balance
                opsMod.addValues(transactionType, amount);

                //Display Income/Expense and Balance
                uiMod.displayValues(transactionType, opsMod.getExpense(), opsMod.getIncome(), opsMod.getBalance());

                //display Entry in all table and either Expense or Income
                uiMod.displayEntry(date, transactionType, category, description, amount);

                $('#description').val('');
                $('#amount').val('');
            }
        });

        //Clicking x to remove entry in all-tab
        $('#all-tab,#income-tab,#expense-tab').on('click', 'i', function () {

            //subtract either Income or Expense
            opsMod.subtractValues(this.id, uiMod.getAllObj());

            //Remove Entry from Tables
            uiMod.removeFromTables(this.id);

            //display updated Income, Expense or Balance
            uiMod.displayValues(this.id, opsMod.getExpense(), opsMod.getIncome(), opsMod.getBalance());
        });

        const headerIDs = `#all-date,
                           #income-date,
                           #expense-date,
                           #all-transaction,
                           #all-category,
                           #all-amount,
                           #income-category,
                           #income-amount,
                           #expense-category,
                           #expense-amount`;

        //Clicking on headers
        $(headerIDs).on('click', function () {
            let reversed = false;
            if ($(this).hasClass('reversed')) {
                reversed = true;
            }
            //toggle reverse class on element, so that a different sort direction could be done
            $(this).toggleClass('reversed');

            //Determine which table to sort, sort associated object and return a sorted array
            const sortedArray = uiMod.sortTable(this.id, reversed);

            //redraw table with sorted values
            uiMod.displaySortedTable(this.id, sortedArray);
        });
    }

    return {
        init: function () {
            //Setup event handlers
            setupEventHandlers();
            //Generate Category drop down menus
            uiModule.generateDropDownLists();
        }
    }
})(uiModule, opsModule);

$(function () {
    budgetModule.init();
});