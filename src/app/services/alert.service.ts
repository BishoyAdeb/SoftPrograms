import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  public async showAlertError(
    message: string,
    buttonText?: string
  ): Promise<void> {
    let alert = this.alertController.create({
      message: message,
      buttons: [
        {
          text: buttonText == null ? 'تم' : buttonText,
          role: 'OK',
        },
      ],
      backdropDismiss: false,
    });
    (await alert).present();
  }
}
