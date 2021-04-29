import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NGXLogger } from 'ngx-logger'
import { AuthenticationService } from '../authentication.service'
import { LocalStorageService } from 'ngx-webstorage'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private router: Router,
    private logger: NGXLogger,
    private storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((query) => {
      const { code, state, err } = query
      if (Object.keys(query).length) {
        this.logger.debug(`Query params: `, { query })

        if (code) {
          this.logger.debug(
            `loginComponent::ngOnInit (requesting authorization)`,
            { code, state }
          )
          this.authenticationService
            .requestAuthorization(code, state)
            .subscribe(
              (result) => {
                this.logger.info(
                  `Auth successful. Result: ${JSON.stringify({ result })}`,
                  { result }
                )
                const { token, returnTo } = result
                this.logger.info(`Store auth token`, { token })
                this.authenticationService.setAuthToken(token)
                if (returnTo) {
                  this.logger.debug(`Return to: ${JSON.stringify(returnTo)}`)
                } else {
                  this.router.navigate(['/'])
                }
              },
              (err) => {
                this.logger.error(`Error from authenticationService`, { err })
                let error
                if (typeof err === 'object') {
                  error = err.err
                } else {
                  error = err
                }

                const errors: string[] = this.storage.retrieve('errors')
                errors.push(error)
                this.storage.store('errors', errors)
                this.router.navigate(['/error'])
              }
            )
        } else if (err) {
          const errors: string[] = this.storage.retrieve('errors')
          errors.push(err)
          this.storage.store('errors', errors)
          this.router.navigate(['/error'])
        }
      }
    })
  }
}
