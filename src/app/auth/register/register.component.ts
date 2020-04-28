import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from 'rxjs';

@Component({
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub : Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit (){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      AuthStatus => {
        this.isLoading = false;
      }
    );

  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.isLoading = true;
      this.authService.createUser(
        form.value.name,
        form.value.email,
        form.value.password
      );
    }
  }
}
