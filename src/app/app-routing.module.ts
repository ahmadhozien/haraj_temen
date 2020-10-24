import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'cars/:key', loadChildren: './cars/cars.module#CarsPageModule' },
  { path: 'estates', loadChildren: './estates/estates.module#EstatesPageModule' },
  { path: 'machines', loadChildren: './machines/machines.module#MachinesPageModule' },
  { path: 'allproducts', loadChildren: './allproducts/allproducts.module#AllproductsPageModule' },
  { path: 'showproduct/:pid', loadChildren: './showproduct/showproduct.module#ShowproductPageModule' },
  { path: 'login', loadChildren: './pages/auth/login/login.module#LoginPageModule'},
  { path: 'register', loadChildren: './pages/auth/register/register.module#RegisterPageModule' },
  { path: 'dashboard', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule', canActivate: [AuthGuard] },
  { path: 'landing', loadChildren: './landing/landing.module#LandingPageModule' },
  { path: 'favs', loadChildren: './favs/favs.module#FavsPageModule', canActivate: [AuthGuard]  },
  { path: 'addproduct', loadChildren: './addproduct/addproduct.module#AddproductPageModule', canActivate: [AuthGuard] },
  { path: 'myads', loadChildren: './myads/myads.module#MyadsPageModule', canActivate: [AuthGuard] }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
