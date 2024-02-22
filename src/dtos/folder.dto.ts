export interface ICreateFolder {
  location: string;
  class: string;
}

export const createFolderResponseFields = {
  id: undefined,
  location: undefined,
  class: undefined,
};

export interface ICreateFolderResponse {
  id: string;
  location: string;
  class: string;
}

export interface IDeleteFolder {
  id: string;
}

export interface IDeleteFolderResponse {
  message: string;
}

export const deleteFolderResponseFields = {
  message: undefined,
};
