// import { LocalStorageService } from 'ngx-webstorage'

import { environment } from './environments/environment'

import { AuthenticationModule } from './app/authentication.module'
import { AuthenticationService } from './app/authentication.service'

export function requiresGitHubAuth(): Function {
  return function (
    target: Object,
    functionName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    descriptor.value = function (...args: unknown[]) {
      // https://stackoverflow.com/a/66921030/132319
      const authenticationService = AuthenticationModule.injector.get<AuthenticationService>(
        AuthenticationService
      )
      const token = authenticationService.getAuthToken()
      if (!token) {
        console.debug('No GitHub auth token present')
        const request_id = 'bjkfdalkflfdalaf'
        const state = { request_id }
        console.debug(`Redirect to ${githubAuthEndpoint(state)}`)
        window.location.href = githubAuthEndpoint(state)
      } else {
        console.debug(`GitHub auth token present`, { token })
      }
      const result = originalMethod.apply(this, args)
      // console.debug({target, functionName})
      return result
    }
    return descriptor
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
