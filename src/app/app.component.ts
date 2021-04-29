import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NGXLogger } from 'ngx-logger'
import { environment } from '../environments/environment'
import { AuthenticationService } from './authentication.service'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'github-auth-test'

  githubAuthToken!: string | null
  error!: string

  constructor(
    private route: ActivatedRoute,
    private logger: NGXLogger,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.logger.debug(`Query (snapshot)`, {
      query: this.route.snapshot.queryParams,
    })
    if (!localStorage.getItem('github-auth-token')) {
      this.logger.debug('No GitHub auth token present')

      this.route.queryParams.subscribe((query) => {
        const { code, state, err } = query
        if (Object.keys(query).length) {
          this.logger.debug(`Query params: `, { query })

          if (code) {
            this.logger.debug(
              `appComponent::ngOnInit (requesting authorization)`,
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
                  localStorage.setItem('github-auth-token', token)
                  if (returnTo) {
                    this.logger.debug(`Return to: ${JSON.stringify(returnTo)}`)
                  } else {
                    this.router.navigate(['/'])
                  }
                },
                (err) => {
                  window.location.href = `http://localhost:4200?error=${err}`
                }
              )
          } else if (err) {
            this.error = err
            localStorage.removeItem('github-auth-token')
          }
        } else {
        // if (!err) {
          const request_id = 'bjkfdalkflfdalaf'
          const state = { request_id }
          this.logger.debug(
            `Would redirect to ${this.githubAuthEndpoint(state)}`
          )
          window.location.href = this.githubAuthEndpoint(state)
        }
      })
    } else {
      this.githubAuthToken = localStorage.getItem('github-auth-token')
      this.logger.info(
        `Auth token: ${localStorage.getItem('github-auth-token')}`
      )
    }
  }

  private githubAuthEndpoint(state: unknown): string {
    const githubEndpoint = new URL(environment.authentication.authUri)
    githubEndpoint.searchParams.append('state', JSON.stringify(state))
    githubEndpoint.searchParams.append(
      'redirect_url',
      environment.authentication.redirectUri
    )
    githubEndpoint.searchParams.append('scope', 'repo')
    githubEndpoint.searchParams.append('allow_signup', 'false')
    return githubEndpoint.toString()
  }
}
