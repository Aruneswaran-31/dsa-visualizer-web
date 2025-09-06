# algorithms/bubble_sort.py
def bubble_sort(arr):
    a = arr
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            yield {j: "compare", j+1: "compare"}
            if a[j] > a[j+1]:
                a[j], a[j+1] = a[j+1], a[j]
                yield {j: "swap", j+1: "swap"}
        yield {n - i - 1: "sorted"}
    yield {i: "sorted" for i in range(n)}
