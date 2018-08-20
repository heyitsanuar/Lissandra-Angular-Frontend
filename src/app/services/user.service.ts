import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;
    public bag;
    public wishlist;

    constructor(
        private _http: HttpClient
    ){
        this.url = GLOBAL.url;
    }

    // POST '/user' Saves a new user
    register(user: User): Observable<any>{
        //Specifying CORS setup and params to be sent
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        //Returning response from POST request with headers
        return this._http.post(this.url + 'user', params, {headers: headers});
    }

    // POST '/login' Signs in a new user and returns token if necessary 
    signIn(user, getToken = null): Observable<any>{
        //Allocating token in case it was sent
        user.getToken = (getToken != null) ? getToken : null;
        
        //Specifying CORS setup and params to be sent
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        //Returning response from POST request with headers
        return this._http.post(this.url + 'login', params, {headers: headers});
    }

    //Returns IDENTITY JSON from Local Storage
    getIdentity(){
        //Parsing identity to JSON from the string allocated in local storage
        //If different from undefined, the value will be set
        let identity = JSON.parse(localStorage.getItem('identity'));
        this.identity = (identity != 'undefined') ? identity : null; 

        //Returning identity value either from local storage or null value
        return this.identity;
    }
    
    //Returns TOKEN String from Local Storage
    getToken(){
        //Parsing token to JSON from the string allocated in local storage
        //If different from undefined, the value will be set
        let token = JSON.parse(localStorage.getItem('token'));
        this.token = (token != 'undefined') ? token : null;

        //Returning token value either from local storage or null value
        return this.token;
    }

    // PUT '/user/:ID' Updates an existing user
    updateUser(user: User): Observable<any>{
        //Specifying CORS setup and params to be sent
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
    
        //Returning response from PUT request with headers
        return this._http.put(this.url + 'user/' + user._id, params, {headers: headers});
    }

    // GET '/bag/:userID' Gets the product bag of an existing user
    loadUserBag(userId): Observable<any>{
        //Specifying CORS setup
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        //Returning response from GET request with headers
        return this._http.get(this.url + 'bag/' + userId, {headers: headers});
    }

    //Returns BAG JSON from Local Storage
    getBag(){
        //Parsing bag to JSON from the string allocated in local storage
        //If different from undefined, the value will be set
        let bag = JSON.parse(localStorage.getItem('bag'));
        this.bag = (bag != 'undefined') ? bag : null ;

        //Returning bag value either from local storage or null value
        return this.bag;
    }

    // POST '/bag/:userID/:productID' Adds an existing product to a user's bag
    addToBag(userId, productId): Observable<any>{
        //Specifying CORS setup and params to be sent
        let params = {};
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        //Returning response from POST request with headers
        return this._http.post(this.url + 'bag/' + userId + '/' + productId, params, {headers: headers});
    }

    // DELETE '/bag/:userID/:productID' Removes an existing product from the given user's bag
    removeFromBag(userId, productId): Observable<any>{
        //Specifying CORS setup
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        
        //Returning response from DELETE request with headers
        return this._http.delete(this.url + 'bag/' + userId + '/' + productId, {headers: headers});
    }

    // GET '/wishlist/:userID' Gets the product wishlist of an existing user
    loadUserWishlist(userId): Observable<any>{
        //Specifying CORS setup
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        //Returning response from GET request with headers
        return this._http.get(this.url + 'wishlist/' + userId, {headers: headers});
    }

    //Returns WISHLIST JSON from Local Storage
    getWishlist(){
        //Parsing bag to JSON from the string allocated in local storage
        //If different from undefined, the value will be set
        let wishlist = JSON.parse(localStorage.getItem('wishlist'));
        this.wishlist = (wishlist != 'undefined') ? wishlist : null ;

        //Returning bag value either from local storage or null value
        return this.wishlist;
    }

    // POST '/wishlist/:userID/:productID' Adds an existing product to a user's wishlist
    addToWishlist(userId, productId): Observable<any>{
        //Specifying CORS setup and params to be sent
        let params = {};
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());

        //Returning response from POST request with headers
        return this._http.post(this.url + 'wishlist/' + userId + '/' + productId, params, {headers: headers});
    }

    // DELETE '/wishlist/:userID/:productID' Removes an existing product from the given user's wishlist
    removeFromWishlist(userId, productId): Observable<any>{
        //Specifying CORS setup
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        
        //Returning response from DELETE request with headers
        return this._http.delete(this.url + 'wishlist/' + userId + '/' + productId, {headers: headers});
    }

}