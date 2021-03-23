import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class ReorderService {
  dataFetched: boolean;
  order: string[];

  private readonly key = 'listOrder'

  constructor() {
    this.dataFetched = false;
    this.order = [];
  }

  getOrder() : Promise<string[]> {
      return new Promise((resolve, reject) => {
        if (!this.dataFetched) {
          this.getStorage()
              .then(() => {
                this.dataFetched = true;
                resolve([...this.order]);
              })
              .catch(reject);
        }
        else {
          resolve([...this.order]);
        }
      })
    }

  async getStorage() {
    const ret = await Storage.get({ key: this.key });
    this.order = JSON.parse(ret.value);
    if (this.order === null) {
      this.order = [];
    }
  }

  async reorderStorage(newOrder: string[]) {
    this.order = [...newOrder];
    await Storage.set({
      key: this.key,
      value: JSON.stringify(this.order)
    });
  }

  async clear() {
    await Storage.clear();
  }
}
