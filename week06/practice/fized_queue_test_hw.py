from enum import Enum
from fixed_queue_hw import FixedQueue

Menu = Enum('Menu', ['Enque', 'Deque', 'Peek', 'Search', 'Dump', 'Exit'])

def select_menu() -> Menu:
    s = [f'({m.value}){m.name}' for m in Menu]
    while True:
        print(*s, sep='  ', end='')
        n = int(input(': '))
        if 1 <= n <= len(Menu):
            return Menu(n)

q = FixedQueue(64)

while True:
    print(f'현재 데이터 개수: {len(q)} / {q.capacity}')
    menu = select_menu()

    if menu == Menu.Enque:
        x = int(input('데이터 입력: '))
        try:
            q.enque(x)
        except FixedQueue.Full:
            print('큐가 가득 찼습니다.')

    elif menu == Menu.Deque:
        try:
            x = q.deque()
            print(f'디큐한 데이터는 {x}입니다.')
        except FixedQueue.Empty:
            print('큐가 비어 있습니다.')

    elif menu == Menu.Peek:
        try:
            x = q.peek()
            print(f'피크한 데이터는 {x}입니다.')
        except FixedQueue.Empty:
            print('큐가 비어 있습니다.')

    elif menu == Menu.Search:
        x = int(input('검색할 데이터 입력: '))
        if x in q:
            print(f'{q.count(x)}개 포함되어 있습니다.')
        else:
            print('포함되어 있지 않습니다.')

    elif menu == Menu.Dump:
        q.dump()

    else:
        break