# data_structures/tree.py
import pygame

class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class TreeVisualizer:
    def __init__(self):
        self.root = None
        self.font = pygame.font.SysFont("Segoe UI", 14, bold=True)
        self.highlight_val = None

    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
            return
        cur = self.root
        while True:
            if val < cur.val:
                if cur.left:
                    cur = cur.left
                else:
                    cur.left = TreeNode(val)
                    break
            else:
                if cur.right:
                    cur = cur.right
                else:
                    cur.right = TreeNode(val)
                    break

    def inorder(self):
        res = []
        def dfs(n):
            if not n: return
            dfs(n.left); res.append(n.val); dfs(n.right)
        dfs(self.root)
        return res

    def search(self, val):
        cur = self.root
        while cur:
            if cur.val == val:
                self.highlight_val = val
                return True
            elif val < cur.val:
                cur = cur.left
            else:
                cur = cur.right
        self.highlight_val = None
        return False

    def draw(self, screen, area, highlight=None):
        if not self.root: return
        # generate positions by BFS level
        nodes = []
        levels = {}
        def dfs(n, depth, pos):
            if not n: return
            levels.setdefault(depth, []).append(n)
            nodes.append((n, depth))
            dfs(n.left, depth+1, pos*2)
            dfs(n.right, depth+1, pos*2+1)
        dfs(self.root, 0, 0)
        # layout simple: width divided by max nodes in a level
        max_depth = max(levels.keys())
        # draw recursively with positions
        positions = {}
        def layout(n, depth, left, right):
            if n is None: return
            mid = (left + right) // 2
            positions[n] = (mid, 80 + depth*80)
            layout(n.left, depth+1, left, mid-20)
            layout(n.right, depth+1, mid+20, right)
        layout(self.root, 0, area.x + 40, area.right - 40)
        # draw edges
        for n, (x,y) in positions.items():
            if n.left in positions:
                x2,y2 = positions[n.left]; pygame.draw.line(screen, (200,200,200), (x,y), (x2,y2), 2)
            if n.right in positions:
                x2,y2 = positions[n.right]; pygame.draw.line(screen, (200,200,200), (x,y), (x2,y2), 2)
        # draw nodes
        for n, (x,y) in positions.items():
            col = (255,140,60) if self.highlight_val is not None and n.val == self.highlight_val else (80,140,240)
            pygame.draw.circle(screen, col, (x,y), 22)
            pygame.draw.circle(screen, (255,255,255), (x,y), 22, 2)
            txt = self.font.render(str(n.val), True, (255,255,255))
            screen.blit(txt, txt.get_rect(center=(x,y)))
