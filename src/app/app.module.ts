import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AuthenticationModule } from './authentication.module'
import { AppComponent } from './app.component';

import { LoggerModule, LoggerConfig } from 'ngx-logger'
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { ErrorComponent } from './error/error.component';
import { MainComponent } from './main/main.component'
import { NgxWebstorageModule } from 'ngx-webstorage';

const logConfig = environment.logConfig as LoggerConfig
logConfig.enableSourceMaps = true
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    MainComponent
  ],
  imports: [
    AuthenticationModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoggerModule.forRoot(logConfig),
    NgxWebstorageModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
