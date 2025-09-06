# data_structures/graph.py
import pygame, random, math

class GraphVisualizer:
    def __init__(self):
        self.nodes = {}   # id -> (x,y)
        self.edges = []   # (u,v,weight)
        self.font = pygame.font.SysFont("Segoe UI", 14, bold=True)
        self.highlight_path = []
        self.last_distance = None

    def reset(self):
        self.nodes.clear()
        self.edges.clear()
        self.highlight_path = []
        self.last_distance = None

    def add_node(self, nid=None, area=None):
        if nid is None:
            nid = (max(self.nodes.keys()) + 1) if self.nodes else 1
        if area:
            margin = 60
            x = random.randint(area.x + margin, max(area.right - margin, area.x + margin))
            y = random.randint(area.y + margin, max(area.bottom - margin, area.y + margin))
        else:
            x = random.randint(300, 700)
            y = random.randint(100, 450)
        self.nodes[nid] = (x, y)

    def add_edge(self, u, v, weight=None):
        if u == v or u not in self.nodes or v not in self.nodes:
            return
        for a,b,w in self.edges:
            if (a==u and b==v) or (a==v and b==u):
                return
        if weight is None:
            x1,y1 = self.nodes[u]; x2,y2 = self.nodes[v]
            weight = max(1, int(math.dist((x1,y1),(x2,y2))/50))
        self.edges.append((u, v, weight))

    def delete_node(self, nid):
        if nid in self.nodes:
            del self.nodes[nid]
            self.edges = [(a,b,w) for (a,b,w) in self.edges if a!=nid and b!=nid]
            if nid in self.highlight_path:
                self.highlight_path = [n for n in self.highlight_path if n!=nid]

    def dijkstra(self, start, target):
        if start not in self.nodes or target not in self.nodes:
            self.highlight_path = []
            self.last_distance = None
            return [], float("inf")
        import heapq
        dist = {n: float("inf") for n in self.nodes}
        prev = {n: None for n in self.nodes}
        dist[start] = 0
        pq = [(0, start)]
        adj = {n: [] for n in self.nodes}
        for a,b,w in self.edges:
            adj[a].append((b,w))
            adj[b].append((a,w))
        while pq:
            d,u = heapq.heappop(pq)
            if d>dist[u]: continue
            if u == target: break
            for v,w in adj.get(u,[]):
                nd = d + w
                if nd < dist[v]:
                    dist[v] = nd
                    prev[v] = u
                    heapq.heappush(pq, (nd, v))
        if dist[target] == float("inf"):
            self.highlight_path = []
            self.last_distance = None
            return [], float("inf")
        path = []
        cur = target
        while cur is not None:
            path.append(cur)
            cur = prev[cur]
        path.reverse()
        self.highlight_path = path
        self.last_distance = dist[target]
        return path, dist[target]

    def draw(self, screen, area):
        # draw edges
        for (u,v,w) in self.edges:
            if u not in self.nodes or v not in self.nodes: continue
            x1,y1 = self.nodes[u]; x2,y2 = self.nodes[v]
            if (u in self.highlight_path and v in self.highlight_path and
                abs(self.highlight_path.index(u) - self.highlight_path.index(v))==1):
                color = (255,90,90); width = 4
            else:
                color = (200,200,200); width = 2
            pygame.draw.line(screen, color, (x1,y1), (x2,y2), width)
            mid = ((x1+x2)//2, (y1+y2)//2)
            wlab = self.font.render(str(w), True, (40,40,40))
            screen.blit(wlab, (mid[0]-wlab.get_width()//2, mid[1]-10))
        # draw nodes
        for nid, (x,y) in self.nodes.items():
            if nid in self.highlight_path:
                fill = (255,140,60)
                outline = (255,255,210)
            else:
                fill = (80,140,240)
                outline = (240,240,250)
            pygame.draw.circle(screen, fill, (x,y), 22)
            pygame.draw.circle(screen, outline, (x,y), 22, 2)
            lab = self.font.render(str(nid), True, (255,255,255))
            screen.blit(lab, lab.get_rect(center=(x,y)))
        # show distance label if available
        if self.last_distance is not None and self.highlight_path:
            txt = self.font.render(f"Dist: {self.last_distance}", True, (255,255,0))
            # place label near first node of path if exists
            nid = self.highlight_path[-1]
            x,y = self.nodes.get(nid, (area.centerx, area.centery))
            screen.blit(txt, (x + 30, y - 10))
