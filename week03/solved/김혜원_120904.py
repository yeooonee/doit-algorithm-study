def solution(num, k):
    num_list = [int(i) for i in str(num)]
    
    for index, value in enumerate(num_list):
        # 해당 값 찾으면 해당 인덱스 + 1 반환
        if(value == k):
            return index + 1
        
    return -1