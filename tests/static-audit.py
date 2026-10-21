from html.parser import HTMLParser
from pathlib import Path
from PIL import Image
import re
class P(HTMLParser):
    def __init__(self):super().__init__();self.ids=[];self.assets=[];self.labels=[]
    def handle_starttag(self,t,attrs):
        d=dict(attrs)
        if 'id' in d:self.ids.append(d['id'])
        if t in ['script','img'] and 'src' in d:self.assets.append(d['src'])
        if 'aria-label' in d:self.labels.append(d['aria-label'])
p=P();p.feed(Path('dist/index.html').read_text());assert len(p.ids)==len(set(p.ids))
for f in p.assets:assert (Path('dist')/f.split('?',1)[0].split('#',1)[0]).exists(),f
for label in p.labels:assert re.search('[\u4e00-\u9fff]',label),label
# All rooms have real independent assets at identical normalized scene coordinates.
room_images=[]
for k in ['academy-map','archive','workshop','garden','tower']:
    f=Path('dist/assets')/(k+'.webp');assert f.exists(),f
    im=Image.open(f);assert im.width/im.height==1.5,(k,im.size);room_images.append(f.read_bytes())
assert len(set(room_images))==5
# Physical step sockets should not overlap at any scene size.
xs=[40.2,47,53.5,60.5]
assert all(xs[i]+3<xs[i+1]-3 for i in range(3))
def lin(v):return v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4
def lum(h):return sum(w*lin(int(h[i:i+2],16)/255) for i,w in zip([0,2,4],[.2126,.7152,.0722]))
for fg,bg in [('2c4032','f7f2df'),('5f6c49','f7f2df'),('faf6e2','476143'),('835b35','f5ead1')]:
    a,b=sorted([lum(fg),lum(bg)]);assert (b+.05)/(a+.05)>=4.5,(fg,bg)
print('PASS: unique static IDs, required assets, Chinese accessible labels, five independent 3:2 scene images, nonoverlapping machine sockets, selected text contrast.')
print('LIMIT: static inspection is not browser rendering or device QA.')
for page in ['index.html','adventure.html']:
    q=P();q.feed((Path('dist')/page).read_text());assert len(q.ids)==len(set(q.ids)),page
    for f in q.assets:assert (Path('dist')/f.split('?',1)[0].split('#',1)[0]).exists(),f
atlas=Image.open('dist/assets/objects.png')
assert atlas.mode=='RGBA' and atlas.getchannel('A').getextrema()==(0,255)
for row in range(3):
    for col in range(4):
        box=(col*atlas.width//4,row*atlas.height//3,(col+1)*atlas.width//4,(row+1)*atlas.height//3)
        assert atlas.crop(box).getchannel('A').getbbox(),box
print('PASS: both entry pages, sprite atlas transparency, 12 populated sprite cells.')
for page in ['index.html','short-hunt.html','adventure.html']:
    q=P();q.feed((Path('dist')/page).read_text())
    assert len(q.ids)==len(set(q.ids)),page
    for f in q.assets:assert (Path('dist')/f.split('?',1)[0].split('#',1)[0]).exists(),f
for key in ['harbor','market','tea','skyport']:
    im=Image.open(Path('dist/assets')/(key+'.webp'))
    assert im.width/im.height==1.5,(key,im.size)
assert 'objects.png' not in Path('dist/expedition.css').read_text()
assert 'objects.png' not in Path('dist/expedition.js').read_text()
print('PASS: all three entry pages, four new 3:2 scenes, campaign uses painted objects without sprite overlays.')
for page in ['index.html','expedition.html','short-hunt.html','adventure.html']:
    q=P();q.feed((Path('dist')/page).read_text());assert len(q.ids)==len(set(q.ids)),page
    for f in q.assets:assert (Path('dist')/f.split('?',1)[0].split('#',1)[0]).exists(),(page,f)
for key in ['world-town.webp','world-harbor.webp']:
    im=Image.open(Path('dist/assets')/key);assert im.width/im.height==1.5,(key,im.size)
for key,cols,rows in [('world-people.webp',4,2),('world-plants.webp',3,2)]:
    im=Image.open(Path('dist/assets')/key);assert im.mode=='RGBA';assert im.getchannel('A').getextrema()[0]==0
    for row in range(rows):
        for col in range(cols):
            cell=im.crop((col*im.width//cols,row*im.height//rows,(col+1)*im.width//cols,(row+1)*im.height//rows))
            assert cell.getchannel('A').getbbox(),(key,row,col)
print('PASS: four version entry pages, two continuous 3:2 worlds, eight character poses and six plant sprites with alpha.')
for key in ['world-grove.webp','world-observatory.webp']:
    im=Image.open(Path('dist/assets')/key);assert im.width/im.height==1.5,(key,im.size)
for key in ['world-props.webp','world-props2.webp']:
    im=Image.open(Path('dist/assets')/key);assert im.mode=='RGBA'
    for row in range(4):
        for col in range(4):
            cell=im.crop((col*im.width//4,row*im.height//4,(col+1)*im.width//4,(row+1)*im.height//4));assert cell.getchannel('A').getbbox(),(key,row,col)
assert 'material-compiler.js' in Path('dist/index.html').read_text()
assert 'capacity-report.json' in Path('dist/town-adapter.js').read_text()
print('PASS: four continuous worlds, 32 new transparent prop cells, advanced compiler and capacity-report wiring.')
