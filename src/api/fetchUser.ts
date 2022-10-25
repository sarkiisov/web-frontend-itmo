import { User } from '../types/User';

export default async (userId: number) => {
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const user = await fetch(url).then((response) => response.json()) as User;
  return user;
};
