import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import '@codetrix-studio/capacitor-google-auth';
import {Plugins} from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: firebase.User;

  constructor(private auth: AngularFireAuth) { 
    this.auth.authState.subscribe(user => {
      this._user = user;
    });
  }


  get user(): firebase.User {
    return this._user;
  }

  get authState(): Observable<firebase.User> {
    return this.auth.authState;
  }

  /**
   * 
   * @param email 
   * @param password 
   * @returns Promise<firebase.User>
   */
  login(email: string, password: string): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.auth.signInWithEmailAndPassword(email, password)
        .then(user => {
          if (user.user.emailVerified) {
            resolve(user.user)
          }
          else {
            this.auth.signOut();
            reject("Email has not been verified. Please check your inbox.");
          }
        })
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
                this.auth.signOut()
                  .then(resolve)
                  .catch(reject);
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


    async loginGoogle() {
        let googleUser = await Plugins.GoogleAuth.signIn(null) as any;
        const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        await this.auth.signInAndRetrieveDataWithCredential(credential);
    }
}
