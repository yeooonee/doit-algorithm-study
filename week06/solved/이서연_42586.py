from collections import deque
import math

def solution(progresses, speeds):
    answer = []
    queue = deque()
    
    # 배열 반복문
    for i, s in zip(progresses, speeds):
        # (100 - 진도율) / 속도 = 예상 배포일 , 올림처리 
        # 큐에 데이터 추가 (예상 배포일)
        exp = math.ceil((100 - i) / s )
        queue.append(exp)
        
    cnt = 0
    st = queue[0]
    
    # 큐에서 꺼낼 때 반복문
    while queue:
        # 가장 앞 작업의 배포일보다 <= 값 출력
        m = queue.popleft()
        if (st >= m) :
            cnt += 1
        else:
            answer.append(cnt)
            st = m
            cnt = 1
        
    answer.append(cnt)
    return answer
