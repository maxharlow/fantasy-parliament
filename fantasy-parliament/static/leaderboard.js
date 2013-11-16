var scoring = $('#scoring');

$('.user').click(function () {
    var email = $(this).children('.email').text();

	$.getJSON('/user/' + email + '/scoring')
            .then(function (data) {
                updateScoring(data);
            });
});

function updateScoring(data) {
	scoring.html('');

	$.each(data, function(mp, scores) {
		scoring.append('<dt>' + mp + '<dt>');

		$.each(scores, function(scoreName, scoreValue) {
			scoring.append('<dd><span class="scoreName">' + scoreName + '</span><span class="scoreValue">' + scoreValue + '</span></dd>');
		});
	});
};