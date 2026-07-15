export type Member = {
  id: string;
  name: string;
  avatarKey: string;
};

export type BoardMember = Member & {
  cookieCount: number;
  isLagging: boolean;
};
