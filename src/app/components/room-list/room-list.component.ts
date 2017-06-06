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
    return room && room.players ? Object.keys(room.players).length : 0;
  }

  openNameDialog(room: string) {
    this.dialogRef = this.dialog.open(NameDialogComponent, this.config);

    this.dialogRef.afterClosed().subscribe((nickName: string) => {
      this.dialogRef = null;
      if (nickName) {
        this.db.list('/' + room + '/players').push({
          name: nickName,
          points: 0
        }).then( r => {
          const url = '/room/' + room + '/player/' + r.key;
          this.router.navigateByUrl(url);
        });
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    const room = {
      [this.roomName]: {
        questionnaire: 'tag-questions',
        players: {},
        chat: {
          0: 'Beginning of the chat'
        }
      }
    };

    this.db.object('/').update(room)
      .then(_ => {
        this.db.list('/' + this.roomName + '/players').push({
          name: this.username,
          points: 0
        }).then(r => {
          const url = '/room/' + this.roomName + '/player/' + r.key;
          this.router.navigateByUrl(url);
        });
      });
  }
}
