import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  userName = '';

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.userName =
      sessionStorage.getItem('userName') || 'User';

  }

  logout(): void {

    localStorage.removeItem('token');

    sessionStorage.clear();

    this.router.navigate(['/login']);

  }

}