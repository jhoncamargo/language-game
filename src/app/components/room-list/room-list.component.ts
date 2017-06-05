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

  constructor(private db: AngularFireDatabase, public dialog: MdDialog, private router: Router) {
  }

  ngOnInit(): void {
    this.rooms = this.db.list('/');
    this.rooms.subscribe(snapshot => {
      console.log(snapshot);
    });
  }

  openNameDialog(key: string) {
    this.dialogRef = this.dialog.open(NameDialogComponent, this.config);

    this.dialogRef.afterClosed().subscribe((result: string) => {
      this.dialogRef = null;
      if (result) {
        const url = '/room/' + key + '/player/' + result;
        this.router.navigateByUrl(url);
        console.log('Redirecting to ' + url);
      }
    });
  }
}
