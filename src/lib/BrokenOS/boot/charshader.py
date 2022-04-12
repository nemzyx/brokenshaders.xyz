from PIL import Image

def getPixels(filename):
    img = Image.open(filename, 'r')
    w, h = img.size
    pix = list(img.getdata())
    return [pix[n:n+w] for n in range(0, w*h, w)]

RGBA_pixels = getPixels('./PIXEL.png')
pixels = []
for row in RGBA_pixels:
  bw_row = []
  for rgba in row:
    bw_row.append(rgba[0])
  pixels.append(bw_row)

def changeRange_INT(v,omin,omax,nmin,nmax):
  return round( ((v-omin)/(omax-omin)) * (nmax-nmin) + nmin )

# FOR EYE
shading = " ▁▁▁▁▁▁▁▁▂▂▃▄▅▆▇███"
cutoffMin = 0
cutoffMax = 5

# FOR BUTTERFLY
# shading = "          -------|"
# cutoffMin = -1
# cutoffMax = 0

L = len(shading) - 1
# changeRange_INT(v,0,255,0,L)
SHADED_IMAGE = ""
JS_STRING =""
for i in range(len(pixels)):
  row = pixels[i]
  chars = ""
  for bw in row:
    idx = changeRange_INT(bw,0,255,L,0)
    chars += shading[idx] * 2
  SHADED_IMAGE += chars + '\n'
  if(i>cutoffMin and i<len(pixels)-cutoffMax):
    JS_STRING += chars + '<br>'

JS_STRING = "export default ()=> `"+ JS_STRING.replace(' ', '&nbsp;') + "`"
f = open("art.js", "w")
f.write(JS_STRING)
f.close()
print(SHADED_IMAGE)
