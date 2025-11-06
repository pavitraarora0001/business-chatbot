
export enum ChatMode {
  STANDARD = 'STANDARD',
  QUICK = 'QUICK',
  DEEP_THOUGHT = 'DEEP_THOUGHT',
  WEB_SEARCH = 'WEB_SEARCH',
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  sources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}
