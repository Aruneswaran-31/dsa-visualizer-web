# visualizer.py
import pygame, random
from ui.theme import WIDTH, HEIGHT, BG, PANEL_BG
from ui.button import Button
from ui.dropdown import Dropdown
from ui.textbox import TextBox

# algorithm modules (import names)
from algorithms import bubble_sort, selection_sort, insertion_sort, merge_sort, quick_sort

from data_structures.array import ArrayVisualizer
from data_structures.stack import StackVisualizer
from data_structures.queue import QueueVisualizer
from data_structures.linked_list import LinkedListVisualizer
from data_structures.tree import TreeVisualizer
from data_structures.graph import GraphVisualizer

class Visualizer:
    def __init__(self, screen):
        self.screen = screen
        self.mode = "Algorithm"  # or "DataStructure"
        self.array_size = 30
        self.font = pygame.font.SysFont("Segoe UI", 16, bold=True)

        # algorithm UI: dropdown, start, reset (start+reset below dropdown)
        self.algo_dd = Dropdown((20, 70, 220, 36), ["Bubble","Selection","Insertion","Merge","Quick"], 0, font=self.font)
        self.start_btn = Button((20, 120, 220, 36), "▶ Start", self.start, font=self.font)
        self.reset_btn = Button((20, 168, 220, 36), "⟳ Reset", self.reset_array, font=self.font)

        # mode switch + ds dropdown
        self.mode_btn = Button((20, 20, 220, 36), "Switch to Data Structures", self.toggle_mode, font=self.font)
        self.ds_dd = Dropdown((20, 70, 220, 36), ["Array","Stack","Queue","LinkedList","Tree","Graph"], 0, font=self.font)

        # DS CRUD groups
        self.crud_buttons = {
            "Stack": [
                Button((20, 216, 100, 34), "Push", self.push_stack, font=self.font),
                Button((140, 216, 100, 34), "Pop", self.pop_stack, font=self.font),
            ],
            "Queue": [
                Button((20, 260, 100, 34), "Enq", self.enqueue, font=self.font),
                Button((140, 260, 100, 34), "Deq", self.dequeue, font=self.font),
            ],
            "LinkedList": [
                Button((20, 216, 100, 34), "Append", self.ll_append, font=self.font),
                Button((140, 216, 100, 34), "Delete", self.ll_delete, font=self.font),
            ],
            "Graph": [
                Button((20, 300, 100, 34), "AddNode", self.add_node, font=self.font),
                Button((140, 300, 100, 34), "AddEdge", self.add_edge, font=self.font),
                Button((20, 344, 220, 34), "DeleteNode", self.del_node, font=self.font),
            ]
        }

        # search box for arrays/stacks/queues etc.
        self.search_box = TextBox((20, 380, 120, 34), self.font, text="", placeholder="value")
        self.search_btn = Button((150, 380, 90, 34), "Search", self.search_value, font=self.font)
        self.search_result = ""   # textual result displayed

        # graph: two boxes (Node1, Node2) and Find Path
        self.node1_box = TextBox((20, 420, 90, 34), self.font, text="", placeholder="Node1")
        self.node2_box = TextBox((140, 420, 90, 34), self.font, text="", placeholder="Node2")
        self.find_path_btn = Button((20, 464, 210, 34), "Find Path", self.find_path, font=self.font)
        self.path_result = ""

        # algorithm internals
        self.array = [random.randint(10, 200) for _ in range(self.array_size)]
        self.generator = None
        self.highlight = {}

        # DS instances
        self.reset_data_structures()

    def reset_data_structures(self):
        canvas = pygame.Rect(270,0, WIDTH-270, HEIGHT)
        self.ds_array = ArrayVisualizer([random.randint(1,99) for _ in range(10)])
        self.ds_stack = StackVisualizer()
        for v in [5,12,23]: self.ds_stack.push(v)
        self.ds_queue = QueueVisualizer()
        for v in [11,22,33]: self.ds_queue.enqueue(v)
        self.ds_ll = LinkedListVisualizer()
        for v in [7,17,27]: self.ds_ll.append(v)
        self.ds_tree = TreeVisualizer()
        for v in [50,30,70,20,40,60,80]: self.ds_tree.insert(v)
        self.ds_graph = GraphVisualizer()
        # create some nodes inside canvas
        for _ in range(5): self.ds_graph.add_node(area=canvas)
        ids = list(self.ds_graph.nodes.keys())
        for i in range(len(ids)-1): self.ds_graph.add_edge(ids[i], ids[i+1])

    # ------------------- mode / algorithm controls -------------------
    def toggle_mode(self):
        if self.mode == "Algorithm":
            self.mode = "DataStructure"
            self.mode_btn.text = "Switch to Algorithms"
        else:
            self.mode = "Algorithm"
            self.mode_btn.text = "Switch to Data Structures"

    def start(self):
        if self.mode != "Algorithm":
            return
        algo = self.algo_dd.value
        if algo == "Bubble":
            self.generator = bubble_sort.bubble_sort(self.array)
        elif algo == "Selection":
            self.generator = selection_sort.selection_sort(self.array)
        elif algo == "Insertion":
            self.generator = insertion_sort.insertion_sort(self.array)
        elif algo == "Merge":
            self.generator = merge_sort.merge_sort(self.array)
        elif algo == "Quick":
            self.generator = quick_sort.quick_sort(self.array)

    def reset_array(self):
        self.array = [random.randint(10, 200) for _ in range(self.array_size)]
        self.generator = None
        self.highlight = {}

    # ------------------- DS CRUD callbacks -------------------
    def push_stack(self):
        self.ds_stack.push(random.randint(1,99))
    def pop_stack(self):
        self.ds_stack.pop()
    def enqueue(self):
        self.ds_queue.enqueue(random.randint(1,99))
    def dequeue(self):
        self.ds_queue.dequeue()
    def ll_append(self):
        self.ds_ll.append(random.randint(1,99))
    def ll_delete(self):
        if self.ds_ll.head:
            self.ds_ll.head = self.ds_ll.head.next
    def add_node(self):
        canvas = pygame.Rect(270,0, WIDTH-270, HEIGHT)
        self.ds_graph.add_node(area=canvas)
    def add_edge(self):
        ids = list(self.ds_graph.nodes.keys())
        if len(ids) >= 2:
            self.ds_graph.add_edge(random.choice(ids), random.choice(ids))
    def del_node(self):
        ids = list(self.ds_graph.nodes.keys())
        if ids:
            self.ds_graph.delete_node(ids[-1])

    # ------------------- search & results -------------------
    def search_value(self):
        self.search_result = ""
        txt = self.search_box.text.strip()
        if not txt:
            self.search_result = "Enter value!"
            return
        ds = self.ds_dd.value
        try:
            val = int(txt)
        except ValueError:
            self.search_result = "Invalid number!"
            return

        # find in each DS and display front & reverse indexes for array/stack/queue
        if ds == "Array":
            arr = getattr(self.ds_array, "data", [])
            if val in arr:
                f = arr.index(val)
                b = - (arr[::-1].index(val) + 1)
                self.search_result = f"Found at {f} | {b}"
            else:
                self.search_result = "Not found"
        elif ds == "Stack":
            vals = list(self.ds_stack.items)
            if val in vals:
                # top->bottom indexing: top index 0 -> so we reverse list for front indexing
                f = vals[::-1].index(val)
                b = - (vals[::-1][::-1].index(val) + 1) if vals else "N/A"
                self.search_result = f"{val} at {f} | { - (vals[::-1].index(val) + 1)}"
            else:
                self.search_result = "Not found"
        elif ds == "Queue":
            vals = list(self.ds_queue.items)
            if val in vals:
                f = vals.index(val)
                b = - (vals[::-1].index(val) + 1)
                self.search_result = f"{val} at {f} | {b}"
            else:
                self.search_result = "Not found"
        elif ds == "LinkedList":
            vals = self.ds_ll.to_list()
            if val in vals:
                f = vals.index(val)
                b = - (vals[::-1].index(val) + 1)
                self.search_result = f"{val} at {f} | {b}"
            else:
                self.search_result = "Not found"
        elif ds == "Tree":
            found = self.ds_tree.search(val)
            if found:
                self.search_result = f"Found {val}"
            else:
                self.search_result = "Not found"
        elif ds == "Graph":
            # graph expects "u,v" in search box; for graph we use separate Node1/Node2 boxes instead
            self.search_result = "Use Node1/Node2 boxes for Graph"
            return

    # ------------------- graph path finder -------------------
    def find_path(self):
        a = self.node1_box.text.strip()
        b = self.node2_box.text.strip()
        if not a or not b:
            self.path_result = "Enter BOTH node ids"
            return
        try:
            u = int(a); v = int(b)
        except ValueError:
            self.path_result = "Node ids must be integers"
            return
        if u not in self.ds_graph.nodes or v not in self.ds_graph.nodes:
            self.path_result = "One or both node ids not present"
            return
        path, dist = self.ds_graph.dijkstra(u, v)
        if not path:
            self.path_result = f"No path {u}->{v}"
        else:
            self.path_result = f"Path: {path}  Dist: {dist}"

    # ------------------- event handling -------------------
    def handle_event(self, e):
        # top buttons
        self.mode_btn.handle(e)
        if self.mode == "Algorithm":
            self.algo_dd.handle(e)
            # Start and Reset below dropdown
            self.start_btn.handle(e)
            self.reset_btn.handle(e)
        else:
            self.ds_dd.handle(e)
            # DS-specific CRUD buttons
            for b in self.crud_buttons.get(self.ds_dd.value, []):
                if b.handle(e): return
            # Graph-specific UI
            if self.ds_dd.value == "Graph":
                self.node1_box.handle(e)
                self.node2_box.handle(e)
                if self.find_path_btn.handle(e): return
            else:
                # generic search UI
                self.search_box.handle(e)
                if self.search_btn.handle(e): return

        # handle textbox typing (keystrokes captured by textbox.handle)
        if e.type == pygame.KEYDOWN:
            # arrow keys speed control for algorithm
            if e.key == pygame.K_LEFT:
                self.sort_delay = min(1000, getattr(self, "sort_delay", 200) + 50)
            elif e.key == pygame.K_RIGHT:
                self.sort_delay = max(10, getattr(self, "sort_delay", 200) - 50)
            elif e.key == pygame.K_UP:
                self.array_size = min(100, self.array_size + 5)
                self.reset_array()
            elif e.key == pygame.K_DOWN:
                self.array_size = max(5, self.array_size - 5)
                self.reset_array()

    # ------------------- update -------------------
    def update(self, dt):
        if self.generator:
            now = pygame.time.get_ticks()
            if now - getattr(self, "last_step_time", 0) >= getattr(self, "sort_delay", 200):
                try:
                    self.highlight = next(self.generator)
                except StopIteration:
                    self.generator = None
                self.last_step_time = now

    # ------------------- draw -------------------
    def draw(self):
        self.screen.fill(BG)
        pygame.draw.rect(self.screen, PANEL_BG, (0, 0, 270, HEIGHT))
        # top left controls
        self.mode_btn.draw(self.screen)

        if self.mode == "Algorithm":
            self.algo_dd.draw(self.screen, "Algorithm")
            # start/reset below dropdown (non-overlapping)
            self.start_btn.draw(self.screen)
            self.reset_btn.draw(self.screen)
            # show info at bottom of panel
            info = f"Delay: {getattr(self,'sort_delay',200)}ms | Size: {self.array_size}"
            txt = self.font.render(info, True, (255,255,200))
            self.screen.blit(txt, (20, HEIGHT - 40))
        else:
            # Data Structure mode
            self.ds_dd.draw(self.screen, "Data Structure")
            # render appropriate CRUD buttons
            for b in self.crud_buttons.get(self.ds_dd.value, []):
                b.draw(self.screen)

            # Graph special UI: node boxes & find button
            if self.ds_dd.value == "Graph":
                self.node1_box.draw(self.screen)
                self.node2_box.draw(self.screen)
                self.find_path_btn.draw(self.screen)
                # show path result on left panel
                if self.path_result:
                    p_surf = self.font.render(self.path_result, True, (255,255,0))
                    self.screen.blit(p_surf, (18, 510))
            else:
                # generic DS search UI
                self.search_box.draw(self.screen)
                self.search_btn.draw(self.screen)
                if self.search_result:
                    s_surf = self.font.render(self.search_result, True, (255,255,0))
                    self.screen.blit(s_surf, (18, 460))

        # right canvas
        canvas = pygame.Rect(270, 0, WIDTH - 270, HEIGHT)
        # draw background for canvas
        pygame.draw.rect(self.screen, (28,28,36), canvas)

        if self.mode == "Algorithm":
            self.draw_bars(canvas)
        else:
            ds = self.ds_dd.value
            # Pass highlight dict or state depending on DS
            if ds == "Array":
                # draw array with highlight if the generator set it
                self.ds_array.draw(self.screen, canvas, highlight_indices=self.highlight)
                # if there is a search result with indexes, also display front/rev labels on canvas
                if self.search_result and "Found" in self.search_result or (" at " in self.search_result):
                    # try parse numbers shown earlier (we set "Found x at i" or "x at f | b")
                    try:
                        left = self.search_result
                        lab = self.font.render("findexing / bindexing:", True, (255,255,200))
                        self.screen.blit(lab, (canvas.x + 20, canvas.y + 20))
                        # also display search_result itself below
                        r = self.font.render(self.search_result, True, (200,255,160))
                        self.screen.blit(r, (canvas.x + 20, canvas.y + 44))
                    except Exception:
                        pass
            elif ds == "Stack":
                self.ds_stack.draw(self.screen, canvas)
                if self.search_result:
                    r = self.font.render(self.search_result, True, (200,255,160))
                    self.screen.blit(r, (canvas.x + 20, canvas.y + 20))
            elif ds == "Queue":
                self.ds_queue.draw(self.screen, canvas)
                if self.search_result:
                    r = self.font.render(self.search_result, True, (200,255,160))
                    self.screen.blit(r, (canvas.x + 20, canvas.y + 20))
            elif ds == "LinkedList":
                self.ds_ll.draw(self.screen, canvas)
                if self.search_result:
                    r = self.font.render(self.search_result, True, (200,255,160))
                    self.screen.blit(r, (canvas.x + 20, canvas.y + 20))
            elif ds == "Tree":
                self.ds_tree.draw(self.screen, canvas)
                if self.ds_tree.highlight_val is not None:
                    found_surf = self.font.render(f"Highlighted: {self.ds_tree.highlight_val}", True, (255,255,0))
                    self.screen.blit(found_surf, (canvas.x + 20, canvas.y + 20))
                elif self.search_result:
                    r = self.font.render(self.search_result, True, (200,255,160))
                    self.screen.blit(r, (canvas.x + 20, canvas.y + 20))
            elif ds == "Graph":
                self.ds_graph.draw(self.screen, canvas)
                # draw path result label near graph (canvas right area)
                if self.path_result:
                    pr = self.font.render(self.path_result, True, (255,255,0))
                    # near top-right of canvas
                    self.screen.blit(pr, (canvas.right - pr.get_width() - 20, canvas.y + 10))

    def draw_bars(self, area):
        if not self.array: return
        w = max(2, (area.w - 40)//len(self.array))
        max_v = max(self.array)
        for i, v in enumerate(self.array):
            h = int((v / max_v) * (area.h - 40))
            x = area.x + 10 + i * w
            y = area.bottom - h - 10
            color = (100,160,250)
            if i in self.highlight:
                role = self.highlight[i]
                if role == "swap": color = (240,80,80)
                elif role == "compare": color = (250,210,90)
                elif role == "sorted": color = (90,200,120)
            pygame.draw.rect(self.screen, color, (x, y, max(1, w - 2), h), border_radius=4)
