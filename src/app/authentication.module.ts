// https://stackoverflow.com/a/66921030/132319
import { Injector, NgModule } from "@angular/core";
import { AuthenticationService } from "./authentication.service";

@NgModule({
  declarations: [],
  imports: [],
  providers: [AuthenticationService]
})
export class AuthenticationModule {
  static injector: Injector

  constructor(injector: Injector) {
    AuthenticationModule.injector = injector
  }
}