export interface HouseOperationLog {
  id: number;
  operation_type: number;
  house_id: string;
  operation_content: {
    [key: string]: {
      before: any;
      after: any;
    };
  };
  operator_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface SaleLowPrice {
  after: number;
  before: number;
}

export interface Stairs {
  after: After;
  before: any;
}

export interface After {}
