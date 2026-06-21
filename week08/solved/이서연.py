from itertools import permutations

def solution(k, dungeons):
    answer = -1

    # itertools.permutations 로 dungeons의 순열 조합 찾기
    for p in permutations(dungeons):
        cnt = 0
        # 순열 조합대로 피로도 계산
        # 총 던전 개수만큼 for 문, 순열 조합에서 뽑기
        copyk = k
        for i in p:
            # i 번째 던전의 최소 피로도 확인
            if (copyk >= i[0]):
                # 통과 시 
                # cnt +1
                cnt += 1
                # 현재피로도 - 소모 피로도
                copyk = copyk - i[1]
            else:
                # 통과 못할 경우 break
                cnt = 0
                break
            # answer < cnt 일 경우 answer 값 갱신
            if answer < cnt :
                answer = cnt

    return answer
