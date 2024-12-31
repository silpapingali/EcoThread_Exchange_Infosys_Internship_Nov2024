export interface Traded {
    _id: string;
    userId1: string;
    userId2: string;
    item1: { title: string; description: string }; // Adjust this if the structure differs
    item2: { title: string; description: string }; // Adjust this if the structure differs
    status: string;
    createdAt: string;
  }
  