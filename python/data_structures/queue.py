# data_structures/queue.py
import pygame
from collections import deque

class QueueVisualizer:
    def __init__(self):
        self.items = deque()
        self.font = pygame.font.SysFont("Segoe UI", 16, bold=True)

    def enqueue(self, v):
        self.items.append(v)

    def dequeue(self):
        if self.items:
            self.items.popleft()

    def to_list(self):
        return list(self.items)

    def draw(self, screen, area, highlight=None):
        arr = list(self.items)
        n = len(arr)
        if n == 0:
            return
        cell_w = max(50, (area.w - 200) // max(1,n))
        start_x = area.centerx
        y = area.centery - 25
        for i, v in enumerate(arr):
            rect = pygame.Rect(start_x + i*(cell_w+6), y, cell_w, 50)
            pygame.draw.rect(screen, (80,140,240), rect, border_radius=8)
            txt = self.font.render(str(v), True, (255,255,255))
            screen.blit(txt, txt.get_rect(center=rect.center))
