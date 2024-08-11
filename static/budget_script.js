
// Scripts to initialize at startup
$(document).ready(function() {
    calcCumSum()
})

// deleting items from budget
$('#delete-items').on('click', function() {
    var item_names = new Array()
    var item_amounts = new Array()

    $('#expenses li').each(function (i) {
        if(($(this).find('#selected-checkbox').is(':checked'))){
            $(this).remove()
        }

        if($("#select-all-checkbox").is(":checked")){
            $("#select-all-checkbox").prop('checked', false)
        }
    })

    console.log(item_names)
    console.log(item_amounts)

    $.ajax({
        type: 'POST',
        url: '/update_item',
        data: {
            item_names : item_names,
            item_amounts : item_amounts
        },
        success: function(data) {
            if (data.result == "complete"){

            }
        }

    });
})


function add_budget(){
    fetch("/add_to_budget", {
        method: "GET"
    })
        .then(response => {
            return response.text();
        })
        .then(html => {
            $('#expenses').append(html)
            calcCumSum()
            initFlowbite()
        })
}

$('#select-all-checkbox').click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
})

$('#add-expense').on('click', function() {
    var item_names = new Array()
    var item_amounts = new Array()
    var item_categories = new Array()
    var item_dates = new Array()
    var item_recurrings = new Array()
    var item_paid = new Array()

    $('#expenses li #exp-name').each(function (i) {
        var text = $(this).text();
        item_names.push(text);
    });

    $('#expenses li #exp-amount').each(function (i) {
        var amount = $(this).data('amount')
        item_amounts.push(amount);
    })

    $('#expenses li #exp-category').each(function (i) {
        var category = parseInt($(this).data('category'));
        item_categories.push(category)
    })

    $('#expenses li #exp-date').each(function (i) {
        var date = $(this).text();
        item_dates.push(date)
    })

    $('#expenses li #exp-date').each(function (i) {
        var recurring = parseInt($(this).data('recurring'));
        item_recurrings.push(recurring);
    })

    $('#expenses li').each(function (i) {
        var paid = $(this).data('paid')
        item_paid.push(paid)
    })

    item_names.push($("#item-name").val())
    item_amounts.push('-' + ($("#item-amount").val()))
    item_categories.push($("#item-category").find(':selected').val())
    item_dates.push($("#item-date").val())
    item_recurrings.push($("#item-recurring").find(':selected').val())
    item_paid.push("False")

    console.log(item_amounts)
    console.log(item_categories)
    $.ajax({
        type: 'POST',
        url: '/update_item',
        data: {
            item_names : item_names,
            item_amounts : item_amounts,
            item_categories : item_categories,
            item_dates : item_dates,
            item_recurrings : item_recurrings,
            item_paid : item_paid
        },
        success: function(data) {
            if (data.result == "complete"){
                add_budget()
            }
        }
    });
});

$('#add-income').on('click', function() {
    var item_names = new Array()
    var item_amounts = new Array()
    var item_categories = new Array()
    var item_dates = new Array()
    var item_recurrings = new Array()
    var item_paid = new Array()

    $('#expenses li #exp-name').each(function (i) {
        var text = $(this).text();
        item_names.push(text);
    });

    $('#expenses li #exp-amount').each(function (i) {
        var amount = $(this).data('amount')
        item_amounts.push(amount);
    })

    $('#expenses li #exp-category').each(function (i) {
        var category = parseInt($(this).data('category'));
        item_categories.push(category)
    })

    $('#expenses li #exp-date').each(function (i) {
        var date = $(this).text();
        item_dates.push(date)
    })

    $('#expenses li #exp-date').each(function (i) {
        var recurring = parseInt($(this).data('recurring'));
        item_recurrings.push(recurring);
    })

    $('#expenses li').each(function (i) {
        var paid = $(this).data('paid')
        item_paid.push(paid)
    })

    item_names.push($("#item-name").val())
    item_amounts.push($("#item-amount").val())
    item_categories.push($("#item-category").find(':selected').val())
    item_dates.push($("#item-date").val())
    item_recurrings.push($("#item-recurring").find(':selected').val())
    item_paid.push("False")

    $.ajax({
        type: 'POST',
        url: '/update_item',
        data: {
            item_names : item_names,
            item_amounts : item_amounts,
            item_categories : item_categories,
            item_dates : item_dates,
            item_recurrings : item_recurrings,
            item_paid : item_paid
        },
        success: function(data) {
            if (data.result == "complete"){
                add_budget()
            }
        }
    });
});


function calcCumSum(){
    var prevAmt = 0.00
    $('#expenses li').each(function (){
        var amount = parseFloat($('#exp-amount', this).data('amount'));
        prevAmt += amount

        if(prevAmt < 0) {
            $('#exp-cumsum', this).removeClass()
            $('#exp-cumsum', this).addClass("absolute bottom-0 right-10 bg-red-100 text-red-800 text-xxs font-light px-1 py-0.25 rounded dark:bg-red-900 dark:text-red-300")
            $('#exp-cumsum', this).text("-$ " + (prevAmt * -1).toFixed(2))
        }
        else {
            $('#exp-cumsum', this).removeClass()
            $('#exp-cumsum', this).addClass("absolute bottom-0 right-10 bg-green-100 text-green-800 text-xxs font-light px-1 py-0.25 rounded dark:bg-green-900 dark:text-green-300")
            $('#exp-cumsum', this).text("$ " + prevAmt.toFixed(2))
        }
    })
}

$(document).ready(function() {
    $( "#expenses" ).sortable({
        stop: function (event, ui) {
            var item_names = new Array()
            var item_amounts = new Array()
            var item_categories = new Array()
            var item_dates = new Array()
            var item_recurrings = new Array()
            var item_paid = new Array()

            $('#expenses li #exp-name').each(function (i) {
                var text = $(this).text();
                item_names.push(text);
            });

            $('#expenses li #exp-amount').each(function (i) {
                var amount = $(this).data('amount')
                item_amounts.push(amount);
            })

            $('#expenses li #exp-category').each(function (i) {
                var category = parseInt($(this).data('category'));
                item_categories.push(category)
            })

            $('#expenses li #exp-date').each(function (i) {
                var date = $(this).text();
                item_dates.push(date)
            })

            $('#expenses li #exp-date').each(function (i) {
                var recurring = parseInt($(this).data('recurring'));
                item_recurrings.push(recurring);
            })

            $('#expenses li').each(function (i) {
                var paid = $(this).data('paid')
                item_paid.push(paid)
            })

            calcCumSum()

            console.log(expenses)
            $.ajax({
                type: 'POST',
                url: '/receive_expense_list',
                data: {
                    item_names : item_names,
                    item_amounts : item_amounts,
                    item_categories : item_categories,
                    item_dates : item_dates,
                    item_recurrings : item_recurrings,
                    item_paid : item_paid
                },

            });
        }
    });
} );