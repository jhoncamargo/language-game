import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.css']
})
export class NameDialogComponent implements OnInit {
  username = '';

  constructor(public dialogRef: MdDialogRef<NameDialogComponent>) { }

  ngOnInit() {
  }

  onSubmit(): void {
    this.dialogRef.close(this.username);
  }
}
