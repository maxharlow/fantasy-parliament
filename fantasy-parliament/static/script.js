twfy = new TWFYAPI.TWFYAPI('FFc3vfGRyyBgCnVqegDY3Ujh');

var availableMPs = $('#available-mps');
var selectedMPs = $('#selected-mps');

$('#add-mps').click(function () {
    availableMPs.children(':selected').each(function () {
        selectedMPs.append(this);
    });
});

$('#remove-mps').click(function () {
    selectedMPs.children(':selected').each(function () {
        availableMPs.append(this);
    });
});

$('#available-mps, #selected-mps').change(function () {
    var option = $(this).children(':selected').first();
    var mp = option.data('mp');

    $('.mp-details').each(function () {
        $(this).html(mp[$(this).data('detail')]);
    });

    twfy.query('getPerson', {'callback': 'populate_photo', 'id': mp['person_id']});
});

$('#save-mps').click(function () {
    var mps = _.map(selectedMPs.children(), function (mp) {
        return parseInt(mp.value);
    });
    var email = $('#email').val();

    $.ajax({
        url: '/user/' + email,
        type: 'PUT',
        data: JSON.stringify({
            'email': email,
            'mps': mps
        })
    });
});

$('#email').change(function () {
    window.localStorage['email'] = this.value;
});

$('#email').val(window.localStorage['email']);

var userMPs = [];

/*$.getJSON('/user/' + $('#email').val())
    .then(function () {
        var mps = [11323];

    });*/

twfy.query('getMPs', {'callback': 'populate_mps'});

function populate_mps(mps) {
    $.each(mps, function () {
        var ele = $('<option value="' + this.person_id + '" data-party="' + this.party + '">' + this.name + ' [' + this.party + ']</option>');
        ele.data('mp', this);

        if (userMPs.indexOf(this.person_id) !== -1) {
            selectedMPs.append(ele);
        } else {
            availableMPs.append(ele);
        }
    });
}

function populate_photo(person) {
    $('.mp-photo').attr('src', 'http://www.theyworkforyou.com' + person[0].image);
}
