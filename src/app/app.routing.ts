import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SalesComponent } from './components/sales/sales.component';
import { ShopComponent } from './components/shop/shop.component';
import { AboutComponent } from './components/about/about.component';
import { ItemComponent } from './components/item/item.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginComponent } from './components/login/login.component';
import { BagComponent } from './components/bag/bag.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

const AppRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: SignUpComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'shop/:category/:page', component: ShopComponent },
    { path: 'shop/:category/:type/:page', component: ShopComponent },
    { path: 'about', component: AboutComponent },
    { path: 'sales', component: SalesComponent },
    { path: 'product/:id', component: ItemComponent },
    { path: 'bag', component: BagComponent },
    { path: 'wishlist', component: WishlistComponent },
    { path: '**', component: HomeComponent }
];

//Exporting providers
export const AppRoutingProvider: any[] = [];
export const Routing: ModuleWithProviders = RouterModule.forRoot(AppRoutes);