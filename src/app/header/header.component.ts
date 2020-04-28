import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  isAuthenticated = false;

  username = "";

  constructor(private authService: AuthService) {}

  ngOnInit(){
    this.isAuthenticated = this.authService.getAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }

  logout(){
    this.authService.logout();
  }
}

