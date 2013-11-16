$.ajaxSetup({
    'beforeSend': function (xhr, settings) {
        settings.data['email'] = $('#email').val();
    }
});

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
    });
});
