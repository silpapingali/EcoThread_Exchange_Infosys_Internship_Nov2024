export interface TradeItem {
    _id?: string; // Optional since the backend typically generates it
    title: string;
    
    size: string;
    condition: string;
    preferences: string;
    created_by: string;
    createdByusername: string;
    created_on: Date;
   
  }
  