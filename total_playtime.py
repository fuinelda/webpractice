def timeupper60(i1, i2):
    while(i2 > 60):
        i2 -= 60
        i1 += 1
    return i1, i2

while(1 > 0):
    times = []
    count = 0

    print('시간을 입력하세요(기호 없이. 예> 3분 5초 -> 305)')

    while(1 > 0):
        count += 1
        t_each = input(str(count) + '. ')
        if t_each is '':
            break
        times.append(t_each.zfill(6))

    h, m, s = 0, 0, 0

    for t_each2 in times:
        h += int(t_each2[0:2])
        m += int(t_each2[2:4])
        s += int(t_each2[4:6])

    m, s = timeupper60(m, s)
    h, m = timeupper60(h, m)

    for t in times:
        print( str(times.index(t) + 1)+'. ' + t[0:2] + ':' + t[2:4] + ':' + t[4:])
    print('총', str(h) + '시간 ' + str(m) + '분 ' + str(s) + '초')

    exit_yn = input('종료? (예 : 1/ 아니오 : 0) ')
    if exit_yn is '1':
        break
    else:
        print('\n\n\n\n\n\n\n')
        continue
