
export interface CreateSubscribeReq {
    user_id: string;
    nickname: string;
    product_id: string;
}

export interface CreateSubscribeResp {
    subscribe_id: string;
}

export enum FinanceDo {
    FinanceDoDeliver = "deliver",
    FinanceDoRefund = "refund",
    FinanceDoRenew = "renew",
}

export interface FinanceCallbackReq {
    mch_id: string;
    do: FinanceDo;
    nonce: string;
    content: string;
    sign: string;
}

export interface CallbackContent {
    business_code: string;
    order_id: string;
    user_id: string;
    amount: number;
    class: string;
    note: string;
    product_id: string;
}