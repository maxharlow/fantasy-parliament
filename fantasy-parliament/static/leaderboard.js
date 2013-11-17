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

	$.each(data, function(memberId, scores) {
		var name = mps[memberId] ? mps[memberId].full_name : memberId;
		scoring.append('<dt>' + name + '<dt>');

		$.each(scores, function() {
			scoring.append('<dd data-type="' + this.type + '" data-score="' + this.score + '"><span class="scoreName">' + this.description + '</span><span class="scoreValue">' + this.score + '</span></dd>');
		});
	});
};