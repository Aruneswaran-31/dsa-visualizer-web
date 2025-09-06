# ui/textbox.py
import pygame, time

class TextBox:
    def __init__(self, rect, font, text="", placeholder=""):
        self.rect = pygame.Rect(rect)
        self.font = font
        self.text = str(text)
        self.placeholder = str(placeholder)
        self.active = False
        self._cursor_on = True
        self._last_toggle = time.time()
        self.cursor_interval = 0.5

    def handle(self, e):
        if e.type == pygame.MOUSEBUTTONDOWN and e.button == 1:
            self.active = self.rect.collidepoint(e.pos)
            return self.active
        if e.type == pygame.KEYDOWN and self.active:
            if e.key == pygame.K_RETURN:
                self.active = False
            elif e.key == pygame.K_BACKSPACE:
                self.text = self.text[:-1]
            else:
                ch = e.unicode
                if ch and ch.isprintable():
                    self.text += ch
            return True
        return False

    def draw(self, screen):
        border = (200,200,210) if self.active else (120,120,140)
        pygame.draw.rect(screen, (40,40,56), self.rect, border_radius=6)
        pygame.draw.rect(screen, border, self.rect, 2, border_radius=6)
        if self.text:
            surf = self.font.render(self.text, True, (255,255,255))
        else:
            surf = self.font.render(self.placeholder, True, (140,140,160))
        screen.blit(surf, (self.rect.x + 8, self.rect.y + (self.rect.h - surf.get_height())//2))

        if self.active:
            now = time.time()
            if now - self._last_toggle >= self.cursor_interval:
                self._cursor_on = not self._cursor_on
                self._last_toggle = now
            if self._cursor_on:
                cursor_x = self.rect.x + 8 + surf.get_width() + 2
                pygame.draw.line(screen, (255,255,255), (cursor_x, self.rect.y + 6), (cursor_x, self.rect.bottom - 6), 2)
