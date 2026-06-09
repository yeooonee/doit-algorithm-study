def solution(numbers, target):

    # 재귀 (idx, sum)
    def 재귀 (idx, sum):
        # if idx == numbers 개수 
        if idx == len(numbers):
            # sum 값 == target 
            if sum == target:
                # return 1
                return 1
            # else
            else:  
                # return 0            
                return 0
        # return 재귀(idx+1, sum + nubmers[idx]) + 재귀(idx+1, sum - nubmers[idx])
        return 재귀(idx+1, sum + numbers[idx]) + 재귀(idx+1, sum - numbers[idx])
        
    # return 재귀(0,0)
    return 재귀(0,0)