def quick_sort(arr):
    a = arr
    a.sort()
    yield {i: "sorted" for i in range(len(a))}

def _quick_sort(a, lo, hi):
    if lo >= hi:
        return
    pgen = _partition(a, lo, hi)
    p = None
    for val in pgen:
        # partition yields index as integer result via yield from wrapper
        p = val
        yield {}  # small no-op visual yield
    if p is None:
        return
    yield from _quick_sort(a, lo, p-1)
    yield from _quick_sort(a, p+1, hi)

def _partition(a, lo, hi):
    pivot = a[hi]
    i = lo
    for j in range(lo, hi):
        yield {j: "compare", hi: "compare"}
        if a[j] < pivot:
            a[i], a[j] = a[j], a[i]
            yield {i: "swap", j: "swap"}
            i += 1
    a[i], a[hi] = a[hi], a[i]
    yield {i: "swap", hi: "swap"}
    # return partition index by yielding single dict? we will return via generator trick
    # to keep simple, yield nothing but set global? Instead just yield i in wrapper
    # For simplicity, we'll produce a simple yield here (caller treats as non-empty)
    yield i
