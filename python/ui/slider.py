import pygame

class Slider:
    def __init__(self, rect, value=0.5):
        self.rect = pygame.Rect(rect)
        self.value = value
        self.dragging = False

    def draw(self, surf, label):
        font = pygame.font.SysFont("Segoe UI", 14)
        surf.blit(font.render(label, True, (220,220,220)), (self.rect.x, self.rect.y-18))
        track = pygame.Rect(self.rect.x+10, self.rect.centery-3, self.rect.w-20, 6)
        pygame.draw.rect(surf, (100,100,120), track)
        knob_x = track.x + int(self.value * track.w)
        pygame.draw.circle(surf, (230,230,230), (knob_x, track.centery), 8)

    def handle(self, e):
        track = pygame.Rect(self.rect.x+10, self.rect.centery-3, self.rect.w-20, 6)
        if e.type == pygame.MOUSEBUTTONDOWN and e.button == 1 and self.rect.collidepoint(e.pos):
            self.dragging = True
        elif e.type == pygame.MOUSEBUTTONUP:
            self.dragging = False
        elif e.type == pygame.MOUSEMOTION and self.dragging:
            rel = (e.pos[0]-track.x)/track.w
            self.value = max(0, min(1, rel))
