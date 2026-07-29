def solution(n, k, cmd):

#요구사항
# 이중연결리스트 사용

    # list 생성
    nodes = [Node(i) for i in range(n)]
    for i in range(n):
        if i > 0:
            nodes[i].prev = nodes[i-1]
        if i < n-1:
            nodes[i].next = nodes[i+1]
    deleted = []
    
    # list 의 current = k
    current = nodes[k]
    # 반복문 for i in cmd
    for i in cmd:
        val = i[:1]
        X = i[2:]

        # i가 U일 경우
        if val == 'U':
            # prev X번
            for _ in range(int(X)): # X 번 반복
                current = current.prev
                
        # i가 D로 시작할 경우 
        if val == 'D':
            # next X번
            for _ in range(int(X)):
                current = current.next
            
        # i가 C일 경우
        if val == 'C':
            # 현재 노드 삭제
            if current.prev != None:
                current.prev.next = current.next
            if current.next != None:
                current.next.prev = current.prev

            # 삭제한 노드 프리 리스트에 담기
            deleted.append(current)

            # next 1번
            if current.next == None :
                current = current.prev
            else:
                current = current.next
            
        # i가 Z일 경우
        if val == 'Z' :
            # 프리리스트 헤드 노드빼기 
            node = deleted.pop()
            # 해당 공간에 노드 복구
            if node.prev != None:
                node.prev.next = node
            if node.next != None:
                node.next.prev = node
                
    answerList = ["O"] * n
    
    for i in deleted :
        idx = i.idx
        answerList[idx] = "X"
    
    answer = "".join(answerList)
    return answer

    
class Node:
    def __init__(self,idx):
        self.idx = idx
        self.prev = None
        self.next = None
