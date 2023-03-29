import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Component, Inject, OnInit, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignInComponent } from './sign-in/sign-in.component';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loggedIn$: Observable<boolean> = of(false);
  loggedOut$: Observable<boolean> = of(true);

  constructor(
    @Inject(NgbModal) private modal: NgbModal,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.loggedIn$ = this.afAuth.authState.pipe(
      map(user => !!user)
    )

    this.loggedOut$ = this.loggedIn$.pipe(
      map(loggedIn => !loggedIn)
    )
  }

  signIn() {
    this.modal.open(SignInComponent)
  }

  async signOut() {
    await this.afAuth.signOut()
    await this.router.navigateByUrl("/")
  }

}
