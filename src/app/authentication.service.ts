import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { tap, map, catchError } from 'rxjs/operators'
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
  constructor(private http: HttpClient, private logger: NGXLogger) {}

  requestAuthorization(code: string, state: string): Observable<AuthResult> {
    this.logger.info(`authenticationService::requestAuthorization`, { code, state })
    return this.http
      .get<AuthResult | AuthError>(`${environment.authentication.serviceUri}/${code}`)
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
          return { token: (res as AuthResult).token, returnTo }
        }),
        catchError((err, caught) => {
          this.logger.error('Authorization failed', { err, caught })
          throw err
        })
      )
  }

}
