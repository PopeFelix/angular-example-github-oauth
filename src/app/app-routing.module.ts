import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ErrorComponent } from './error/error.component'
import { LoginComponent } from './login/login.component'
import { MainComponent } from './main/main.component'
import { AuthGuardService as AuthGuard } from './auth-guard.service'
const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'error', component: ErrorComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
