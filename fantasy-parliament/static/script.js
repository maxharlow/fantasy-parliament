twfy = new TWFYAPI.TWFYAPI('FFc3vfGRyyBgCnVqegDY3Ujh');

$(function () {
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

    twfy.query('getMPs', {'callback': 'populate_mps'});
});

function populate_mps(mps) {
    $.each(mps, function () {
        $('#available-mps').append($('<option value="' + this.person_id + '">' + this.name + '</option>'));
    });
}
