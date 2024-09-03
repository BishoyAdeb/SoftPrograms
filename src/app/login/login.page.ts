import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validData: any = {
    email: 'Bishoy@gmail.com',
    password: '123456',
  };
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router
  ) {}

  loginForm: FormGroup = this.formBuilder.group({
    email: [
      null,
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: [null, Validators.required],
    rememberMe: [false],
  });

  ngOnInit() {}

  login() {
    // make sure that all fields that required is not empty
    if (!this.loginForm.valid) {
      this.alertService.showAlertError(
        'يجب إدخال البريد الالكتروني و كلمة السر'
      );
      return;
    }

    // check on email
    if (this.loginForm.value.email.toString() !== this.validData.email) {
      this.alertService.showAlertError(
        `:برجاء كتابة البريد الإلكتروني بشكل صحيح ${this.validData.email}`
      );
      return;
    }

    //check on password
    if (this.loginForm.value.password.toString() !== this.validData.password) {
      this.alertService.showAlertError(
        `برجاء كتابه كلمة السر بشكل صحيح: ${this.validData.password} `
      );
      return;
    }

    // if rememberMe flag is true we can store it in temporary storage (like cookies or session storage)
    // now if all valid will navigate to main page
    this.router.navigateByUrl('/main-page');
  }
}
