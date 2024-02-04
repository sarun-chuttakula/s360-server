export interface INewGroupRequest {
  name: string;
  description: string;
  admin_id: string;
}

export const newGroupResponseFields = {
  id: undefined,
  name: undefined,
  description: undefined,
  admin_id: undefined,
};

export interface INewGroupResponse {
  id: string;
  name: string;
  description: string;
  admin_id: string;
}

export interface IGroupUpdateRequest {
  name: string;
  description: string;
  admin_id: string;
}

export const GroupUpdateResponseFields = {
  id: undefined,
  name: undefined,
  description: undefined,
  admin_id: undefined,
};

export interface IGroupUpdateResponse {
  id: string;
  name: string;
  description: string;
  admin_id: string;
}

export interface IGroupDeleteRequest {
  id: string;
}

export const GroupDeleteResponseFields = {
  id: undefined,
};

export interface IGroupDeleteResponse {
  id: string;
}
