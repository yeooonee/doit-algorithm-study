import sys
sys.setrecursionlimit(10**6)

def solution(nodeinfo):
    answer = [[], []]

    # 노드 클래스
    class Node:
        def __init__(self, id, x, y):
            self.id = id         # 노드 번호 (1번부터 시작)
            self.x = x           # X 좌표
            self.y = y           # Y 좌표
            self.left = None     # 왼쪽 자식 노드
            self.right = None    # 오른쪽 자식 노드

    # 노드 삽입
    def insert(root, node):
        current = root

        while True:
            if node.x < current.x:
                if current.left is None:
                    current.left = node
                    break
                current = current.left

            else:
                if current.right is None:
                    current.right = node
                    break
                current = current.right

    # 전위 순회
    def preorder(node):
        answer[0].append(node.id)
        if node.left:
            preorder(node.left)
        if node.right:
            preorder(node.right)

    # 후위 순회
    def postorder(node):
        if node.left:
            postorder(node.left)
        if node.right:
            postorder(node.right)
        answer[1].append(node.id)

    # node 생성
    nodes = []

    for i, row in enumerate(nodeinfo):
        x = row[0]
        y = row[1]
        nodes.append(Node(i+1, x, y))

    # y 내림차순, x 오름차순 정렬
    nodes.sort(key=lambda node: node.x)
    nodes.sort(key=lambda node: node.y, reverse=True)

    # 트리 구성
    root = nodes[0]
    for i in range(1, len(nodes)):
        node = nodes[i]
        insert(root, node)

    # 순회
    preorder(root)
    postorder(root)

    return answer