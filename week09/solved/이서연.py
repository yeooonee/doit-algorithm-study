def solution(array, commands):
    answer = []

    # 주어진 배열 자르기 
    for i,j,k in commands:
        l = array[i-1:j]
        l.sort()
        answer.append(l[k-1])
            
    return answer 
