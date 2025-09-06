# algorithms/selection_sort.py
def selection_sort(arr):
    a = arr
    n = len(a)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            yield {min_idx: "compare", j: "compare"}
            if a[j] < a[min_idx]:
                min_idx = j
                yield {min_idx: "compare"}
        if min_idx != i:
            a[i], a[min_idx] = a[min_idx], a[i]
            yield {i: "swap", min_idx: "swap"}
        yield {i: "sorted"}
    yield {i: "sorted" for i in range(n)}
