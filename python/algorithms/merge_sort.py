# algorithms/merge_sort.py
def merge_sort(arr):
    a = arr
    yield from _merge_sort(a, 0, len(a)-1)

def _merge_sort(a, l, r):
    if l >= r:
        return
    m = (l + r) // 2
    yield from _merge_sort(a, l, m)
    yield from _merge_sort(a, m+1, r)
    # merge
    left = a[l:m+1]
    right = a[m+1:r+1]
    i = j = 0
    k = l
    while i < len(left) and j < len(right):
        yield {l + i: "compare", m+1 + j: "compare"}
        if left[i] <= right[j]:
            a[k] = left[i]; i += 1
            yield {k: "swap"}
        else:
            a[k] = right[j]; j += 1
            yield {k: "swap"}
        k += 1
    while i < len(left):
        a[k] = left[i]; i += 1; k += 1
        yield {k-1: "swap"}
    while j < len(right):
        a[k] = right[j]; j += 1; k += 1
        yield {k-1: "swap"}
    for idx in range(l, r+1):
        yield {idx: "sorted"}
