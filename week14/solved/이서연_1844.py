from collections import deque
import copy


def solution(maps):
    answer = -1
    
    # BFS 로 최단거리 계산
    
    # dist는 visited, 거리, 이동 가능한 곳 정보 담긴 배열
    dist = copy.deepcopy(maps)
    # dist에 거리가 있으면 이미 방문한 것 (못가는 곳 :0, 이미 간곳: 거리, 방문하지 않은 곳 -1)
    # maps 에서 1 을 -1 로 변경한 dist 배열 생성 
    for i in range(len(dist)):
        for j in range(len(dist[i])):
            if dist[i][j] == 1:
                dist[i][j] = -1

    # 큐 (현재 위치 좌표값)
    q = deque()
    dx = [-1, 1, 0, 0]
    dy = [0, 0, -1, 1]
    # 좌표값, 거리,
    # 현재 위치 값 최초 0,0
    q.append((0, 0, 1))       # 큐에 좌표 넣기
    dist[0][0] = -1
    dist_len_x = len(dist) -1
    dist_len_y = len(dist[0]) -1
    while q:
        x, y, dis = q.popleft()     # 큐에서 좌표 꺼내기 
        if x == dist_len_x and y == dist_len_y :
            return dis
            
        for k in range(4):
            nx = x + dx[k] # 1. 열: maps[현재위치+1][현재위치], maps[현재위치-1][현재위치]
            ny = y + dy[k] # 2. 행: maps[현재위치][현재위치+1], maps[현재위치][현재위치-1]
            # 갈 수 있는 위치 탐색 
            if nx >= 0 and nx <= dist_len_x and ny <= dist_len_y and ny >= 0: # 범위 체크
                # dist가 -1일 때 이동 가능한 위치
                if dist[nx][ny] == -1 :
                    
                    # -1일 때 이동 후 거리 
                    new_dis = dis + 1
                    # 큐에 이동 가능 위치 추가
                    q.append((nx, ny, new_dis))    
                    dist[nx][ny] = new_dis

    return answer
