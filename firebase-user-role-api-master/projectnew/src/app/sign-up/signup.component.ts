import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-sign-up',
  template: `
    <div>
      <h2>Sign Up</h2>
      <form [formGroup]="form" (submit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" formControlName="email" class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" formControlName="password" class="form-control">
        </div>
        <button type="submit" [disabled]="!form.valid">Sign Up</button>
      </form>
    </div>
  `
})
export class SignUpComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authService.signUp(email, password)
      .then(() => {
        console.log('User created successfully!');
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  }

}
