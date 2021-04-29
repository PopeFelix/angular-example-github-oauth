import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoggerModule, LoggerConfig } from 'ngx-logger'
import { environment } from '../environments/environment'

const logConfig = environment.logConfig as LoggerConfig
logConfig.enableSourceMaps = true
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoggerModule.forRoot(logConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
