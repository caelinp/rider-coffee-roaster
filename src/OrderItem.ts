// OrderItem.ts

/**
 * Interface for generic order item, can be implemented into a class for any new product type
 */
interface OrderItem {
    id: string; // id of the OrderItem
    productId: string; // id of the product in the OrderItem
    quantity: number;
  }

  /**
   * Class for Coffee Bag Order Item
   */
class CoffeeBagOrderItem implements OrderItem {
  id: string;
  productId: string;
  quantity: number;
  groundSize: string;
  bagSize: string;

  constructor(
    id: string,
    productId: string,
    quantity: number,
    groundSize: string,
    bagSize: string
  ) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.groundSize = groundSize;
    this.bagSize = bagSize;
  }

  // Method to convert an object to a JSON string
  toJSONString(): string {
    return JSON.stringify(this);
  }

  // Static method to create an instance from a JSON string
  static fromJSON(jsonString: string): CoffeeBagOrderItem {
    const parsedObject = JSON.parse(jsonString);
    if (parsedObject) {
      return new CoffeeBagOrderItem(
        parsedObject.id,
        parsedObject.productId,
        parsedObject.quantity,
        parsedObject.groundSize,
        parsedObject.bagSize
      );
    } else {
      throw new Error('Invalid JSON string for CoffeeBagOrderItem');
    }
  }
}

export default CoffeeBagOrderItem;
export type { OrderItem };
  