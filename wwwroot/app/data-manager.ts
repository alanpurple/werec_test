import { Component,OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    templateUrl: './data-manager.html'
})
export class DataManager implements OnInit {
    ngOnInit() {
    }

    request = {
        date: new Date(),
        // no limit if 0
        limit:300
    }

    noLimit: boolean = false;

    submitRequest() {

    }
}