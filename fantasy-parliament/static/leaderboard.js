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
		var name = mps[personId] ? mps[personId].full_name : personId;
		scoring.append('<dt>' + name + '<dt>');

		$.each(scores, function() {
			scoring.append('<dd><span class="scoreName">' + this.description + '</span><span class="scoreValue">' + this.score + '</span></dd>');
		});
	});
};