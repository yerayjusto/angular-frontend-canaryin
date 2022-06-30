import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  @Input() postId?: number;
  imagePath: string;
  fullName: string;
  constructor(public modalController: ModalController, private authService: AuthService) { }

  ngOnInit() {
    this.imagePath = this.authService.getUserFullImagePath();
    this.fullName = this.authService.getFullName();
  }

  onPost() {
    if (!this.form.valid) { return; }
    const body = this.form.value.body;
    this.modalController.dismiss(
      {
        post: {
          body,
        }
      },
      'post'
    );
  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }
}
