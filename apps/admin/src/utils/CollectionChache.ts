export interface CollectionChacheOptions<T> {
  chacheKey: string;
  getData: (page: number, updated_at?: string) => Promise<T[]>;
  pageSize: number;
}

export class CollectionChache<
  T extends { updated_at?: string; id: string; deleted_at?: string },
> {
  constructor(private options: CollectionChacheOptions<T>) {}

  getChacheMap() {
    try {
      const data = JSON.parse(
        localStorage.getItem(this.options.chacheKey) || "[]"
      ) as T[];
      const map = new Map(data.map((d) => [d.id, d]));
      return map;
    } catch (error) {
      return new Map();
    }
  }

  getChache() {
    try {
      return JSON.parse(
        localStorage.getItem(this.options.chacheKey) || "[]"
      ) as T[];
    } catch (error) {
      return [] as T[];
    }
  }

  updateChache(data: T[]) {
    localStorage.setItem(this.options.chacheKey, JSON.stringify(data));
  }

  // 获取最新的一条
  getLastUpdatedAt() {
    const data = this.getChache();
    data.sort((a, b) => {
      if (a.updated_at && b.updated_at) {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      }
      return 0;
    });
    return data[0]?.updated_at;
  }

  async syncData() {
    const { getData, pageSize } = this.options;
    const result = this.getChacheMap();

    const loopGetData = async (page = 1) => {
      const data = await getData(page, this.getLastUpdatedAt());

      for (const item of data) {
        if (item.deleted_at) {
          result.delete(item.id);
        } else {
          result.set(item.id, item);
        }
      }

      if (data.length < pageSize) {
        return;
      }

      await loopGetData(page + 1);
    };

    await loopGetData();
    const data = Array.from(result.values());
    // 更新缓存
    this.updateChache(Array.from(data));
    return data;
  }

  clear() {
    localStorage.removeItem(this.options.chacheKey);
  }
}
