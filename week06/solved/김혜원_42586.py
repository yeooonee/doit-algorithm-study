import math 

def solution(progresses, speeds):
    # 배열에 며칠이 걸리는 지 정리해서 넣는다.
    # 앞에 있는 것보다 뒤에 있는게 더 작으면 같이 묶어버린다.
    # 더 큰게 나오면 자르기... 이걸 배열 끝날 때까지 반복
    
    # 작업일 정리
    for i in range(len(progresses)):
        progresses[i] = int(math.ceil((100 - progresses[i]) / speeds[i]))
    
    answer = []
    count = 1
    peek = progresses[0]
    
    for i in range(len(progresses)):
        if(i == len(progresses) - 1): # 배열의 마지막 부분은 count로 마무리
            answer.append(count)    
        else:   
            if(peek >= progresses[i + 1]): # 뒤에 있는 기능이 먼저 완료되면 같이 배포되므로 count에 1 추가
                count += 1
            else:
                answer.append(count) 
                count = 1
                peek = progresses[i + 1]
                
    return answer
