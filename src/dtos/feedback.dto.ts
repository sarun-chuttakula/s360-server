export interface INewFeedbackRequest {
  title: string;
  description: string;
  image: string;
}

export const newFeedbackResponseFields = {
  id: undefined,
  title: undefined,
  description: undefined,
  image: undefined,
};

export interface INewFeedbackResponse {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface IFeedbackUpdateRequest {
  title: string;
  description: string;
  image: string;
}

export const FeedbackUpdateResponseFields = {
  id: undefined,
  title: undefined,
  description: undefined,
  image: undefined,
};

export interface IFeedbackUpdateResponse {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface IFeedbackDeleteRequest {
  id: string;
}

export const FeedbackDeleteResponseFields = {
  id: undefined,
};

export interface IFeedbackDeleteResponse {
  id: string;
}
