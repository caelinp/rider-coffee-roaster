// orderItem.ts

interface OrderItem {
    id: number;
    product: string;
    quantity: number;
  }

class CoffeeBagOrderItem implements OrderItem {
  id: number;
  product: string;
  quantity: number;
  price: number;
  groundSize: string;
  bagSize: string;

  constructor(
    id: number,
    product: string,
    quantity: number,
    price: number,
    groundSize: string,
    bagSize: string
  ) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
    this.price = price;
    this.groundSize = groundSize;
    this.bagSize = bagSize;
  }
}

export default CoffeeBagOrderItem;
export type { OrderItem };
  