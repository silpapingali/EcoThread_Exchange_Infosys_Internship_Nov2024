export interface Trade {
    _id?: string;
    title: string;
    size:string;
    condition:string;
    createdAt: string;
    preferences: string[]; // Ensure this is an array of strings
    offeredBy: string[];  // Ensure this is an array of strings
    image: string;
    userId:string;
    isBlocked:string;
    status:string;
    proposedBy:string;
  }
  