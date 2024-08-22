
// Scripts to initialize at startup
$(document).ready(function() {
    get_full_budget()
    localStorage.setItem('color-theme', 'light');
})

function saveBudget(){
    setTimeout(
    function () {
        $('#isSaved').text('( Saving... )')
            update_budget()
        setTimeout(
        function() {
            $('#isSaved').text('( Saved )')
        },
        1000
        );
    }, 5000);

}

// marked paid
$('#paid-items').on('click', function() {
    $('#expenses li').each(function (i) {
        if($(this).find('#selected-checkbox').is(':checked')){
            // uncheck checkbox
            $(this).find('#selected-checkbox').prop('checked', false)

            if($(this).attr('data-paid') === 'False'){
                $(this).attr('data-paid', 'True')
                $(this).find('#exp-content').wrap("<strike>")
                $(this).find(':input').each(function() {
                    $(this).css('text-decoration', 'line-through')
                })
                $(this).css('opacity', '0.5')
            }
            else {
                $(this).attr('data-paid', 'False')
                $(this).find('#exp-content').unwrap()
                $(this).find(':input').each(function() {
                    $(this).css('text-decoration', 'none')
                })
                $(this).css('opacity', '1')
            }
        }
    })

    if($("#select-all-checkbox").is(":checked")){
        $("#select-all-checkbox").prop('checked', false)
    }

    saveBudget()
})

// deleting items from budget
$('#delete-items').on('click', function() {

    $('#expenses li').each(function (i) {
        if($(this).find('#selected-checkbox').is(':checked')){
            $(this).remove()
        }
    })
    if($("#select-all-checkbox").is(":checked")){
        $("#select-all-checkbox").prop('checked', false)
    }

    saveBudget()
})

function get_full_budget() {
    fetch("/get_full_budget", {
            method: "GET"
        })
            .then(response => {
                return response.text();
            })
            .then(html => {
                $('#expenses').hide().css('opacity',0.0).append(html).slideDown('slow').animate({opacity: 1.0})
                calcCumSum()
                is_paid()
                applyTypeColor()
                initFlowbite()
                $( "#expenses" ).sortable( "refresh" );
            })
}

function add_budget(pos=-1){
    var url = "/add_to_budget/" + pos
    fetch(url, {
        method: "GET"
    })
        .then(response => {
            return response.text();
        })
        .then(html => {
            console.log($('#expenses li').length)
            if ((pos == -1) || ($('#expenses li').length == 0)) {
                var newItem = $(html)
                $('#expenses').append(newItem)
                newItem.addClass("pulse")
                calcCumSum()
                initFlowbite()
            } else {
                console.log("Adding item at: " + String(pos))
                var newItem = $(html)
                if(pos == $('#expenses li').length){
                    $('#expenses').append(newItem)
                        newItem.addClass("pulse")
                        calcCumSum()
                        initFlowbite()
                } else {
                    $('#expenses li').eq(parseInt(pos)).before(newItem)
                    newItem.addClass("pulse")
                    calcCumSum()
                    applyTypeColor()
                    initFlowbite()
                }
            }
        })
}

function is_paid() {
    $('#expenses li').each(function (i) {
        if ($(this).attr('data-paid') === 'True') {
            $(this).find('#exp-content').wrap("<strike>")
            $(this).find(':input').each(function() {
                $(this).css('text-decoration', 'line-through')
            })
            $(this).css('opacity', '0.5')
        }
    })
}

function update_budget() {
    var item_names = new Array()
    var item_amounts = new Array()
    var item_categories = new Array()
    var item_dates = new Array()
    var item_recurrings = new Array()
    var item_paid = new Array()
    var item_id = new Array()

    $('#expenses li #exp-name').each(function (i) {
        var text = $(this).val();
        item_names.push(text);
    });

    $('#expenses li #exp-amount').each(function (i) {
        var amount = $(this).data('amount')
        item_amounts.push(amount);
    })

    $('#expenses li #exp-category').each(function (i) {
        var category = parseInt($(this).find(':selected').val());
        item_categories.push(category)
    })

    $("#expenses li input[id*='exp-date']").each(function (i) {
        var date = $(this).val();
        item_dates.push(date)
        var recurring = parseInt($(this).data('recurring'));
        item_recurrings.push(recurring);
    })

    $('#expenses li').each(function (i) {
        var paid = $(this).data('paid')
        item_paid.push(paid)
    })

    $('#expenses li').each(function (i) {
        var id = $(this).data('itemid')
        item_id.push(id)
    })

    console.log("Budget Saved")

    $.ajax({
        type: 'POST',
        url: '/update_item',
        data: {
            item_ids : item_id,
            item_names : item_names,
            item_amounts : item_amounts,
            item_categories : item_categories,
            item_dates : item_dates,
            item_recurrings : item_recurrings,
            item_paid : item_paid
        },
        success: function(data) {
            if (data.result == "complete"){
            }
        }
    });
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
    var item_id = new Array()

    $('#expenses li #exp-name').each(function (i) {
        var text = $(this).val();
        item_names.push(text);
    });

    $('#expenses li #exp-amount').each(function (i) {
        var amount = $(this).data('amount')
        item_amounts.push(amount);
    })

    $('#expenses li #exp-category').each(function (i) {
        var category = parseInt($(this).find(':selected').val());
        item_categories.push(category)
    })

    $("#expenses li input[id*='exp-date']").each(function (i) {
        var date = $(this).val();
        item_dates.push(date)
        var recurring = parseInt($(this).data('recurring'));
        item_recurrings.push(recurring);
    })

    $('#expenses li').each(function (i) {
        var paid = $(this).data('paid')
        item_paid.push(paid)
    })

    $('#expenses li').each(function (i) {
        var id = $(this).data('itemid')
        item_id.push(id)
    })

    item_names.push($("#item-name").val())
    item_amounts.push('-' + ($("#item-amount").val()))
    item_categories.push($("#item-category").find(':selected').val())
    item_dates.push($("#item-date").val())
    item_recurrings.push($("#item-recurring").find(':selected').val())
    item_paid.push("False")

    $("#item-name").val('')
    $("#item-amount").val('')
    $("#item-category").prop('selectedIndex', 0)

    console.log(item_id)
    console.log(item_recurrings)
    $.ajax({
        type: 'POST',
        url: '/update_item',
        data: {
            item_ids : item_id,
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
            } else if (data.result == "refresh") {
                $.each(data.poslist, function(index, value) {
                    var wait = index * 250 + 250;
                    setTimeout(function() {
                        add_budget(value)
                    }, wait)
                })

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
    var item_id = new Array()

    $('#expenses li #exp-name').each(function (i) {
        var text = $(this).val();
        item_names.push(text);
    });

    $('#expenses li #exp-amount').each(function (i) {
        var amount = $(this).data('amount')
        item_amounts.push(amount);
    })

    $('#expenses li #exp-category').each(function (i) {
        var category = parseInt($(this).find(':selected').val());
        item_categories.push(category)
    })

    $("#expenses li input[id*='exp-date']").each(function (i) {
        var date = $(this).val();
        item_dates.push(date)
        var recurring = parseInt($(this).data('recurring'));
        item_recurrings.push(recurring);
    })

    $('#expenses li').each(function (i) {
        var paid = $(this).data('paid')
        item_paid.push(paid)
    })

    $('#expenses li').each(function (i) {
        var id = $(this).data('itemid')
        item_id.push(id)
    })

    item_names.push($("#item-name").val())
    item_amounts.push($("#item-amount").val())
    item_categories.push($("#item-category").find(':selected').val())
    item_dates.push($("#item-date").val())
    item_recurrings.push($("#item-recurring").find(':selected').val())
    item_paid.push("False")

    $("#item-name").val('')
    $("#item-amount").val('')
    $("#item-category").prop('selectedIndex', 0)

    $.ajax({
        type: 'POST',
        url: '/update_item',
        data: {
            item_ids : item_id,
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
            } else if (data.result == "refresh") {
                $.each(data.poslist, function(index, value) {
                    var wait = index * 250 + 250;
                    setTimeout(function() {
                        add_budget(value)
                    }, wait)
                })

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

function applyTypeColor() {
    $('#expenses li').each(function () {
        var amount = parseFloat($('#exp-amount', this).data('amount'));

        if(amount < 0) {
            $(this).addClass('text-[#9d0208] dark:text-[#e5383b]')
        } else {
            $(this).addClass('text-[#2a850e] dark:text-[#60d394]')
        }
    })
}

// sortable
$(document).ready(function() {
    $( "#expenses" ).sortable({
        stop: function (event, ui) {
            calcCumSum()
            saveBudget()
        }
    });
} );


// updated data value in budget amount
function updateAmount(object) {
    selector = document.getElementsByName(object)
    console.log($(selector).data('amount'))
    if($(selector).data('amount') < 0){
        $(selector).data('amount', parseFloat($(selector).val()*-1))
    } else {
        $(selector).data('amount', parseFloat($(selector).val()))
    }
    calcCumSum()
    console.log($(selector).data('amount'))
}