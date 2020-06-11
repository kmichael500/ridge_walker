export interface RegisterUserInterface {
  message: string;
  user: UserInterface;
}

export interface UserInterface {
  _id: string;
  email: string;
  password: string;
  role: userRoleType;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: number;
  phoneNumber: number;
  nssNumber: number;
}

export type userRoleType = 'User' | 'Admin';

const types: userRoleType[] = ['User', 'Admin'];
