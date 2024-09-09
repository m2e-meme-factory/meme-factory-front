import { Buffer } from 'buffer';
import process from 'process';
(global as any).Buffer = Buffer;
(global as any).process = process;
