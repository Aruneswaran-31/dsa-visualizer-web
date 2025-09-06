# data_structures/array.py
import pygame

class ArrayVisualizer:
    def __init__(self, data):
        self.data = list(data)
        self.font = pygame.font.SysFont("Segoe UI", 16, bold=True)

    def draw(self, screen, area, highlight_indices=None):
        if highlight_indices is None:
            highlight_indices = {}
        n = len(self.data)
        if n == 0:
            return
        # adaptive width so many elements still fit
        cell_w = max(30, (area.w - 40) // n)
        start_x = area.x + 20
        y = area.centery - 25
        for i, v in enumerate(self.data):
            rect = pygame.Rect(start_x + i*cell_w, y, cell_w - 6, 50)
            col = (80,140,240)
            if i in highlight_indices:
                role = highlight_indices[i]
                if role == "swap": col = (240,80,80)
                elif role == "compare": col = (250,210,90)
                elif role == "sorted": col = (80,200,120)
            pygame.draw.rect(screen, col, rect, border_radius=8)
            txt = self.font.render(str(v), True, (255,255,255))
            screen.blit(txt, txt.get_rect(center=rect.center))
