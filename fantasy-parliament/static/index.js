twfy = new TWFYAPI.TWFYAPI('FFc3vfGRyyBgCnVqegDY3Ujh');

const budget = 250000;
const maxCabinet = 12;
var availableMPs = $('#available-mps');
var selectedMPs = $('#selected-mps');

function cabinetExpenses() {
    var expenses =_.map(selectedMPs.children(), function (mp) {
        return $(mp).data('expenses')
    });

    return expenses.reduce(function (a,b) { return a + (b || 0) }, 0);
}

function cabinetSize() {
        return selectedMPs.children().length;
}

function updateMPCount() {
        $('#placesleft').html(maxCabinet - cabinetSize());
        $('#budgetleft').html(budget - cabinetExpenses());
};

$('#save-mps').click(function () {
    var member_ids = _.map(selectedMPs.children(), function (mp) {
        return parseInt($(mp).data('member_id'));
    });

    var email = $('#email').val();

    if (cabinetSize() > maxCabinet)
        alert('Reduce the size of your cabinet!');
    else if (cabinetExpenses() > budget)
        alert('Reduce your budget!')
    else {
        $.ajax({
            url: '/user/' + email,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                'email': email,
                'mps': member_ids
            })
        });
    }
});

$('#email').change(function () {
    window.localStorage['email'] = this.value;
});

$('#email').val(window.localStorage['email']);

$('.filter-name').keyup(function () {
    if (this.value) {
        $('.mp').hide();
        $('.mp[data-name^="' + this.value + '"]').show();
    } else {
        $('.mp').show();
    }
});

var mp_template = $('#mp_template').html();
var filter_template = $('#filter_template').html();

function populate_mps(expenses, userMPs) {
    var parties = [];

    selectedMPs.empty();
    availableMPs.empty();

    userMPs = userMPs || [];

    _.each(mps, function (mp) {
        mp.expenses = getExpenses(expenses, mp.person_id);

        // someone's image is undefined
        mp.image = mp.image || '';
        var ele = $(_.template(mp_template, mp));

        if (parties.indexOf(mp.party) === -1) {
            parties.push(mp.party);
        }

        if (userMPs.indexOf(parseInt(mp.member_id)) !== -1) {
            selectedMPs.append(ele);
        } else {
            availableMPs.append(ele);
        }
    });

    parties.sort();

    _.each(parties, function (party) {
        $('.filters').append(_.template(filter_template, {'party': party}));
    });

    $('.filter-party').change(function () {
        $('.mp[data-party="' + this.value + '"]').toggle(this.checked);
    });


    updateMPCount();
    $('#loader').fadeOut();
}

function getExpenses(expenses, mpPersonId) {
    var found = _.find(expenses, function (mp) {
        return mp.person_id == mpPersonId;
    });
    if (found === undefined) return 8000;
    else return found.expenses;
}

function init() {
    var email = $('#email').val();
    if (!email) {
        $.getJSON('/expenses', function (expenses) {
            populate_mps(expenses);
        });
    } else {
        $.when($.getJSON('/user/' + email), $.getJSON('/expenses'))
            .done(function (expenses, mpData) {
                populate_mps(expenses[0], mpData[0].mps);
            });
    }
}

init();

$('#selected-mps, #available-mps').on('dragstart', '.mp', function (e) {
    var data = $(this).clone().wrap('<div></div>').parent().html();
    var that = this;
    setTimeout(function () {
        $(that).addClass('dragging target');
    }, 0);
});

$('#selected-mps, #available-mps').on('dragend', '.mp', function () {
    $(this).removeClass('dragging target');
});

$('#selected-mps, #available-mps').on('dragover', function (e) {
    e.preventDefault();
});

$('#selected-mps, #available-mps').on('drop', function (e) {
    if ($(this).children('.target').length === 0) {
        $(this).append($('.target'));
    }
    updateMPCount();
    e.preventDefault();
});
