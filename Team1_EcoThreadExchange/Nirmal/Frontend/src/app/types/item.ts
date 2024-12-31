export interface Item {
    _id: string;        // The unique identifier for the item
    title: string;      // The title of the trade item
    size: string;       // The size of the trade item
    condition: string;  // The condition of the trade item
    preferences: string[] | string;  // The preferences related to the item, can be a string or an array of strings
    offeredBy: string[] | string;   // The list of people who offered the trade, can be a string or an array of strings
    image: string;      // Image filename for the item
    createdOn: string;  // The date when the item was created (ISO date string)
    userId: string;
    isBlocked:string;     // The user ID who posted the item (this could be a reference to a user in the backend)
  }
  