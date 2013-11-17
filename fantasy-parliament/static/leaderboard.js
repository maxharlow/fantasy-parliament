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

	$.each(data, function(personId, scores) {
		scoring.append('<dt>' + mps[personId].full_name + '<dt>');

		$.each(scores, function(scorer, result) {
			scoring.append('<dd><span class="scoreName">' + result.description + '</span><span class="scoreValue">' + result.score + '</span></dd>');
		});
	});
};