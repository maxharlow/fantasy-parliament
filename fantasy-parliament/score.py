from users import upsert_user
from parser import update_scores

def test(mp_id):
    return 1

parser_scorer = update_scores(2013, 09, 16)

scorers = [test, parser_scorer.vote_score, parser_scorer.speak_score]

def calculate_score(user):
    all_scores = {}
    total_score = 0

    for mp in user['mps']:
        mp_scores = {}
        for scorer in scorers:
            score = scorer(mp)
            total_score += score
            mp_scores[scorer.__name__] = score
        all_scores[str(mp)] = mp_scores

    user['score_breakdown'] = all_scores
    user['score'] = total_score

    upsert_user(user['email'], user)

    return all_scores, total_score
