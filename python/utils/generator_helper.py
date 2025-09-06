# utils/generator_helper.py
# Small helpers for generator-based animations (placeholder - currently unused)
def steps_from_list(a, gen):
    """Given array a and generator gen that yields highlight dicts, yield states with copies."""
    for highlights in gen:
        yield a, highlights
        