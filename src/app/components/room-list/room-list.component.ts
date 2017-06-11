import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import {NameDialogComponent} from '../name-dialog/name-dialog.component';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';

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

  constructor(private db: AngularFireDatabase, public dialog: MdDialog, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.rooms = this.db.list('/');
    this.userService.invalidateUser();
  }

  count(room: any) {
    return room && room.players ? Object.keys(room.players).length : 0;
  }

  openNameDialog(roomObj: any) {
    const room = roomObj.$key;
    const isAdmin = !(!!roomObj.players);
    this.dialogRef = this.dialog.open(NameDialogComponent, this.config);

    this.dialogRef.afterClosed().subscribe((username: string) => {
      this.dialogRef = null;
      if (username) {
        this.db.list('/' + room + '/players').push({
          name: username,
          points: 0,
          isAdmin: isAdmin
        }).then( player => {
          this.userService.setUserInfo(player.key, username, room, 0, isAdmin);
          this.router.navigateByUrl('/game');
        });
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    const room = {
      [this.roomName]: {
        questionnaire: 'Tag Questions',
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
          points: 0,
          isAdmin: true
        }).then(player => {
          this.userService.setUserInfo(player.key, this.username, this.roomName, 0, true);
          this.router.navigateByUrl('/game');
        });
      });
  }
}
