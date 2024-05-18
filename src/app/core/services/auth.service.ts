import { UsersService } from "./users.service";
import { Injectable, inject, signal } from "@angular/core";
import { Observable, of, switchMap } from "rxjs";
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  user,
} from "@angular/fire/auth";
import { Firestore, doc, docData } from "@angular/fire/firestore";

import { UserCollection } from "../types/collection.type";
import { UserDashboard } from "../types/users.type";

/**
 * @todo Make use of an http interceptor to handle errors
 * A service that provides authentication functionalities using Firebase.
 */
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private firebaseAuth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private usersService: UsersService = inject(UsersService);

  /**
   * An observable of the user's authentication state.
   */
  public user$ = user(this.firebaseAuth);

  public userDataSig = signal<UserDashboard | undefined>(undefined);

  /**
   * Signs in a user with an email and password.
   * @param email The email address of the user.
   * @param password The password for the user's account.
   * @returns A promise that resolves when the sign-in process is complete.
   */
  public async signInWithEmail(credential: { email: string; password: string }): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.firebaseAuth, credential.email, credential.password);
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  }

  /**
   * Registers a user and stores the user data in Firestore.
   * @param dbCollection The Firestore collection where the user data will be stored.
   * @param data The user data to be stored.
   */
  public async registerWithEmail(dbCollection: UserCollection, data: UserDashboard): Promise<void> {
    await createUserWithEmailAndPassword(this.firebaseAuth, data.email, data.password).then((userFirebase) => {
      this.usersService.createUser(dbCollection, userFirebase.user.uid, data);
    });
  }

  /**
   * An observable of the user's data from Firestore.
   */
  public userData$: Observable<UserDashboard | null> = this.user$.pipe(
    switchMap((user) => {
      if (user) {
        const userDocRef = doc(this.firestore, "users-dashboard", user.uid);
        return docData(userDocRef) as Observable<UserDashboard>;
      } else {
        return of(null);
      }
    }),
  );

  /**
   * @todo Implement a Firebase function with the admin SDK to delete users.
   */
  public async deleteUserAuth(dbCollection: UserCollection, data: any): Promise<void> {
    // Implementation needed
  }

  /**
   * Signs out the current user.
   * @returns A promise that resolves when the sign-out process is complete.
   */
  public async signOut(): Promise<void> {
    const auth = getAuth();
    return await signOut(auth);
  }

  /**
   * Sends a password reset email to the specified email address.
   * @param email The email address to send the password reset email to.
   * @returns A promise that resolves when the password reset email is sent.
   */
  public async sendPasswordResetEmail(email: string): Promise<void> {
    const auth = getAuth();
    return await sendPasswordResetEmail(auth, email);
  }
}
