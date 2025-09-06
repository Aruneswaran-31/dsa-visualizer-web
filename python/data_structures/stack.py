# data_structures/stack.py
import pygame

class StackVisualizer:
    def __init__(self):
        self.items = []
        self.font = pygame.font.SysFont("Segoe UI", 16, bold=True)

    def push(self, v):
        self.items.append(v)

    def pop(self):
        if self.items:
            self.items.pop()

    def to_list(self):
        return list(self.items)

    def draw(self, screen, area, highlight=None):
        # draw stack centered vertically
        x = area.centerx
        base_y = area.centery - 20*len(self.items)
        w, h = 120, 40
        for i, v in enumerate(reversed(self.items)):
            rect = pygame.Rect(x + 100, base_y + i*(h+8), w, h)
            pygame.draw.rect(screen, (80,140,240), rect, border_radius=8)
            txt = self.font.render(str(v), True, (255,255,255))
            screen.blit(txt, txt.get_rect(center=rect.center))
