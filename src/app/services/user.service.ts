import { Injectable } from '@angular/core';
import {UserInfo} from '../model/user-info';

@Injectable()
export class UserService {
  userId: string;
  username: string;
  room: string;
  points: number;

  constructor() {}

  setUserInfo(userId: string, username: string, room: string, points: number): void {
    this.userId = userId;
    this.username = username;
    this.room = room;
    this.points = points;
  }

  getUserInfo(): UserInfo {
    return { userId: this.userId, username: this.username, room: this.room, points: this.points };
  }

  addPoints(points: number): void {
    this.points = this.points + points;
  }

  getPoints(): number {
    return this.points;
  }

  invalidate(): void {
    this.userId = undefined;
    this.username = undefined;
    this.room = undefined;
    this.points = undefined;
  }
}
