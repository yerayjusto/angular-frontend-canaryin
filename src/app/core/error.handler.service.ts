import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    constructor(public toastController: ToastController) {}
    async presentToast(err: string) {
        const toast = await this.toastController.create({
            header: 'Error ocurred',
            message: err,
            duration: 2000,
            color: 'danger',
            buttons: [
                {
                    icon: 'bug',
                    text: 'dismiss',
                    role: 'cancel'
                }
            ]
        });
        toast.present();
    }

    handleError<T>(operation = 'operations', result?: T) {
        return (error: any): Observable<T> => {
            console.warn(`${operation} failed: ${error.mesagge}`); //TODO remove in PRO
            return of(result as T).pipe(tap(() => this.presentToast(error.message)));
        };
    }
}
