import sys, json, numpy as np
from PIL import Image, ImageFilter
from rembg import remove, new_session
sys.path.insert(0,'.')
exec(open('' + __import__('os').path.join(__import__('os').path.dirname(__file__),'treue.py') + '').read().split('def hair')[0])  # lin/srgb/lab/unlab
S=new_session('birefnet-general-lite')
def masked(path, wb):
    im=Image.open(path).convert('RGB'); im.thumbnail((1400,1400)); a=np.asarray(remove(im,session=S,only_mask=True)).astype(float)/255
    rgb=np.asarray(im).astype(float); l=lin(rgb)
    if wb:
        h,w,_=l.shape; b=max(4,int(min(h,w)*.05))
        bd=np.concatenate([l[:b].reshape(-1,3),l[-b:].reshape(-1,3),l[:,:b].reshape(-1,3),l[:,-b:].reshape(-1,3)])
        lum=bd@M[1]; bg=np.median(bd[lum>np.percentile(lum,40)],0); l=l*(bg.mean()/np.maximum(bg,1e-4))
    return im, lab(l), a
def stats(L,a,excl_card):
    m=a>0.6
    if excl_card: m&=~((L[...,0]<32)&(np.hypot(L[...,1],L[...,2])<6))
    return np.percentile(L[m],[10,50,90],axis=0)
JOBS=json.loads(sys.argv[1])  # [[gen,src,out,excl_card,Lfloor],...]
for gen,src,out,excl,floor in JOBS:
    _,Lo,ao=masked(src,True); po=stats(Lo,ao,excl)
    if po[1][0]<floor: d=floor-po[1][0]; po=po.copy(); po[:,0]+=d
    gim,Lg,ag=masked(gen,False); pg=stats(Lg,ag,excl)
    L2=Lg.copy(); s=(po[2][0]-po[0][0])/max(pg[2][0]-pg[0][0],1e-3); s=min(max(s,0.6),1.4)
    L2[...,0]=po[1][0]+(Lg[...,0]-pg[1][0])*s; L2[...,1]+=po[1][1]-pg[1][1]; L2[...,2]+=po[1][2]-pg[1][2]
    w=ag.copy()
    if excl: w=w*~((Lg[...,0]<32)&(np.hypot(Lg[...,1],Lg[...,2])<6))
    w=np.asarray(Image.fromarray((w*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))).astype(float)[...,None]/255
    g=np.asarray(gim).astype(float); o=srgb(unlab(L2))*w+g*(1-w)
    Image.fromarray(np.clip(o,0,255).astype(np.uint8)).save(out,quality=90)
    _,L3,a3=masked(out,False); p3=stats(L3,a3,excl)
    print(f'{out}: Ziel L{po[1][0]:.0f} a{po[1][1]:.1f} b{po[1][2]:.1f} | KI vorher ΔE {np.linalg.norm(po[1]-pg[1]):.1f} | nachher ΔE {np.linalg.norm(po[1]-p3[1]):.1f}',flush=True)
