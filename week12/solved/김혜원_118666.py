def solution(survey, choices):
    answer = ''

    # 지표별 성격 유형 점수 초기화
    type_scores = {
        "R": 0, "T": 0,
        "C": 0, "F": 0,
        "J": 0, "M": 0,
        "A": 0, "N": 0
    }

    for category, choice in zip(survey, choices):
        disagree_type = category[0]
        agree_type = category[1]

        if(choice >= 5): # 동의 선택지 (5, 6, 7) -> 1, 2, 3점
            type_scores[agree_type] += choice - 4
        else :          # 비동의 선택지 (1, 2, 3) -> 3, 2, 1점 (4일 땐 0점)
            type_scores[disagree_type] += 4 - choice

    # 비교할 4개의 지표 쌍 (알파벳 순서대로 배치함)
    indicators = [("R", "T"), ("C","F"), ("J","M"), ("A","N")]

    # 지표별 최종 성격 유형 결정
    for type_a, type_b in indicators:
        if(type_scores[type_a] >= type_scores[type_b]):
            answer += type_a
        else:
            answer += type_b

    return answer