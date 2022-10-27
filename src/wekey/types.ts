export interface RegQRCodeReq {
  user_id: string;
  username: string;
  display_name: string;
}

export interface RegQRCodeResp {
  url: string;
  expires_at: number;
}

export interface RegResultReq {
  msg_id: string;
}

export interface RegResultResp {}

export interface AuthRequestReq {
  method: string;
  user_id: string;
  username: string;
}

export interface AuthRequestResp {}

export interface AuthResultReq {
  msg_id: string;
}

export interface AuthResultResp {
  user_id: string;
}
