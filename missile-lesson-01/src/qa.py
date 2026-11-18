import json,subprocess,sys,os,glob
name=sys.argv[1]; mode=sys.argv[2] if len(sys.argv)>2 else 'ends'
B=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','build'); Q=os.path.join(B,'qa',name); os.makedirs(Q,exist_ok=True)
mp4=os.path.join(B,name+'.mp4')
if not os.path.exists(mp4): mp4=os.path.join(B,'..',name+'.mp4')
P=json.load(open(os.path.join(B,name+'.plan.json')))
if mode=='ends': ts=[(p['id'],p['start']+p['dur']-0.4) for p in P]
else:
    tot=P[-1]['start']+P[-1]['dur']; step=float(mode); ts=[('%04d'%t,t) for t in range(10,int(tot),int(step))]
files=[]
for i,(n,t) in enumerate(ts):
    f=os.path.join(Q,f'{mode}_{i:03d}_{n}.jpg'); files.append(f)
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss',f'{t:.2f}','-i',mp4,'-frames:v','1','-vf','scale=960:-1','-q:v','3',f])
for g in range(0,len(files),6):
    chunk=files[g:g+6]; ins=[]
    for f in chunk: ins+=['-i',f]
    out=os.path.join(Q,f'sheet_{mode}_{g//6:02d}.jpg')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',*ins,'-filter_complex',f'xstack=inputs={len(chunk)}:layout='+'|'.join(['0_0','w0_0','0_h0','w0_h0','0_h0+h1','w0_h0+h1'][:len(chunk)]) if len(chunk)>1 else 'null','-frames:v','1','-q:v','3',out])
    print(out, [os.path.basename(f) for f in chunk])
