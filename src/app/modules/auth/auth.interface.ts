export type TLogin = {
  name: string;
  email: string;
  password: string;
  profileImage: string;
  status?: 'active' | 'block';
};
