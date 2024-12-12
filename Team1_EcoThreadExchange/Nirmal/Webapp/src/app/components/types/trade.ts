export interface Trade {
    _id?: string;
    title: string;
    size:string;
    condition:string;
    createdOn: string;
    preferences: string[]; // Ensure this is an array of strings
    offeredBy: string[];  // Ensure this is an array of strings
    image: string;
    page: number;
    pageSize: number;
    pageIndex:number;
    contentType: string;
    data: string;
  }