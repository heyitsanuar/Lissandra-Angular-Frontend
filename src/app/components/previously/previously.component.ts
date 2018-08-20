import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { GLOBAL } from '../../services/global';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'previously',
    templateUrl: './previously.component.html'
})
export class PreviouslyComponent implements OnInit {
    public products: Product[];
    public title: string;
    public url: string;

    @Output() refreshProduct = new EventEmitter();
    
    constructor(
        private _productService: ProductService,
        private _router: Router,
        private _route: ActivatedRoute
    ){
        this.title = 'Previously seen';
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        this.loadProducts();
    }
    
    //Loads previously seen products from local storage
    loadProducts(){
        this.products = this._productService.getLocalStoragePreviousProducts();
    }

    //Redirects to a given product in contact with other components
    goToProduct(productId: string){
        this._router.navigate(['/product/' + productId]);
        this.refreshProduct.emit(productId);
    }
}