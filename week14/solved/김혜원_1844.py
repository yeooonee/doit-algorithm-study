from collections import deque

def solution(maps):
    n = len(maps)
    m = len(maps[0])
    visited = [[False] * m for _ in range(n)]

    # 1. 큐 생성 및 시작점(0, 0, 거리 1) 세팅
    queue = deque([(0, 0, 1)])
    visited[0][0] = True

    # 상하좌우 이동용
    dx = [-1, 1, 0, 0]
    dy = [0, 0, -1, 1]

    # 2. 큐가 빌 때까지 반복
    while queue:
        x, y, dist = queue.popleft()

        # 우측 하단(n-1, m-1)에 도착했다면 종료
        if x == n - 1 and y == m - 1:
            return dist

        # 3. 상하좌우 확인하며 queue에 넣기
        for i in range(4):
            nx = x + dx[i]
            ny = y + dy[i]

            # x가 맵 안에 있는지 확인
            if(nx < 0 or nx >= n):
                continue

            # y가 맵 안에 있는지 확인
            if(ny < 0 or ny >= m):
                continue

            # 방문 가능한 곳인지 확인
            if(maps[nx][ny] == 0):
                continue

            # 방문한 곳인지 확인
            if(visited[nx][ny]):
                continue

            queue.append([nx, ny, dist + 1])
            visited[nx][ny] = True

    # 큐를 다 돌았는데도 도착지에 못 가면 벽이 막힌 것
    return -1