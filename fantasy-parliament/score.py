from users import upsert_user
from parser import Parser

def calculate_score(user):
    parser = Parser(2013, 9, 10)
    scorers = [parser.vote_score, parser.speak_score]
    all_scores = {}
    total_score = 0

    for mp in user['mps']:
        mp_scores = []
        for scorer in scorers:
            results = scorer(mp)
            for result in results:
                total_score += result['score']
                mp_scores.append(result)
        all_scores[str(mp)] = mp_scores

    user['score_breakdown'] = all_scores
    user['score'] = total_score

    upsert_user(user['email'], user)

    return all_scores, total_score
