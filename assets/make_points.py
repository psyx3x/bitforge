"""Escanea un logo (dragón sobre fondo azul) y genera puntos de la silueta
en coordenadas 0..100, listos para bg-figures.js. Guardo el JSON en assets/points.json."""
import json
from PIL import Image
import numpy as np

SRC = "assets/kali-logo.png"
OUT = "assets/points.json"

img = Image.open(SRC).convert("RGB")
w, h = img.size
arr = np.asarray(img).astype(float)

# El dragón es BLANCO sobre azul. Detectamos pixeles claros (blanco).
# blanco => R,G,B altos y similares. Usamos luminancia y "blancura".
lum = arr.mean(axis=2)
white_mask = (lum > 180) & (arr[:, :, 0] > 150) & (arr[:, :, 1] > 150) & (arr[:, :, 2] > 150)

ys, xs = np.where(white_mask)
print(f"pixeles blancos: {len(xs)} de {w*h}")

# Muestreo uniforme: dividimos en una rejilla y tomamos el centroide del
#像素 blanco mas cercano en cada celda para que los puntos queden repartidos.
GRID = 30  # nº de columnas de la rejilla -> controla densidad
points = []
cell_w = w / GRID
cell_h = h / GRID
# para cada celda, si hay algun pixel blanco, guardamos el promedio de esos pixeles
from collections import defaultdict
cell_pts = defaultdict(list)
for x, y in zip(xs, ys):
    ci = int(x // cell_w)
    cj = int(y // cell_h)
    cell_pts[(ci, cj)].append((x, y))

# también añadimos puntos extra sobre bordes finos: tomar el pixel blanco mas
# cercano al centro de celdas vacías adyacentes a una llena (opcional). Nos
# quedamos con las celdas que tienen pixeles.
for (ci, cj), pts in cell_pts.items():
    pts = np.array(pts, dtype=float)
    cx = pts[:, 0].mean()
    cy = pts[:, 1].mean()
    # coordenadas 0..100 (y invertido porque imagen y=0 arriba)
    nx = (cx / w) * 100
    ny = (cy / h) * 100
    points.append({"x": round(nx, 1), "y": round(ny, 1)})

# recortar a un poligono razonable: el dragón ocupa casi todo, lo dejamos.
# ordenar por x para que la malla quede coherente
points.sort(key=lambda p: (round(p["y"] / 4), p["x"]))
print(f"puntos generados: {len(points)}")

with open(OUT, "w") as f:
    json.dump(points, f)
print(f"guardado en {OUT}")
# muestra un mini-ascii para verificar forma
grid = [[" "]*50 for _ in range(25)]
for p in points:
    gx = int(p["x"]/100*49)
    gy = int(p["y"]/100*24)
    grid[gy][gx] = "#"
print("\n".join("".join(r) for r in grid))
