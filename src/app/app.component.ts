import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title: string;
  public headerNav;
  public identity;
  public token;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ){
    this.title = 'Lissandra';
  }

  ngOnInit(){
    //Allocating Navigation Menu element from DOM 
    this.headerNav = document.getElementById('header-nav');

    //Gets both identity and token in order to check whether the user is logged in or not
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngDoCheck(){
    //Gets both identity and token in order to check whether the user is logged in or not
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  //Toggles Menu on Mobile Devices
  toggleMenu(){
    this.headerNav.classList.toggle('header__nav--is-expanded');
  }

  //Clears all data from local storage, token, and identity
  logout(){
    localStorage.clear();
    this.identity = null;
    this.token = null;
    this._router.navigate(['/']);
  }

}
