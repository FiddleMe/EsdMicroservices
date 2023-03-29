import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { UsersModule } from './users/users.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthTokenHttpInterceptorProvider } from './http-interceptors/auth-token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent  
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([]),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    HttpClientModule,
    UsersModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  entryComponents: [
    SignInComponent
  ],
  providers: [
    AuthTokenHttpInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
