def solution(d, budget):
    d.sort()
    answer = 0 
    
    for value in d:
        if budget - value >= 0 : # 예산에서 해당값을 빼고 answer + 1
            budget -= value
            answer += 1
        else :  # 예산에서 해당값을 뺐을 때 0보다 작으면 break
            break
        
    return answer