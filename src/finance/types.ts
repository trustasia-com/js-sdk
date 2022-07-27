
export interface CreateSubscribeReq {
    user_id: string;
    nickname: string;
    product_id: string;
}

export interface CreateSubscribeResp {
    subscribe_id: string;
}