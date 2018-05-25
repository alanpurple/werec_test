import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

//import { UserData } from './userData';
//import { UserService } from './user.service';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: './app.html',
    styleUrls: ['./app.css']
})
export class App {

    constructor(
        //private _userService: UserService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private router: Router
    ) {
        iconRegistry.addSvgIcon('google',
            sanitizer.bypassSecurityTrustResourceUrl('icons/google.svg'));
        iconRegistry.addSvgIcon('facebook',
            sanitizer.bypassSecurityTrustResourceUrl('icons/facebook.svg'));
        if (window.outerWidth < 800) {
            this.sidenavMode = 'over';
            this.isOpened = false;
        }
    }
    isOpened: boolean = true;
    sidenavMode: 'side' | 'over' | 'push' = 'side';

    handleMenu(sidemenu) {
        if (window.outerWidth < 800)
            sidemenu.close();
    }

    /*user: UserData;

    ngOnInit() {
        this._userService.getUser()
            .subscribe(
            user => {
                this.user = user;
                if (!user.nickName)
                    this.router.navigate(['/user-info']);
            },
            error => {
                if (error.status != 401)
                    console.error(error._body);
            });
    }*/
}