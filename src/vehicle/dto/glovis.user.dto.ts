export class UserDto {
  _id: string;
  name: String;
  auth: {
    email: String;
    password: String;
  };
  roles: String[];
  createdAt: string;
  updatedAt: string;
}
