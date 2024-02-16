export interface INewFeeDetailsRequest {
  amount: number,
  t_id: string,
  ht_no: string,
}

export const newFeeDetailsResponseFields = {
  amount: undefined,
  t_id: undefined, //missingstudents
};

export interface INewFeeDetailsResponse {
  message: string;
}