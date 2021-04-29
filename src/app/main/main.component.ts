import { Component, OnInit } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  githubAuthToken!: string | null

  constructor(
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('github-auth-token')) {
      this.logger.debug('No GitHub auth token present')
      const request_id = 'bjkfdalkflfdalaf'
      const state = { request_id }
      this.logger.debug(`Redirect to ${this.githubAuthEndpoint(state)}`)
      window.location.href = this.githubAuthEndpoint(state)
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
