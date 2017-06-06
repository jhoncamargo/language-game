import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {NameDialogComponent} from '../name-dialog/name-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {
  dialogRef: MdDialogRef<NameDialogComponent>;
  rooms: FirebaseListObservable<any[]>;
  config: MdDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: '',
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: ''
    },
    data: {
      message: 'Please write your name'
    }
  };
  username: string;
  roomName: string;
  submitted = false;

  constructor(private db: AngularFireDatabase, public dialog: MdDialog, private router: Router) {
  }

  ngOnInit(): void {
    this.rooms = this.db.list('/');
  }

  count(room: any) {
    return Object.keys(room.players).length;
  }

  openNameDialog(key: string) {
    this.dialogRef = this.dialog.open(NameDialogComponent, this.config);

    this.dialogRef.afterClosed().subscribe((result: string) => {
      this.dialogRef = null;
      if (result) {
        const url = '/room/' + key + '/player/' + result;
        this.router.navigateByUrl(url);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    const room = {
      [this.roomName]: {
        questionnaire: 'tag-questions',
        players: {
          [this.username]: 0
        },
        chat: {
          0: 'Beginning of the chat'
        }
      }
    };

    this.db.object('/').update(room)
      .then(_ => {
        const url = '/room/' + this.roomName + '/player/' + this.username;
        this.router.navigateByUrl(url);
      });
  }
}
