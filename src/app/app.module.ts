import { CustomMaterialModule } from './modules/custom-material/custom-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import 'hammerjs';
import { RoomComponent } from './components/room/room.component';
import {RouterModule, Routes} from '@angular/router';
import { RoomListComponent } from './components/room-list/room-list.component';
import { NameDialogComponent } from './components/name-dialog/name-dialog.component';
import { MdDialogModule} from '@angular/material';

const appRoutes: Routes = [
  { path: 'room/:roomId/player/:playerName', component: RoomComponent },
  { path: '**', component: RoomListComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    NameDialogComponent,
    RoomListComponent
  ],
  entryComponents: [
    NameDialogComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    HttpModule,
    CustomMaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MdDialogModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
