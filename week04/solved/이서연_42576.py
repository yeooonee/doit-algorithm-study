def solution(participant, completion):
    answer = ''
    
    # 해시 생성
    result = {}
    
    # for 문 돌면서
    for name in participant:
        # 참가자 key, value +1 추가하기
        if name in result:
            result[name] += 1
        else:
            result[name] = 1
    # for 문 돌면서
    for name in completion:
        # 완주자 key, value -1 하기
        result[name] -= 1
    # for 문 돌면서
    for key, value in result.items():
        # 해시에서 value 가 1 이상인 사람 찾기 
        if value > 0:
            answer = key
    return answer
