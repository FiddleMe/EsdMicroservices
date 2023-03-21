// helper class created for authentication and sending verifications emails when a new member is registered

const FirebaseService = require('./firebase_helper.js');

class AuthService extends FirebaseService {
  /**
   * creates a new user
   * @param email new email address
   * @param password password of user
   */
  async signUp(email, password) {
    try {
      const data = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (data) {
        if (data.user) {
          //send email verification
          data.user.sendEmailVerification({
            url: "https://us-central1-esd-login-signup.cloudfunctions.net",
          });
        }
        //resolve Promise when user is created successfully
        return Promise.resolve({ success: true, data });
      }
      //reject Promise when user creation fails
      return Promise.reject({ success: false, data });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }

  /**
   * Login user
   * @param email users email
   * @param password user password
   */
  async login(email, password) {
    try {
      const data = await this.auth.signInWithEmailAndPassword(email, password);
      return Promise.resolve({ success: true, data });
    } catch (error) {
      console.error(error);
      return Promise.reject({ success: false, error });
    }
  }

  /**
   * Logout function
   */
  async logout() {
    try {
      await this.auth.signOut();
      return Promise.resolve({ success: true, data: 'logged out' });
    } catch (error) {
      console.error(error);
      return Promise.reject({ success: false, error });
    }
  }

  /**
   * Get Current Logged in User's Profile
   */
  async currentUser() {
    try {
      const user = await this.auth.currentUser;
      if (user) {
        return Promise.resolve({ success: true, data: user });
      }
      return Promise.reject({ success: false, error: "You're not logged in!" });
    } catch (error) {
      console.error(error);
      return Promise.reject({ success: false, error });
    }
  }

  /**
   * Update Current Logged in User's Profile Details
   */
  async updateUser(updates) {
    try {
      const user = this.auth.currentUser;
      if (user) {
        if (!/^[a-zA-Z]+$/.test(updates.displayName)) {
          return Promise.reject({
            success: false,
            data: "Name can't contain symbols",
          });
        }
        await user.updateProfile({
          displayName: updates.displayName,
          photoURL: updates.photoURL,
        });
        return Promise.resolve({ success: true, data: updates });
      }
      return Promise.reject({
        success: false,
        data: "You don't have the permssion to this!",
      });
    } catch (error) {
      return Promise.reject({ success: false });
    }
  }
}

module.exports = AuthService;
