import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import { from, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { tap, map, catchError } from 'rxjs/operators'
import { LocalStorage } from 'ngx-webstorage'
import { validateGitHubToken, ValidationError } from '../lib/validate-github-token'
interface AuthResult {
  token: string
  returnTo?: string[]
}
interface AuthError {
  error: string
}
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  @LocalStorage()
  authToken!: string

  constructor(private http: HttpClient, private logger: NGXLogger) {}

  getAuthToken(): string | undefined {
    const token = this.authToken
    if (token) {
      this.isTokenValid(token).subscribe(
        (valid) => {
          if (valid) {
            this.logger.debug(`Token ${token} is valid`)
          } else {
            this.logger.debug(`Token may be invalid`)
            // this.logger.info(`Invalidated stored auth token`)
            // this.authToken = ''
          }
        },
        (err) => {
          this.logger.error(`Error validating stored token`, { err })
          throw err
        }
      )
    }
    return this.authToken
  }

  setAuthToken(token: string): void {
    this.authToken = token
  }
 
  clearAuthToken(): void {
    this.authToken = ''
  }

  logout(): void {
    this.clearAuthToken()
  }

  requestAuthorization(code: string, state: string): Observable<AuthResult> {
    this.logger.info(`authenticationService::requestAuthorization`, {
      code,
      state,
    })
    return this.http
      .get<AuthResult | AuthError>(
        `${environment.authentication.serviceUri}/${code}`
      )
      .pipe(
        tap((res) =>
          this.logger.debug(
            `Response from ${
              environment.authentication.serviceUri
            }/${code}: ${JSON.stringify(res)}`
          )
        ),
        map((res) => {
          if ((res as AuthError).error) {
            throw (res as AuthError).error
          }

          let returnTo: AuthResult['returnTo']
          if (state) {
            const parsed = JSON.parse(state)
            returnTo = parsed.returnTo
          }
          const token = (res as AuthResult).token
          this.authToken = token
          return { token, returnTo }
        }),
        catchError((err, caught) => {
          this.logger.error('Authorization failed', { err, caught })
          throw err
        })
      )
  }

  isTokenValid(token: string): Observable<boolean> {
    const scope = environment.authentication.scope
    return from(
      (async () => {
        this.logger.info(`Validating token`, { token, scope })
        try {
          const validated = await validateGitHubToken(token, {
            scope: {
              // Checks 'public_repo' scope is added to the token
              included: [scope],
            },
          })
          this.logger.info(`Token is valid`, { token, scope, validated })
          return true
        } catch (err) {
          if (err instanceof ValidationError) {
            this.logger.info(`Token is invalid`, { token, scope, err })
            return false
          } else {
            throw err
          }
        }
      })()
    )
  }
}
