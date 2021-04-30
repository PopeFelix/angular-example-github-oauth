import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { NGXLogger } from 'ngx-logger'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment'
import { AuthenticationService } from './authentication.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthenticationService,
    private logger: NGXLogger
  ) {}

  canActivate(): Observable<boolean> {
    this.logger.debug('Not right guard, Auth Guard!')
    return this.auth.isAuthenticated().pipe(
      map((authenticated) => {
        if (!authenticated) {
          this.logger.debug('No GitHub auth token present')
          const request_id = 'bjkfdalkflfdalaf'
          const state = { request_id }
          this.logger.debug(`Redirect to ${githubAuthEndpoint(state)}`)
          window.location.href = githubAuthEndpoint(state)
          return false
        } else {
          this.logger.debug('GitHub auth token OK')
          return true
        }
      })
    )
  }
}

function githubAuthEndpoint(state: unknown): string {
  const githubEndpoint = new URL(environment.authentication.authUri)
  githubEndpoint.searchParams.append('state', JSON.stringify(state))
  githubEndpoint.searchParams.append(
    'redirect_url',
    environment.authentication.redirectUri
  )
  githubEndpoint.searchParams.append('scope', environment.authentication.scope)
  githubEndpoint.searchParams.append('allow_signup', 'false')
  return githubEndpoint.toString()
}
