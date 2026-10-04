import {Component,type ReactNode} from 'react';
export class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 render(){if(this.state.failed)return <main className="route-loading" role="alert"><h1>Workspace could not render</h1><p className="body-note">Reload the page. If the problem persists, check your backend connection and browser console.</p><button className="button primary" onClick={()=>window.location.reload()}>Reload workspace</button></main>;return this.props.children}
}
