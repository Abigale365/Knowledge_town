"""Static CSS cascade/inheritance check. Not a browser hit-test or rendering test."""
from html.parser import HTMLParser
from pathlib import Path
import json,re,subprocess
class Node:
    def __init__(self,tag,attrs,parent=None):self.tag=tag;self.attrs=dict(attrs);self.parent=parent;self.children=[]
class Parser(HTMLParser):
    def __init__(self):super().__init__();self.root=Node('document',{});self.stack=[self.root]
    def handle_starttag(self,tag,attrs):
        n=Node(tag,attrs,self.stack[-1]);n.parent.children.append(n)
        if tag not in ['img','input','br','hr','meta','link']:self.stack.append(n)
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:self.stack=self.stack[:i];break

def simple(node,s):
    if ':' in s or '[' in s:return False
    tag=re.match(r'^[\w-]+|^\*',s)
    if tag and tag[0]!='*' and node.tag!=tag[0]:return False
    return all(node.attrs.get('id')==x for x in re.findall(r'#([\w-]+)',s)) and all(x in node.attrs.get('class','').split() for x in re.findall(r'\.([\w-]+)',s))
def matches(node,selector):
    tokens=re.sub(r'\s*>\s*',' > ',selector.strip()).split()
    def walk(n,i):
        if n is None or i<0:return False
        if not simple(n,tokens[i]):return False
        if i==0:return True
        if tokens[i-1]=='>':return walk(n.parent,i-2)
        p=n.parent
        while p:
            if walk(p,i-1):return True
            p=p.parent
        return False
    return bool(tokens) and walk(node,len(tokens)-1)
css='\n'.join(Path('dist',f).read_text() for f in ['world.css','town.css']);rules=[]
for order,(selectors,body) in enumerate(re.findall(r'([^{}]+)\{([^{}]*)\}',css)):
    for prop,value in re.findall(r'(pointer-events|z-index)\s*:\s*([^;}]+)',body):
        for selector in selectors.split(','):
            selector=selector.strip();important='!important' in value;v=value.replace('!important','').strip();specificity=(len(re.findall(r'#[\w-]+',selector)),len(re.findall(r'\.[\w-]+',selector)),len(re.findall(r'(?<![.#\w-])[a-zA-Z][\w-]*',selector)))
            rules.append((selector,prop,v,(important,*specificity,order)))
def computed(node,prop):
    candidates=[(priority,value) for selector,p,value,priority in rules if p==prop and matches(node,selector)]
    if candidates:return max(candidates)[1]
    return computed(node.parent,prop) if prop=='pointer-events' and node.parent else 'auto'
script="(async()=>{const h=await require('./tests/town-harness.cjs')();console.log(JSON.stringify(Object.fromEntries(['features','loot','villagers','stations'].map(id=>[id,h.get(id).innerHTML]))));})()"
fragments=json.loads(subprocess.check_output(['node','-e',script],text=True))
p=Parser();p.feed('<body><div id="world">'+''.join('<div id="'+id+'">'+html+'</div>' for id,html in fragments.items())+'</div></body>')
def flatten(n):return[n]+[x for c in n.children for x in flatten(c)]
buttons=[n for n in flatten(p.root) if n.tag=='button'];blocked=[n.attrs.get('aria-label',n.attrs.get('class')) for n in buttons if computed(n,'pointer-events')=='none']
assert not blocked, 'World buttons inherit disabled pointer events: '+repr(blocked[:8])+f' ({len(blocked)} blocked)'
print(f'PASS: {len(buttons)} world buttons accept pointer events after static CSS cascade/inheritance analysis.')
print('LIMIT: this does not simulate rendered overlap, browser hit-testing, or physical touch.')
by_class=lambda cls:next(n for n in buttons if cls in n.attrs.get('class','').split())
physical,learning,station,npc=(by_class(x) for x in ['world-object','learning-object','world-station','npc'])
z=lambda n:int(computed(n,'z-index'))
assert z(learning)>z(physical)>z(station)
body=next(n for n in flatten(p.root) if n.tag=='body')
for state in ['holding-item','dragging-prop']:
    body.attrs['class']=state
    assert z(station)>z(learning) and z(npc)>z(physical),state
print('PASS: normal search items stay above scene controls; holding/dragging raises receiving targets above search items.')
