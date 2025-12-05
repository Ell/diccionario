import { promises as fs } from 'fs';
import * as path from 'path';

export interface WordList {
  addWord(word: string): Promise<boolean>;
  getWords(): Promise<string[]>;
  exists(word: string): Promise<boolean>;
}

export class FileWordList implements WordList {
  private readonly filename: string;
  public words: string[] = [];

  constructor(filename: string) {
    this.filename = filename;
  }

  async addWord(word: string): Promise<boolean> {
    await fs.appendFile(this.filename, word, { encoding: 'utf8' });

    this.words.push(word)

    return true;
  }

  async exists(word: string): Promise<boolean> {
    const words = await this.getWords();

    for (const w of words) {
      if (w.toLowerCase() === word.toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  async getWords(): Promise<string[]> {
    if (this.words.length <= 0) {
      const abs = path.resolve(this.filename);
      const data = await fs.readFile(abs, { encoding: 'utf8' });
      this.words = data.split('\n');
    }

    return this.words;
  }
}
