twfy = new TWFYAPI.TWFYAPI('FFc3vfGRyyBgCnVqegDY3Ujh');

var availableMPs = $('#available-mps');
var selectedMPs = $('#selected-mps');

function updateMPCount() {
	$('#mpcount').html(selectedMPs.children().length)
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
    var id = $(this).children(':selected').val();
    populate_details(mps[id]);
});

$('#save-mps').click(function () {
    var mps = _.map(selectedMPs.children(), function (mp) {
        return parseInt(mp.value);
    });
    var email = $('#email').val();

	if (mps.length > 12)
		alert('Reduce the size of your cabinet!');
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

function populate_mps(userMPs) {
    selectedMPs.empty();
    availableMPs.empty();
    $('#details').fadeOut();

    userMPs = userMPs || [];

	var sortedMPs = _.sortBy(mps, function(each) {
		return each.last_name;
	});

    $.each(sortedMPs, function () {
        var ele = $('<option value="' + this.member_id + '" data-party="' + this.party + '">' + this.first_name + ' ' + this.last_name + ' [' + this.party + ']</option>');

        if (userMPs.indexOf(parseInt(this.member_id)) !== -1) {
            selectedMPs.append(ele);
        } else {
            availableMPs.append(ele);
        }
    });

    updateMPCount();
    $('#loader').fadeOut();
}

function populate_details(mp) {
    $('.mp-photo').attr('src', 'http://www.theyworkforyou.com' + mp.image);
    $('.mp-details').each(function () {
        $(this).html(mp[$(this).data('detail')]);
    });

    $('#details').fadeIn();
}

function init() {
    var email = $('#email').val();
    if (!email) {
        populate_mps();
    } else {
        $.getJSON('/user/' + email)
            .then(function (data) {
                populate_mps(data.mps);
            });
    }
}

init();
