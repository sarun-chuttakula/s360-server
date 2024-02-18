export interface IClassesRequest {
  name: string;
  year: number;
}

export const classesResponseFields = {
  id: undefined,
  name: undefined,
  year: undefined,
};

export interface IClassesResponse {
  id: string;
  name: string;
  year: number;
}

export interface IClassesUpdateRequest {
  name: string;
  year: number;
}

export const ClassesUpdateResponseFields = {
  id: undefined,
  name: undefined,
  year: undefined,
};

export interface IClassesUpdateResponse {
  id: string;
  name: string;
  year: number;
}

export const getAllClassesResponseFields = {
  id: undefined,
  name: undefined,
  year: undefined,
};

export interface IGetAllClassesResponse {
  id: string;
  name: string;
  year: number;
}

export interface IGetAllClassesRequest {
  id: string;
}

export interface IClassesDeleteRequest {
  id: string;
}

export const ClassesDeleteResponseFields = {
  message: undefined,
};

export interface IClassesDeleteResponse {
  message: string;
}
