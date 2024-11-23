import  {v4}  from "uuid";

class Fruit {
  constructor(name, count, price) {
    this.id = v4()
    this.name = name;
    this.count = count; 
    this.price = price; 
  }
}

export { Fruit };
