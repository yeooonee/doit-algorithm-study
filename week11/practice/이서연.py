def bf_match(txt: str, pat: str) -> int:
    pt = 0
    pp = 0

    while pt != len(txt) and pp != len(pat):
        if txt[pt] == pat[pp]:
            pt += 1
            pp += 1

        else:
            pt = pt - pp + 1
            pp = 0

    return pt - pp if pp == len(pat) else -1

if __name__ == '__main__':
    s1 = input('텍스트 입력:')
    s2 = input('패턴 입력:')

    idx = bf_match(s1,s2)

    if idx == -1:
        print('텍스트 안 패턴 없음 ')
    else:
        print(f'{(idx+1)}번째 문자가 일치')