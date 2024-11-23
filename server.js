import express from "express";
import { Repository } from "./lib/repository.js";
import path from "node:path";
import { ResData } from "./lib/resData.js";
import { Fruit } from "./lib/fruitEntity.js";

const fruitDir = path.resolve("database", "fruit.json");
const repository = new Repository(fruitDir);

const server = express();

server.use(express.json());

server.get("/fruit", async (req, res) => {
  try {
    const fruits = await repository.read();
    const resData = new ResData(200, "Fruits retrieved successfully", fruits);
    res.status(200).json(resData);
  } catch (error) {
    res.status(500).json(new ResData(500, "Internal Server Error", error.message));
  }
});

server.get("/fruit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fruits = await repository.read();
    const fruit = fruits.find(f => f.id === id);

    if (!fruit) {
      return res.status(404).json(new ResData(404, "Fruit not found", null));
    }

    res.status(200).json(new ResData(200, "Fruit retrieved successfully", fruit));
  } catch (error) {
    res.status(500).json(new ResData(500, "Internal Server Error", error.message));
  }
});


server.post("/fruit", async (req, res) => {
  try {
    const { name, count, price } = req.body;

    if (!name || !count || !price) {
      return res.status(400).json(new ResData(400, "Invalid data", null));
    }

    const fruits = await repository.read();
    const newFruit = new Fruit(name, count, price);
    fruits.push(newFruit);
    await repository.write(fruits);

    res.status(201).json(new ResData(201, "Fruit added successfully", newFruit));
  } catch (error) {
    res.status(500).json(new ResData(500, "Internal Server Error", error.message));
  }
});

server.put("/fruit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fruits = await repository.read();
    const index = fruits.findIndex(f => f.id === id);

    if (index === -1) {
      return res.status(404).json(new ResData(404, "Fruit not found", null));
    }

    fruits[index] = Object.assign(fruits[index], req.body);
    await repository.write(fruits);

    res.status(200).json(new ResData(200, "Fruit updated successfully", fruits[index]));
  } catch (error) {
    res.status(500).json(new ResData(500, "Internal Server Error", error.message));
  }
});

server.delete("/fruit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fruits = await repository.read();
    const deletedFruit = fruits.find(f => f.id === id);
    const filteredFruits = fruits.filter(f => f.id !== id);

    if (!deletedFruit) {
      return res.status(404).json(new ResData(404, "Fruit not found", null));
    }

    await repository.write(filteredFruits);
    res.status(200).json(new ResData(200, "Fruit deleted successfully", deletedFruit));
  } catch (error) {
    res.status(500).json(new ResData(500, "Internal Server Error", error.message));
  }
});

server.patch("/fruit/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { price } = req.body;

      if (price === undefined) {
        return res.status(400).json(new ResData(400, "Price is required", null));
      }
  
      const fruits = await repository.read();
      const index = fruits.findIndex(f => f.id === id);
  
      if (index === -1) {
        return res.status(404).json(new ResData(404, "Fruit not found", null));
      }
  
      fruits[index].price = price;
  
      await repository.write(fruits);
  
      res.status(200).json(new ResData(200, "Fruit price updated successfully", fruits[index]));
    } catch (error) {
      res.status(500).json(new ResData(500, "Internal Server Error", error.message));
    }
  })

server.listen(7777, () => {
  console.log("Server is running at http://localhost:7777");
});
