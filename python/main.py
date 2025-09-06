# main.py
import pygame, sys
from visualizer import Visualizer
from ui.theme import WIDTH, HEIGHT

def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("DSA Visualizer")
    clock = pygame.time.Clock()

    vis = Visualizer(screen)

    running = True
    while running:
        dt = clock.tick(60)
        for e in pygame.event.get():
            if e.type == pygame.QUIT:
                running = False
            else:
                vis.handle_event(e)

        vis.update(dt)
        vis.draw()
        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
