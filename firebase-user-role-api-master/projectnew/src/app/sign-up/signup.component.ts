import { Component } from '@angular/core';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-sign-up',
  template: `
    <div>
      <h2>Sign Up</h2>
      <form (submit)="onSubmit()">
        <label>
          Email:
          <input type="email" [(ngModel)]="email" name="email">
        </label>
        <br>
        <label>
          Password:
          <input type="password" [(ngModel)]="password" name="password">
        </label>
        <br>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  `
})
export class SignUpComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.signUp(this.email, this.password)
      .then(() => {
        console.log('User created successfully!');
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  }
}
