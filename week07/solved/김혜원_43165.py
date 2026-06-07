def solution(numbers, target):
    answer = dfs(numbers, target, 0, 0);
    
    return answer

def dfs(numbers, target, index, currentCount):
    
    # 끝까지 다 더한 값이 target과 같은지 확인
    if(len(numbers) == index):
        if(currentCount == target):
            return 1
        else:
            return 0
    else:
        plus_result = dfs(numbers, target, index + 1, currentCount + numbers[index])
        minus_result = dfs(numbers, target, index + 1, currentCount - numbers[index])
        return plus_result + minus_result