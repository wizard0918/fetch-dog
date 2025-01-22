interface User {
  name: string;
  email: string;
}

class AuthService {
  /**
   * Calculates the remaining duration of the token by comparing the stored expiration time with the current time.
   * @returns {number} Time left for the token in milliseconds or -1 if no expiration is set.
   */
  getTokenDuration(): number {
    const storedExpirationDate = localStorage.getItem('expiration');
    if (!storedExpirationDate) return -1;

    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    return expirationDate.getTime() - now.getTime();
  }

  /**
   * Stores the user's information and sets a token expiration in local storage.
   * The expiration time is set to 1 hour from the moment of login.
   * @param user - The user object containing user details.
   */
  login(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Set expiration time to 1 hour
    localStorage.setItem('expiration', expiration.toISOString());
  }

  /**
   * Clears the user's data from local storage and navigates to the homepage.
   * Typically used when the user logs out or the token has expired.
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('expiration');
  }

  /**
   * Retrieves the user's information from local storage.
   * Validates the token's expiration before returning the user details.
   * If the token is expired, it triggers a logout.
   * @returns {User | null} The user object if valid, otherwise null.
   */
  getUser(): User | null {
    const user = localStorage.getItem('user');
    if (!user) return null;

    const parsedUser: User = JSON.parse(user);
    const tokenDuration = this.getTokenDuration();

    if (tokenDuration < 0) {
      this.logout(); // Log the user out if the token is expired
      return null;
    }

    return parsedUser;
  }
}

const Auth = new AuthService();
export default Auth;
