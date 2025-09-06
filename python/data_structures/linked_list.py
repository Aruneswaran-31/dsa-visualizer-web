# data_structures/linked_list.py
import pygame

class LLNode:
    def __init__(self, val):
        self.val = val
        self.next = None

class LinkedListVisualizer:
    def __init__(self):
        self.head = None
        self.font = pygame.font.SysFont("Segoe UI", 16, bold=True)

    def append(self, val):
        node = LLNode(val)
        if not self.head:
            self.head = node
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = node

    def to_list(self):
        res = []
        cur = self.head
        while cur:
            res.append(cur.val)
            cur = cur.next
        return res

    def draw(self, screen, area, highlight=None):
        vals = self.to_list()
        if not vals:
            return
        w = 100; h = 50
        x = area.centerx - (len(vals)* (w+12))//2
        y = area.centery - h//2
        for i, v in enumerate(vals):
            r = pygame.Rect(x + i*(w+12), y, w, h)
            pygame.draw.rect(screen, (80,140,240), r, border_radius=8)
            txt = self.font.render(str(v), True, (255,255,255))
            screen.blit(txt, txt.get_rect(center=r.center))
            if i < len(vals) - 1:
                start = (r.right, r.centery)
                end = (r.right + 12, r.centery)
                pygame.draw.line(screen, (220,220,220), start, end, 3)
