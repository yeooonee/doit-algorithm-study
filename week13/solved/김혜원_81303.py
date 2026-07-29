def solution(n, k, cmd):

    prev = [i - 1 for i in range(n)]  # [-1, 0, 1, 2, 3]
    next = [i + 1 for i in range(n)]
    next[n-1] = -1                    # [1, 2, 3, 4, -1]
    deleted_stack = []                # 삭제는 스택으로 진행

    for c in cmd:
        if c.startswith("U"): # up
            dist = int(c[2:])
            for _ in range(dist):
                k = prev[k]
        if c.startswith("D"): # down
            dist = int(c[2:])
            for _ in range(dist):
                k = next[k]
        if c.startswith("C"): # delete
            deleted_stack.append(k) # 삭제한 index 넣기

            if prev[k] != -1: # k의 prev를 삭제된 요소 뒤랑 이어주기
                next[prev[k]] = next[k] # 아 이거 생각해내는게 너무 어려웠다

            if next[k] != -1: # k의 next를 삭제된 요소 앞이랑 이어주기
                prev[next[k]] = prev[k]

            if next[k] != -1 : # 삭제하고 아래로 이동 but 마지막 삭제하면 위로 이동
                k = next[k]
            else :
                k = prev[k]

        if c.startswith("Z"): # restore
            deleted_idx = deleted_stack.pop()

            if prev[deleted_idx] != -1 : # 기존 k의 prev를 k랑 다시 연결
                next[prev[deleted_idx]] = deleted_idx

            if next[deleted_idx] != -1 : # 기존 k의 next를 k랑 다시 연결
                prev[next[deleted_idx]] = deleted_idx

    del_set = set(deleted_stack)
    # 0부터 n-1까지 돌면서 index가 del_set에 있으면 X, 없으면 O
    answer = "".join(["X" if i in del_set else "O" for i in range(n)])

    return answer