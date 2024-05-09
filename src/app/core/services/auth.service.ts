import { Injectable, inject, signal } from "@angular/core";
import {
  Auth,
  User,
  UserCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  user,
} from "@angular/fire/auth";
import { getAuth } from "@firebase/auth";
import { Observable, from } from "rxjs";

/**
 * A service that provides authentication functionalities using Firebase.
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  /**
   * Injects the Firebase Auth object for authentication operations.
   */
  private firebaseAuth: Auth = inject(Auth);
  /**
   * An observable signal representing the current user's state.
   */
  public currentUserSig = signal<User | undefined>(undefined);
  /**
   * An observable signal indicating whether the user is authenticated.
   */
  public userAuthSig = signal<boolean>(false);
  /**
   * An observable of the user's authentication state.
   */
  public user$ = user(this.firebaseAuth);

  /**
   * Signs in a user with an email and password.
   * @param email The email address of the user.
   * @param password The password for the user's account.
   * @returns An observable that completes when the sign-in is finished.
   */
  public signInWithEmail(credential: { email: string; password: string }): Observable<UserCredential> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, credential.email, credential.password);
    return from(promise);
  }

  /**
   * Signs out the current user.
   * @returns A promise that resolves when the sign-out is complete.
   */
  public async signOut(): Promise<void> {
    const auth = getAuth();
    return signOut(auth);
  }

  public async sendPasswordResetEmail(email: string) {
    const auth = getAuth();
    return sendPasswordResetEmail(auth, email);
  }
}
