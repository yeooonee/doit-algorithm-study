from functools import cmp_to_key

# 정렬 비교함수
# -1 = x 가 앞으로, 1이면 x 가 뒤로 
def addString(x,y):
    x = str(x)
    y = str(y)
    a = x + y
    b = y + x
    if (a > b):
        return -1
    elif (a < b):
        return 1
    else:
        return 0


def solution(numbers):
    # 조합하여 큰 수대로 정렬
    # key 는 보통 원소 정렬 기준이 될 값으로 변환하는 함수 
    # 정렬 비교함수를 이용해, 정렬할 때 큰 값이 되는대로 정렬
    result = sorted(numbers, key=cmp_to_key(addString))    
    # 정렬된 수 문자열로 변경
    result2 = [str(n) for n in result]
    # 문자열로 변경된 정렬된 값 합치기
    answer = "".join(result2).lstrip('0')
    # [0,0] 케이스에 대비
    return answer if answer else '0'

        
