import { Injectable } from '@angular/core';
import * as localforage from 'localforage';

@Injectable({ providedIn: 'root' })
export class AppStorageService {
  private store: any;

  constructor() {
    this.store = (localforage as any).createInstance({ name: 'uma_estampa_store' });
  }

  async get<T = any>(key: string): Promise<T | null> {
    const v = await this.store.getItem(key);
    return (v as T) ?? null;
  }

  async set(key: string, value: any): Promise<void> {
    await this.store.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    await this.store.removeItem(key);
  }

  async clear(): Promise<void> {
    await this.store.clear();
  }
}
