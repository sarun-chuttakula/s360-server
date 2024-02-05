export interface INewNoticeboardRequest {
  title: string;
  description: string;
  image: string;
}

export const newNoticeboardResponseFields = {
  id: undefined,
  title: undefined,
  description: undefined,
  image: undefined,
};

export interface INewNoticeboardResponse {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface INoticeboardUpdateRequest {
  title: string;
  description: string;
  image: string;
}

export const NoticeboardUpdateResponseFields = {
  id: undefined,
  title: undefined,
  description: undefined,
  image: undefined,
};

export interface INoticeboardUpdateResponse {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface INoticeboardDeleteRequest {
  id: string;
}

export const NoticeboardDeleteResponseFields = {
  id: undefined,
};

export interface INoticeboardDeleteResponse {
  id: string;
}
