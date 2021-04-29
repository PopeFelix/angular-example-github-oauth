import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  errors: string[] = []
  constructor(private route: ActivatedRoute, logger: NGXLogger) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((query) => {
      const { err } = query
      if (err) {
        this.errors.push(err)
      } 
      const errors = localStorage.getItem('errors')
      if (errors) {
        this.errors.push(...errors.split(','))
      }
    })
  }

}
