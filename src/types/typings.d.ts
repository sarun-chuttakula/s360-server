export interface ServerToClientEvents {
  serverMsg: (data: { msg: string;group_id:string }) => void;
}

export interface ClientToServerEvents {
  clientMsg: (data: { msg: string;group_id:string }) => void;
}
