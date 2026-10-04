/** Service boundary. Mock mode is the default; a real server is never simulated. */
export const API_MODE = import.meta.env.VITE_API_MODE === 'live' ? 'live' : 'mock';
const BASE = import.meta.env.VITE_API_BASE_URL || '/api';
export async function request<T>(path: string, options?: RequestInit): Promise<T> {
 const response = await fetch(`${BASE}${path}`, {headers:{'Content-Type':'application/json'},...options});
 if (!response.ok) throw new Error(`API request failed (${response.status}). Check the backend connection.`);
 return response.json() as Promise<T>;
}
export async function demoResponse<T>(value:T):Promise<T> {await new Promise(resolve=>setTimeout(resolve,350)); return structuredClone(value);}
