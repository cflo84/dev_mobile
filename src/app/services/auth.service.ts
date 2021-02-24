import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: AngularFireAuth) { }


  /**
   * 
   * @param email 
   * @param password 
   * @returns Promise<firebase.User>
   */
  login(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password)
        .then(user => resolve(user.user))
        .catch(err => {
          let errorMessage: String;

          switch (err.code) {
            case "auth/invalid-email":
              errorMessage = "Email is invalid";
              break;
            case "auth/user-disabled":
              errorMessage = "User is disabled";
              break;
            case "auth/user-not-found":
              errorMessage = "User not found";
              break;
            case "auth/wrong-password":
              errorMessage = "Wrong password";
              break;
          }

          return reject(errorMessage);
        });
    });
  }

  register(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.createUserWithEmailAndPassword(email, password)
        .then(
          user => { // Creation succeeded
            user.user.sendEmailVerification(null)
              .then(() => {
                // Verification email sent
                // Sign out and tell the user to verify their email
                this.auth.signOut().then(() => resolve(null));
              })
              .catch(error => {
                // Error occurred. Inspect error code.
                reject(error);
              });
          })
        .catch(err => { // Creation failed
          let errorMessage: String;

          switch (err.code) {
            case "auth/invalid-email":
              errorMessage = "Email is invalid";
              break;
            case "auth/email-already-in-use":
              errorMessage = "There is already a user for this email";
              break;
            case "auth/weak-password":
              errorMessage = "Password is too weak";
              break;
          }

          reject(errorMessage);
        });
    });
  }

  resetPassword (email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth.sendPasswordResetEmail(email)
        .then(resolve)
        .catch(err => {
          let errorMessage: String;

          switch (err.code) {
              case "auth/invalid-email":
                  errorMessage = "Email is invalid";
                  break;
              case "auth/user-not-found":
                  errorMessage = "User not found";
                  break;
              default:
                  errorMessage = "An error has occurred";
                  break;
          }

          reject(errorMessage);
        });
      });
  }
}
