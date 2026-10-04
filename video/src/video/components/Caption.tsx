import {useCurrentFrame} from 'remotion';
import {captions} from '../data/captions';
export const Caption=()=>{const f=useCurrentFrame();const cue=captions.find(c=>f>=c.startFrame&&f<c.endFrame);return cue?<div style={{position:'absolute',left:100,right:190,top:1390,textAlign:'center',fontFamily:'Arial,sans-serif',fontSize:38,fontWeight:800,lineHeight:1.2,color:'white',background:'#102b47ed',padding:'20px 26px',borderRadius:14}}>{cue.text}</div>:null;};
