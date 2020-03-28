import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from "angularfire2/auth";
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromApp from "../app.reducer";
import * as UI from "../shared/ui.actions";

@Injectable()
export class AuthService {
    private isAuthenticated = false;
    authChange = new Subject<boolean>();

    constructor(private router: Router,
        private angularFireAuth: AngularFireAuth,
        private trainingService: TrainingService, 
        private uiService: UIService,
        private store: Store<{ui:fromApp.State}>) {}

    
    initAuthListener() {
        this.angularFireAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();  
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading());
        this.angularFireAuth.auth.createUserWithEmailAndPassword(authData.email,
            authData.password)
            .catch(error => {
                console.log(error);
                this.isAuthenticated = false;
                this.uiService.showSnackbar(error.message, null, 3000);
            })
            .finally(() => {
                this.store.dispatch(new UI.StopLoading());
            });    
    }

    login(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading());
        this.angularFireAuth.auth
            .signInWithEmailAndPassword(authData.email, authData.password)
            .catch(error=> {
                this.uiService.showSnackbar(error.message, null, 3000);
                this.isAuthenticated = false;
            })
            .finally(() => {
                this.store.dispatch(new UI.StopLoading());
            });
    }

    logout() {
        this.angularFireAuth.auth.signOut();
    }

    getUser() {
        return {};
    }

    isAuth() {
        return this.isAuthenticated;
    }
}