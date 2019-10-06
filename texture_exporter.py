import bpy

texturePixels = []
for p in bpy.data.images['Untitled'].pixels:
    texturePixels.append(int(p * 255))
    

textureData = "var monkeyTexture = " + str(texturePixels) + ";";    
    
file = open('/Users/dave/Desktop/monkeyPic.js', 'w')
file.write(textureData);
file.close()
