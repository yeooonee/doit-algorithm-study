def solution(s):
    answer = True
    
    # 스택 생성 
    chk = []
    # 입력 값 순회하며 
        # ( 일 경우 스택에 값 넣기
    for i in s : # for i in s 의 i 는 인덱스가 아니라 요소 그 자체 (글자임)
        if i == '(':
            chk.append(i)
    # ) 일 경우 스택에 값 빼기 
        if i == ')':
            # 뺄 값이 없을 경우 false 반환
            if not chk:
                return False
            chk.pop()
            
            
    # 최종 스택에 ( 나 )이 남아있을 경우 false, 안남아있으면 true
    if len(chk) > 0:
        return False
    else :
        return True
            
    