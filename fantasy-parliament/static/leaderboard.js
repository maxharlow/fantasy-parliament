var scoring = $('#scoring');

$('.user').click(function () {
    var email = $(this).children('.email').text();

	$.getJSON('/user/' + email + '/scoring')
            .then(function (data) {
                scoring.html(data);
            });
});