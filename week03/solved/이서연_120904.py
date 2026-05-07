def solution(num, k):

# num 을 배열 n 에 담기
    arr = []

    # num 의 각 자릿수 잘라서 
    for i in range(1, len(str(num))+1):
        # 10의 i 제곱만큼 나눠 
        a = num % (10 ** i) // (10 ** (i-1)) # // 정수 나눗셈 연산자, /는 float 로 반환됨 
            # 배열에 담기 (append)
        arr.append(a)
        
        
# 배열 뒤집기 
    arr.reverse()
    
# 값 찾기
    # 반복문으로 배열을 순회하며 
    for i in range(len(arr)):
        # k 값과 동일한 값 찾기 
        if arr[i] == k:
            return i + 1
    return -1
        


# num 의 길이만큼 반복
    # num % (10의 n 제곱) - num % (10의 (n-1) 제곱) 으로 각 자릿수 구하기
        # k = 각 자릿수 일 경우 n return
       
