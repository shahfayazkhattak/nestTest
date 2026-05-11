export const ACCOUNT_EVENTS = {
  CREATED: 'account.created',
  DEPOSITED: 'account.deposited',
  WITHDRAWN: 'account.withdrawn',
} as const;

export interface AccountCreatedPayload {
  ownerId: string;
}
export interface MoneyMovedPayload {
  amount: number;
}
