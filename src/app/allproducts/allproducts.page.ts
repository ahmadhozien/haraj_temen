import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-allproducts',
  templateUrl: './allproducts.page.html',
  styleUrls: ['./allproducts.page.scss'],
})
export class AllproductsPage implements OnInit {

  constructor(private menu: MenuController) { }

  ngOnInit() {
  }

  openmenu(id) {
    this.menu.enable(true, id);
    this.menu.open(id);
  }
}
