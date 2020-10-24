import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../tab1/tab1.module').then(m => m.Tab1PageModule)
          }
        ]
      },
      {
        path: 'cars',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../cars/cars.module').then(m => m.CarsPageModule)
          }
        ]
      },
      {
        path: 'estates',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../estates/estates.module').then(m => m.EstatesPageModule)
          }
        ]
      },
      {
        path: 'machines',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../machines/machines.module').then(m => m.MachinesPageModule)
          }
        ]
      },
      {
        path: 'allproducts',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../allproducts/allproducts.module').then(m => m.AllproductsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
