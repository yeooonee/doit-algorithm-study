from __future__ import annotations
from typing import Any, Type
from enum import Enum
import hashlib

class Node:
    def __init__(self, key:Any, value: Any, next: Node) -> None:
        self.key = key
        self.value = value
        self.next = next 

class ChainedHash:
    def __init__(self, capacity:int) -> None:
        self.capacity = capacity
        self.table = [None] * self.capacity


    # 인수 key 에 대응하는 해시값 구하기 
    def hash_value(self, key: Any) -> int:

        # key 가 int 인 경우
        if isinstance(key, int):
            return key % self.capacity
        
        # key 가 int 가 아닌 경우, 표준 라이브러리로 형변환 해야 해시값 얻을 수 있음.
        return(int(hashlib.sha256(str(key).encode()).hexdigest(), 16) % self.capacity)

    def search(self, key: Any) -> Any:
        hash = self.hash_value(key)
        p = self.table[hash]
        
        while p is not None:
            if p.key == key:
                return p.value
            p = p.next
        
        return None
    
    def add(self, key: Any, value: Any) -> bool:
        hash = self.hash_value(key)
        p = self.table[hash]

        while p is not None:
            if p.key == key:
                return False
            p = p.next

        temp = Node(key, value, self.table[hash])
        self.table[hash] = temp
        return True
    
    def remove(self, key: Any) -> bool:
        hash = self.hash_value(key)
        p = self.table[hash]
        pp = None

        while p is not None:
            if p.key == key:
                if pp is None:
                    self.table[hash] = p.next
                else:
                    pp.next = p.next
                return True
            pp = p
            p = p.next
        return False
    
    def dump(self) -> None:
        for i in range(self.capacity):
            p = self.table[i]
            print(i, end='')
            while p is not None:
                print(f' -> {p.key} ({p.value})', end='')
                p = p.next
            print()


Menu = Enum('Menu', ['추가','삭제','검색','덤프','종료'])

def select_menu() -> Menu:
    s = [f'({m.value}){m.name}' for m in Menu]
    while True:
        print(*s, sep=' ', end='')
        n = int(input(': '))
        if 1 <= n <= len(Menu):
            return Menu(n)
        
hash = ChainedHash(13)

while True:
    menu = select_menu()

    if menu == Menu.추가:
        key = int(input('추가할 키 입력: '))
        val = input('추가할 값 입력: ')
        if not hash.add(key, val):
            print('추가 실패 ')
    
    elif menu == Menu.삭제:
        key = int(input('삭제 키 입력: '))
        if not hash.remove(key):
            print('삭제 실패 ')

    elif menu == Menu.검색:
        key = int(input('검색 키 입력 : '))
        t = hash.search(key)
        if t is not None:
            print(f'검색 키 갖는 값을 {t}입니다.')
        else:
            print('검색 데이터가 없습니다.')
    
    elif menu == Menu.덤프:
        hash.dump()

    else:
        break
