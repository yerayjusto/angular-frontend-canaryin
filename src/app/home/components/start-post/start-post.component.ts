import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../../auth/services/auth.service';
import { ModalComponent } from './modal/modal.component';


@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent implements OnInit {
  @Output() create: EventEmitter<any> = new EventEmitter();

  imagePath: string;
  constructor(public modalController: ModalController, private authService: AuthService) { }
  ngOnInit() {
    this.imagePath = this.authService.getUserFullImagePath();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data)  { return; }
    this.create.emit(data.post.body);
  }
}
