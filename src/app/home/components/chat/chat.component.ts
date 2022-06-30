import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  userFullImagePath: string;
  newMessage$: Observable<string>;
  messages: string[] = [];
  friends: User[] = [];
  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    this.userFullImagePath = this.authService.getUserFullImagePath();
    this.chatService.getNewMessage().subscribe((message: string) => {
      this.messages.push(message);
    });

    this.chatService.getFriends().subscribe((friends: User[]) => {
      this.friends = friends;
    });
  }

  onSubmit() {
    const { message } = this.form.value;
    if (!message) { return; }
    this.chatService.sendMessage(message);
    this.form.reset();
  }
}
