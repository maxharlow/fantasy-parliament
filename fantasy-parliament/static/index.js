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
    twfy.query('getPerson', {'callback': 'populate_details', 'id': option.val()});
});

$('#save-mps').click(function () {
    var mps = _.map(selectedMPs.children(), function (mp) {
        return parseInt(mp.value);
    });
    var email = $('#email').val();

    $.ajax({
        url: '/user/' + email,
        type: 'PUT',
        contentType: 'application/json',
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

(function () {
    var email = $('#email').val();
    if (!email) {
        twfy.query('getMPs', {'callback': 'populate_mps'});
    } else {
        $.getJSON('/user/' + email)
            .then(function (data) {
                userMPs = data.mps || [];
                twfy.query('getMPs', {'callback': 'populate_mps'});
            });
    }
})();

function populate_mps(mps) {
	var sortedMPs = _.sortBy(mps, function(each) {
		// drop the first name
		return each.name.replace(/^\w+ /, '');
	});

    $.each(sortedMPs, function () {
        var ele = $('<option value="' + this.person_id + '" data-party="' + this.party + '">' + this.name + ' [' + this.party + ']</option>');

        if (userMPs.indexOf(parseInt(this.person_id)) !== -1) {
            selectedMPs.append(ele);
        } else {
            availableMPs.append(ele);
        }
    });
}

function populate_details(person) {
    person = person[0]

    $('.mp-photo').attr('src', 'http://www.theyworkforyou.com' + person.image);

    $('.mp-details').each(function () {
        $(this).html(person[$(this).data('detail')]);
    });

    $('#details').fadeIn();
}
