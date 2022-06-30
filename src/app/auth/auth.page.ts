import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NewUser } from './models/newUser.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('form') form: NgForm;

  token: any;
  submissionType: 'login' | 'join' = 'login';

  constructor(private authService: AuthService, private router: Router, private cookies: CookieService) { }

  ngOnInit(): any {
    if (this.authService.isTokenInCookies()) { this.router.navigateByUrl('/home'); }
  }

  onSubmit() {
    const { email, password } = this.form.value;
    if (!email || !password) { return; }

    if (this.submissionType === 'login') {
      return this.authService.login(email, password).subscribe(data => {
        this.token = this.authService.setToken(data.token);
        this.router.navigateByUrl('/home');
      });
    } else if (this.submissionType === 'join') {
        const { firstName, lastName } = this.form.value;
        if (!firstName || !lastName) { return; }

        //REGISTER USER
        const newUser: NewUser = { firstName, lastName, email, password };
        return this.authService.register(newUser).subscribe(() => {
          this.toggleText();
        });
    }
  }

  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join';
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login';
    }
  }

  ifToken(){
    if (this.authService.validateToken()) {
      this.router.navigateByUrl('/home');
    }
  }
}
