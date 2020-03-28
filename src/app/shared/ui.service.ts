import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable()
export class UIService {
    constructor(private snackBar: MatSnackBar) {}

    showSnackbar(message: string, action: string, duration?: number) {
        this.snackBar.open(message, action, {
            duration
        })
    }
}
