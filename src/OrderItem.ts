// OrderItem.ts

/**
 * Interface for generic order item, can be implemented into a class for any new product type
 */
interface OrderItem {
    id: string;
    product: string;
    quantity: number;
  }

  /**
   * Class for Coffee Bag Order Item
   */
class CoffeeBagOrderItem implements OrderItem {
  id: string;
  product: string;
  quantity: number;
  groundSize: string;
  bagSize: string;

  constructor(
    id: string,
    product: string,
    quantity: number,
    groundSize: string,
    bagSize: string
  ) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
    this.groundSize = groundSize;
    this.bagSize = bagSize;
  }
}

export default CoffeeBagOrderItem;
export type { OrderItem };
  