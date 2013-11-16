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

$('#save-mps').click(function () {
    var mps = _.map(selectedMPs.children(), function (mp) {
        return parseInt(mp.value);
    });

    $.ajax({
        url: '/user/' + $('#email').val(),
        type: 'PUT',
        data: {
            'mps': mps
        }
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
        if (userMPs.indexOf(this.person_id) !== -1) {
            selectedMPs.append(ele);
        } else {
            availableMPs.append(ele);
        }
    });
}
