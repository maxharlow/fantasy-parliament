from users import upsert_user
from parser import Parser

def test(mp_id):
    return {'description': 'test', 'score': 1}

parser_scorer = Parser(2013, 9, 10)

scorers = [test, parser_scorer.vote_score, parser_scorer.speak_score]

def calculate_score(user):
    all_scores = {}
    total_score = 0

    for mp in user['mps']:
        mp_scores = {}
        for scorer in scorers:
            result = scorer(mp)
            if result is not None:
                total_score += result['score']
                mp_scores[scorer.__name__] = result
        all_scores[str(mp)] = mp_scores

    user['score_breakdown'] = all_scores
    user['score'] = total_score

    upsert_user(user['email'], user)

    return all_scores, total_score
