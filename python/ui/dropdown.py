# ui/dropdown.py
import pygame

class Dropdown:
    def __init__(self, rect, options, default_index=0, font=None):
        self.rect = pygame.Rect(rect)
        self.options = list(options)
        self.value = self.options[default_index]
        self.font = font or pygame.font.SysFont("Segoe UI", 16, bold=True)
        self.open = False
        self.hover_index = None

    def handle(self, e):
        if e.type == pygame.MOUSEBUTTONDOWN and e.button == 1:
            if self.rect.collidepoint(e.pos):
                self.open = not self.open
                return True
            if self.open:
                # check option clicks
                for i, _ in enumerate(self.options):
                    r = pygame.Rect(self.rect.x, self.rect.y + (i+1)*self.rect.h, self.rect.w, self.rect.h)
                    if r.collidepoint(e.pos):
                        self.value = self.options[i]
                self.open = False
                return True
        if e.type == pygame.MOUSEMOTION and self.open:
            self.hover_index = None
            for i, _ in enumerate(self.options):
                r = pygame.Rect(self.rect.x, self.rect.y + (i+1)*self.rect.h, self.rect.w, self.rect.h)
                if r.collidepoint(e.pos):
                    self.hover_index = i
                    break
        return False

    def draw(self, screen, label=""):
        if label:
            lab = self.font.render(label, True, (180,180,180))
            screen.blit(lab, (self.rect.x, self.rect.y - 22))
        pygame.draw.rect(screen, (64,64,84), self.rect, border_radius=6)
        pygame.draw.rect(screen, (180,180,200), self.rect, 2, border_radius=6)
        val_surf = self.font.render(str(self.value), True, (255,255,255))
        screen.blit(val_surf, (self.rect.x + 8, self.rect.y + (self.rect.h - val_surf.get_height())//2))

        # indicator triangle
        tri_x = self.rect.right - 18
        tri_y = self.rect.centery
        pygame.draw.polygon(screen, (200,200,200), [(tri_x-6, tri_y-4), (tri_x+6, tri_y-4), (tri_x, tri_y+4)])

        if self.open:
            for i, opt in enumerate(self.options):
                r = pygame.Rect(self.rect.x, self.rect.y + (i+1)*self.rect.h, self.rect.w, self.rect.h)
                color = (72,72,92) if i != self.hover_index else (88,88,110)
                pygame.draw.rect(screen, color, r)
                t = self.font.render(opt, True, (255,255,255))
                screen.blit(t, (r.x + 8, r.y + 6))
