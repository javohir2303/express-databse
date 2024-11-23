import fs from "node:fs/promises";

class Repository {
  #dir;
  constructor(dir) {
    this.#dir = dir;
  }

  async read() {
    try {
      const data = await fs.readFile(this.#dir, "utf8");
      return JSON.parse(data || "[]");
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  async write(data) {
    await fs.writeFile(this.#dir, JSON.stringify(data, null, 4), "utf8");
  }
}

export { Repository };
