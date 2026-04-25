// ESTADO DE SOLICITUD
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type WithdrawalMethodType = 'BCP' | 'OTHER_BANK' | 'PAYPAL' | 'BYBIT' | 'BINANCE';

// SOLICITUD DE RETIRO
export interface WithdrawalRequest {
    id: string;
    credits: number;
    payoutAmount: number;
    payoutCurrency: string;
    status: WithdrawalStatus;
    methodType: WithdrawalMethodType;
    bankName: string | null;
    accountNumber: string | null;
    paypalEmail: string | null;
    anfitriona: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        phoneNumber: string;
        email: string;
        anfitrionaProfile: {
            avatarUrl: string | null;
            coverUrl: string | null;
        };
    };
    currentBalance: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

// RESPUESTA PAGINADA
export interface WithdrawalRequestsResponse {
    data: WithdrawalRequest[];
    nextCursor: string | null;
}

// ACTUALIZAR ESTADO DE SOLICITUD
export interface UpdateWithdrawalStatusRequest {
    status: WithdrawalStatus;
    rejectionReason?: string;
    receipt?: {
        uri: string;
        name?: string;
        type?: string;
        file?: File;
    };
}

// RESPUESTA DE ACTUALIZACIÓN
export interface UpdateWithdrawalStatusResponse {
    id: string;
    status: WithdrawalStatus;
    receiptUrl?: string;
    updatedAt: string;
}
