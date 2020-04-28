import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./authdata.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/user/";

@Injectable({ providedIn: "root" })
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private authUsernameListener = new Subject<string>();
  private isAuth = false;
  private timer: any;
  private username: string;
  private userId: string;
  private email: string;

  constructor(private http: HttpClient, private router: Router) {}

  createUser(name: String, email: String, password: String) {
    const authData: AuthData = {
      name: name,
      email: email,
      password: password,
    };
    this.http.post(BACKEND_URL + "register", authData).subscribe(
      (response) => {
        this.loginUser(email, password);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUsernameListener() {
    return this.authUsernameListener.asObservable();
  }

  getAuth() {
    return this.isAuth;
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expireDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.userId = authInfo.userId;
      this.username = authInfo.username;
      this.email = authInfo.email;
      this.isAuth = true;
      this.setTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  loginUser(email: String, password: String) {
    const authData: AuthData = {
      name: "",
      email: email,
      password: password,
    };
    this.http
      .post<{
        token: string;
        name: string;
        email: string;
        userId: string;
        expiresIn: number;
      }>(BACKEND_URL + "login", authData)
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expireDuration = response.expiresIn;
            this.setTimer(expireDuration);
            this.userId = response.userId;
            this.username = response.name;
            this.email = response.email;
            this.isAuth = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expireDate = new Date(now.getTime() + expireDuration * 1000);
            this.saveAuthData(
              token,
              this.userId,
              this.username,
              this.email,
              expireDate
            );
            this.router.navigate(["/search"]);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  updateUser(id: string, username: string, email: string, password: string) {
    const updatedUser: AuthData = {
      name: username,
      email: email,
      password: password,
    };
    this.http.put(BACKEND_URL + "update/" + id, updatedUser).subscribe(
      (response) => {
        this.loginUser(email, password);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUserEmail() {
    return this.email;
  }

  getUsername() {
    return this.username;
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.username = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.timer);
    this.clearAuthData();
    window.alert("Logged out!");
    this.router.navigate(["/"]);
  }

  private setTimer(duration: number) {
    this.timer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    userId: string,
    username: string,
    email: string,
    expireDate: Date
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expireDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expireDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    if (!token || !expireDate) {
      return;
    } else {
      return {
        token: token,
        userId: userId,
        username: username,
        email: email,
        expireDate: new Date(expireDate),
      };
    }
  }
}
