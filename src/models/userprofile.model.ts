/* export class UserProfile {
  constructor(
    public uid: string,
    public name: string,
    public role: string,
    public email: string
  ) {}
}
 */
export interface User {
  uid: string;
  email: string;
  name: string;
  pictureUrl: string;
}
