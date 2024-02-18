export interface INewFeeDetailsRequest {
  amount: number;
  transaction_id: string;
  ht_no: string;
}

export const newFeeDetailsResponseFields = {
  amount: undefined,
  transaction_id: undefined, //missingstudents
  is_paid: undefined,
  payment_date: undefined,
};

export interface INewFeeDetailsResponse {
  message: string;
  amount: number;
  transaction_id: string;
  is_paid: boolean;
  payment_date: Date;
}
