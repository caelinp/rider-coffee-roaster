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
  subscriptionFrequency: string;

  constructor(
    id: string,
    productId: string,
    quantity: number,
    groundSize: string,
    bagSize: string,
    subscriptionFrequency: string
  ) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
    this.groundSize = groundSize;
    this.bagSize = bagSize;
    this.subscriptionFrequency = subscriptionFrequency;
  }

  // Method to set the id of the order item
  // This should be called before the order item is inserted into a list, and needs to have a unique id
  setOrderId(id: string) {
    this.id = id;
  }

  // Method to set the quantity of this order item
  setOrderQuantity(quantity: number) {
    this.quantity = quantity;
  }

  // Method to set the quantity of this order item
  setOrderGroundSize(groundSize: string) {
    this.groundSize = groundSize;
  }

  // Method to set the quantity of this order item
  setOrderBagSize(bagSize: string) {
    this.bagSize = bagSize;
  }

  // Method to set the subscription frequency of this order item
  setSubscriptionFrequency(subscriptionFrequency: string) {
    this.subscriptionFrequency = subscriptionFrequency;
  }

  // Method to compare two CoffeeBagOrderItem objects for equality (excluding id and quantity)
  isEqualTo(otherItem: CoffeeBagOrderItem): boolean {
    return (
      this.productId === otherItem.productId &&
      this.groundSize === otherItem.groundSize &&
      this.bagSize === otherItem.bagSize &&
      this.subscriptionFrequency === otherItem.subscriptionFrequency
    );
  }

  // Method to add the quantity of another CoffeeBagOrderItem to this item
  addToQuantity(otherItem: CoffeeBagOrderItem): void {
    if (this.isEqualTo(otherItem)) {
      this.quantity += otherItem.quantity;
    } else {
      throw new Error('Items are not equal and cannot be combined.');
    }
  }
  

  // Method to convert an object to a JSON string
  toJSONString(): string {
    return JSON.stringify(this);
  }

  // Constructor to create a CoffeeBagOrderItem from a generic object
  static fromObject(obj: any): CoffeeBagOrderItem {
    return new CoffeeBagOrderItem(
      obj.id,
      obj.productId,
      obj.quantity,
      obj.groundSize,
      obj.bagSize,
      obj.subscriptionFrequency
    );
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
        parsedObject.bagSize,
        parsedObject.subscriptionFrequency
      );
    } else {
      throw new Error('Invalid JSON string for CoffeeBagOrderItem');
    }
  }
}

export default CoffeeBagOrderItem;
export type { OrderItem };
  