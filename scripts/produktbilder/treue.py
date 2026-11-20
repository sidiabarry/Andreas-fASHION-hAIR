"""Farbtreue: misst Median-Haarfarbe (Lab) im Original (Weißabgleich über Laken) und im generierten Bild,
korrigiert das generierte Haar in Lab auf das Original (a*/b* verschieben, L* skalieren), nur in der Haarmaske."""
import sys, numpy as np
from PIL import Image
sys.argv_backup=sys.argv
M=np.array([[0.4124,0.3576,0.1805],[0.2126,0.7152,0.0722],[0.0193,0.1192,0.9505]]); WH=np.array([0.95047,1,1.08883])
def lin(c): c=c/255; return np.where(c<=0.04045,c/12.92,((c+0.055)/1.055)**2.4)
def srgb(c): c=np.clip(c,0,1); return np.where(c<=0.0031308,c*12.92,1.055*c**(1/2.4)-0.055)*255
def lab(l):
    x=l@M.T/WH; f=np.where(x>216/24389,np.cbrt(x),(24389/27*x+16)/116)
    return np.stack([116*f[...,1]-16,500*(f[...,0]-f[...,1]),200*(f[...,1]-f[...,2])],-1)
def unlab(L):
    fy=(L[...,0]+16)/116; fx=fy+L[...,1]/500; fz=fy-L[...,2]/200
    f=np.stack([fx,fy,fz],-1); x=np.where(f**3>216/24389,f**3,(116*f-16)/(24389/27))*WH
    return x@np.linalg.inv(M).T
def hair(path, wb):
    im=np.asarray(Image.open(path).convert('RGB')).astype(float); l=lin(im); h,w,_=l.shape; b=max(4,int(min(h,w)*.05))
    bd=np.concatenate([l[:b].reshape(-1,3),l[-b:].reshape(-1,3),l[:,:b].reshape(-1,3),l[:,-b:].reshape(-1,3)])
    if wb:
        lum=bd@M[1]; bg=np.median(bd[lum>np.percentile(lum,40)],0); l=l*(bg.mean()/np.maximum(bg,1e-4))
    L=lab(l); bgl=np.median(lab(bd),0) if not wb else lab(np.median(bd[ (bd@M[1])>np.percentile(bd@M[1],40)],0))
    mask=np.linalg.norm(lab(lin(im))-bgl,axis=-1)>18
    return im,L,mask
o,Lo,mo=hair(sys.argv[1],True); g,Lg,mg=hair(sys.argv[2],False)
po=np.percentile(Lo[mo],[10,50,90],axis=0); pg=np.percentile(Lg[mg],[10,50,90],axis=0)
de=np.linalg.norm(po[1]-pg[1]); print(f'vorher: Original L{po[1][0]:.1f} a{po[1][1]:.1f} b{po[1][2]:.1f} | KI L{pg[1][0]:.1f} a{pg[1][1]:.1f} b{pg[1][2]:.1f} | ΔE {de:.1f}')
# Korrektur: L über Perzentile linear abbilden, a/b um Median-Differenz verschieben, weich über Maske
L2=Lg.copy()
s=(po[2][0]-po[0][0])/max(pg[2][0]-pg[0][0],1e-3)
L2[...,0]=po[1][0]+(Lg[...,0]-pg[1][0])*s; L2[...,1]+=po[1][1]-pg[1][1]; L2[...,2]+=po[1][2]-pg[1][2]
from PIL import ImageFilter
m=np.asarray(Image.fromarray((mg*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(float)[...,None]/255
out=srgb(unlab(L2))*m+g*(1-m)
Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save(sys.argv[3],quality=88)
_,L3,m3=hair(sys.argv[3],False); p3=np.median(L3[m3],0); print(f'nachher: KI L{p3[0]:.1f} a{p3[1]:.1f} b{p3[2]:.1f} | ΔE {np.linalg.norm(po[1]-p3):.1f}')
