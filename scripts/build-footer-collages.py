from pathlib import Path
from PIL import Image,ImageOps
from io import BytesIO
import re,base64
root=Path(__file__).resolve().parents[1]
def load(path):
 p=root/path
 if p.suffix=='.svg':
  raw=base64.b64decode(re.search(r'data:image/jpeg;base64,([^\"]+)',p.read_text()).group(1));im=Image.open(BytesIO(raw))
 else:im=Image.open(p)
 # Use only the photographic area of the wedding story image, without its UI.
 if path == 'assets/previews/wedding-current.webp': im=im.crop((0,240,int(im.width*.52),im.height))
 return im.convert('RGB')
compositions={
 'lets':[(290,'assets/previews/wedding-current.webp',(.42,.6)),(190,'work/saint-city-chapel/images/worship-leading.svg',(.5,.45))],
 'build':[(240,'work/saint-city-chapel/images/worship-team.svg',(.65,.72)),(160,'work/saint-city-chapel/images/apparel-line.svg',(.5,.5)),(200,'work/saint-city-chapel/images/jersey-onstage.svg',(.5,.4))],
 'something':[(460,'work/saint-city-chapel/images/hoodie-worn.svg',(.5,.6)),(390,'work/saint-city-chapel/images/hoodie-wraparound.svg',(.5,.5)),(350,'work/saint-city-chapel/images/production-booth.svg',(.5,.65))],
 'awesome':[(550,'work/saint-city-chapel/images/hoodie-detail.svg',(.5,.5)),(550,'work/saint-city-chapel/images/jersey-collection.svg',(.5,.6))]
}
used=[]
for word,panels in compositions.items():
 canvas=Image.new('RGB',(sum(p[0] for p in panels),240));x=0
 for width,path,focus in panels:
  assert path.startswith('work/saint-city-chapel/images/') or path == 'assets/previews/wedding-current.webp'
  used.append(path);tile=ImageOps.fit(load(path),(width,240),method=Image.Resampling.LANCZOS,centering=focus);canvas.paste(tile,(x,0));x+=width
 canvas.save(root/('assets/previews/footer-'+word+'.webp'),quality=88)
assert len(used)==len(set(used))==10
print('Created four unique compositions from 10 distinct story photographs; no repeated frames.')
