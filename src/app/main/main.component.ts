import { Component, OnInit } from '@angular/core'
import { NGXLogger } from 'ngx-logger'
import { AuthenticationService } from '../authentication.service'
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  githubAuthToken!: string | undefined

  constructor(private logger: NGXLogger, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.githubAuthToken = this.authenticationService.getAuthToken()
    this.logger.info(`Got token "${this.githubAuthToken}"`)
  }
}
