# ui/button.py
import pygame

class Button:
    def __init__(self, rect, text, callback, font=None):
        self.rect = pygame.Rect(rect)
        self.text = text
        self.callback = callback
        self.font = font or pygame.font.SysFont("Segoe UI", 16, bold=True)
        self.hover = False

    def handle(self, e):
        if e.type == pygame.MOUSEMOTION:
            self.hover = self.rect.collidepoint(e.pos)
        if e.type == pygame.MOUSEBUTTONDOWN and e.button == 1:
            if self.rect.collidepoint(e.pos):
                # call callback and return True (so caller can short-circuit)
                try:
                    self.callback()
                except Exception:
                    # don't crash UI if callback has error
                    pass
                return True
        return False

    def draw(self, screen):
        bg = (100, 100, 120) if self.hover else (80, 80, 100)
        pygame.draw.rect(screen, bg, self.rect, border_radius=8)
        pygame.draw.rect(screen, (200,200,220), self.rect, 2, border_radius=8)
        label = self.font.render(self.text, True, (255,255,255))
        screen.blit(label, label.get_rect(center=self.rect.center))
