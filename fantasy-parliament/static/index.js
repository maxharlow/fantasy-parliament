twfy = new TWFYAPI.TWFYAPI('FFc3vfGRyyBgCnVqegDY3Ujh');

const budget = 250000;
const maxCabinet = 12;
var availableMPs = $('#available-mps');
var selectedMPs = $('#selected-mps');

function cabinetExpenses() {
	return _.map(selectedMPs.children(), function () {
			return $(this).data('expenses') })
		.reduce(function (a,b) { return a + (b || 0) }, 0);
}

function cabinetSize() {
	return selectedMPs.children().length;
}

function updateMPCount() {
	$('#placesleft').html(maxCabinet - cabinetSize());
	$('#budgetleft').html(budget - cabinetExpenses());
};

$('#add-mps').click(function () {
    availableMPs.children(':selected').each(function () {
        selectedMPs.append(this);
        updateMPCount();
    });
});

$('#remove-mps').click(function () {
    selectedMPs.children(':selected').each(function () {
        availableMPs.append(this);
        updateMPCount();
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
				'mps': mps
			})
		});
	}
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

    updateMPCount();
}

function populate_details(person) {
    person = person[0]

    $('.mp-photo').attr('src', 'http://www.theyworkforyou.com' + person.image);

    $('.mp-details').each(function () {
        $(this).html(person[$(this).data('detail')]);
    });

    $('#details').fadeIn();
}
