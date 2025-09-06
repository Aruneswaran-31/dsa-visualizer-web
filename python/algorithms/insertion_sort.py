# algorithms/insertion_sort.py
def insertion_sort(arr):
    a = arr
    n = len(a)
    for i in range(1, n):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            yield {j: "compare", j+1: "compare"}
            a[j+1] = a[j]
            yield {j: "swap", j+1: "swap"}
            j -= 1
        a[j+1] = key
        yield {j+1: "sorted"}
    yield {i: "sorted" for i in range(n)}
