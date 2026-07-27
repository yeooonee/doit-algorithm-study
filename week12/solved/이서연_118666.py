def solution(survey, choices):
    answer = ''

#### 분석 ####
#survey 비동의/동의
# 선택 점수표 7선택지
# survey 값 가져와서 선택지에 따라 비동의/동의 항목 수만큼 사용자 지표 값 추가
# 사용자 지표 -> Dictionary

    # 의사 코드
    
    # 채점표
    # 사용자 지표 userScore - Dictionary 생성
        # R,T,C,F,J,M,A,N key 값 추가
    userScore = {'R':0,'T':0,'C':0,'F':0,'J':0,'M':0,'A':0,'N':0,}
    # survey 
        # choice 에 따른 점수 배점표 standardScore - Dictionary 생성
        # 1-3,2-2,3-1,4-0,5-1,6-2,7-3
    standardScore = {'1':3,'2':2,'3':1,'4':0,'5':1,'6':2,'7':3}
        
    # 값 할당
    # 반복문 index i
    for i in range(len(survey)):
        # 조건문 - 4 미만 일 경우 
        if choices[i] < 4:
            # userScore 에
            # key : survey[i] 의 1번째 글자
            ch = survey[i]
            # value : standardScore 의 배점 더하기
            val = standardScore[str(choices[i])]
            userScore[ch[0]] += val
                
        # 4 초과일 경우
        if choices[i] > 4:
                # userScore 에
                # key : survey[i] 의 2번째 글자
                ch = survey[i]
                # value : standardScord 의 배점 더하기
                val = standardScore[str(choices[i])]
                userScore[ch[1]] += val
    
    # 출력 
    if userScore['R'] >= userScore['T']:
        answer += ('R')
    elif userScore['R'] < userScore['T']:
        answer += ('T')
        
    if userScore['C'] >= userScore['F']:
        answer+=('C')
    elif userScore['C'] < userScore['F']:
        answer+= ('F')

    if userScore['J'] >= userScore['M']:
        answer += ('J')
    elif userScore['J'] < userScore['M']:
        answer+=('M')
        
    if userScore['A'] >= userScore['N']:
        answer+=('A')
    elif userScore['A'] < userScore['N']:
        answer+=('N')
    
    
    return answer
