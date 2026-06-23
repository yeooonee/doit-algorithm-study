def solution(array, commands):
    answer = []
    
    # commands의 배열 크기만큼 for문 돌리기
    for command in commands:
        # 첫 번째 원소부터, 두번째 원소까지 자르기 arr[i-1:j]
        newArray = array[command[0] - 1 : command[1]]
        
        # 자른 배열 정렬하기
        newArray.sort()
        
        # 배열에서 원소 꺼내기 arr[k-1]
        # 꺼낸 원소 answer에 append 하기 
        answer.append(newArray[command[2] - 1])
    
    return answer