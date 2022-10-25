export const detailsKeys = ['senderId', 'recipientId'] as const;

export type Details = {
  [K in typeof detailsKeys[number]]: number
};
