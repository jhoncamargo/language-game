import { Injectable } from '@angular/core';
import {UserInfo} from '../model/user-info';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class UserService {
  private userId: string;
  private username: string;
  private room: string;
  private points: number;
  private isAdmin: boolean;

  constructor(private db: AngularFireDatabase) {}

  setUserInfo(userId: string, username: string, room: string, points: number, isAdmin: boolean): void {
    this.userId = userId;
    this.username = username;
    this.room = room;
    this.points = points;
    this.isAdmin = isAdmin;
  }

  getUserInfo(): UserInfo {
    return {
      userId: this.userId,
      username: this.username,
      room: this.room,
      points: this.points,
      isAdmin: this.isAdmin
    };
  }

  addPoints(points: number): void {
    this.points = this.points + points;
  }

  getPoints(): number {
    return this.points;
  }

  isLoggedIn(): boolean {
    return this.userId !== undefined && this.username !== undefined && this.room !== undefined && this.points !== undefined;
  }

  invalidateUser(): void {
    if (this.isLoggedIn()) {
      this.db.object('/' + this.room + '/players/' + this.userId).remove();
      this.userId = undefined;
      this.username = undefined;
      this.room = undefined;
      this.points = undefined;
    }
  }
}
