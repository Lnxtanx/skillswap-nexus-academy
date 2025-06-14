
import { LevelConfig } from './types';

export const CODE_SNIPPETS = {
  'function': ['function()', 'const fn = ()', 'arrow => {}', 'def func():', 'func()', 'async fn()', 'yield*', 'return'],
  'variable': ['let x =', 'const y =', 'var z =', 'int x =', 'string y =', 'bool flag', 'array[]', 'object{}'],
  'loop': ['for()', 'while()', 'forEach()', 'map()', 'filter()', 'reduce()', 'do...while', 'for...in'],
  'condition': ['if()', 'else', 'switch', 'case:', '? :', 'try...catch', 'throw', 'finally'],
  'keyword': ['return', 'break', 'continue', 'import', 'export', 'class', 'extends', 'implements']
};

export const CATEGORIES = Object.keys(CODE_SNIPPETS);
export const DIRECTIONS = ['left', 'right', 'top', 'bottom'];

export const LEVELS: LevelConfig[] = [
  { level: 1, speed: 0.3, particleCount: 100, timeLimit: 120 },
  { level: 2, speed: 0.4, particleCount: 130, timeLimit: 150 },
  { level: 3, speed: 0.5, particleCount: 160, timeLimit: 180 },
  { level: 4, speed: 0.6, particleCount: 200, timeLimit: 200 },
  { level: 5, speed: 0.7, particleCount: 250, timeLimit: 240 }
];
