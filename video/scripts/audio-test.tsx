// Offline audio integration check. Test tones only; never a final speech export.
import {registerRoot,Composition,AbsoluteFill,Audio,staticFile} from 'remotion';
import {AIVoiceClip} from '../src/video/components/AIVoiceClip';
const Test=()=> <AbsoluteFill style={{background:'#173754',color:'white',fontSize:50,padding:100}}><div>AUDIO PIPELINE TEST<br/>Temporary test tones<br/>Not TTS / Not final video</div><Audio src={staticFile('audio/.validation-ai/test.wav')} volume={.1}/><AIVoiceClip clip={{id:'temporary-test',text:'TEST TONE',rawFile:'/audio/.validation-ai/test.wav',processedFile:'/audio/.validation-ai/test.wav',startFrame:30,volume:.8,durationInFrames:31}} variant="processed" gain={1} humanPresent humanWindows={[{startFrame:35,endFrame:50}]}/></AbsoluteFill>;
registerRoot(()=> <Composition id="AudioIntegrationCheck" component={Test} width={1080} height={1920} fps={30} durationInFrames={90}/>);
