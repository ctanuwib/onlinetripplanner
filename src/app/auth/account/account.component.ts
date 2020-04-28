import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from 'rxjs';

@Component ({
  templateUrl:'./account.component.html'
})

export class AccountComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub : Subscription;

  constructor(public authService: AuthService) {}

  email: string;
  name: string;
  userId: string;
  password: string;

  ngOnInit (){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      AuthStatus => {
        this.isLoading = false;
      }
    );
    this.email = this.authService.getUserEmail();
    this.name = this.authService.getUsername();
    this.userId = this.authService.getUserId();
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

  onUpdate(form: NgForm) {
    if(form.invalid){
      return;
    }
    else {
      this.isLoading = true;
      this.authService.updateUser(this.userId, this.name, this.email, this.password);
    }
  }
}
