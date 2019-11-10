import bpy
from os import system, name

vertexList = []
indexList = []
obj = bpy.context.active_object
polys = obj.data.polygons
vertices = obj.data.vertices
uvs = obj.data.uv_layers[0].data

def clear(): 
    if name == 'nt': 
        system('cls') 
    else: 
        system('clear')
clear()

def addVertex(list, vert):
    for i, tv in enumerate(list):
        if vert == tv:
            return i
    list.append(vert)
    return len(list) - 1

for p in polys:
    indCt = len(indexList)
    for i, v in enumerate(p.vertices):
        pos = []
        norm = []
        uv = []
        
        pos.append(round(vertices[v].co.x, 4))
        pos.append(round(vertices[v].co.y, 4))
        pos.append(round(vertices[v].co.z, 4))
        
        norm.append(round(vertices[v].normal.x, 4))
        norm.append(round(vertices[v].normal.y, 4))
        norm.append(round(vertices[v].normal.z, 4))
            
        uv.append(round(uvs[p.loop_indices[i]].uv.x, 4))
        uv.append(round(uvs[p.loop_indices[i]].uv.y, 4))
        
        vertex = [pos, norm, uv]
        
        if i < 3:
            indexList.append(addVertex(vertexList, vertex))
        else:
            indexList.append(indexList[len(indexList) - 1])
            indexList.append(addVertex(vertexList, vertex))
            indexList.append(indexList[indCt])

nvList = []
for v in vertexList:
    for p in v[0]:
        nvList.append(p)
    for n in v[1]:
        nvList.append(n)
    for u in v[2]:
        nvList.append(u)

fileText = "var monkeyData = ["
fileText += str(nvList) + ","
fileText += str(indexList) + "];\n"
            
file = open('/Users/dave/Desktop/monkey_mesh.js', 'w')
file.write(fileText);
file.close()