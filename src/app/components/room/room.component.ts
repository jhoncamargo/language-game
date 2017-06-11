import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';
import { AngularFireDatabase } from 'angularfire2/database/database';
import {UserService} from '../../services/user.service';
import {UserInfo} from '../../model/user-info';
import {FirebaseObjectObservable} from 'angularfire2/database';
import {Question} from '../../model/question';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  questionsForm: FormGroup;
  submitted: Boolean = false;
  userInfo: UserInfo;
  players: FirebaseListObservable<any[]>;
  chatMessages: FirebaseListObservable<any[]>;
  questionnaire: FirebaseObjectObservable<any>;
  chatEntry: string;
  questionnaireTitle: string;
  questions: Question[];
  showQuestions = true;

  constructor(private db: AngularFireDatabase, private questionsService: QuestionsService, private fb: FormBuilder,
              private userService: UserService) {
    this.createForm();
  }

  createForm() {
    // initialize with a empty array
    this.questionsForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.userInfo = this.userService.getUserInfo();
    this.players = this.db.list('/' + this.userInfo.room + '/players', {
      query: {
        orderByChild: 'points',
      }
    });
    this.chatMessages = this.db.list('/' + this.userInfo.room + '/chat');
    this.questionnaire = this.db.object('/' + this.userInfo.room + '/questionnaire');
    this.questionnaire.subscribe(value => {
      this.setQuestions(value.$value);
    });
  }

  setQuestions(questionnaireType: string) {
    this.questions = this.questionsService.getQuestions(questionnaireType);
    this.questionnaireTitle = questionnaireType;
    // each question initially has only a required validator
    const questionsFormList = this.questions.map(q => this.fb.group({
      userResponse: ['', Validators.required]
    }));
    const questionsFormArray = this.fb.array(questionsFormList);

    this.showQuestions = false;
    this.submitted = false;
    setTimeout(() => { this.showQuestions = true; }, 50);
    this.questionsForm.setControl('questions', questionsFormArray);
  }

  get questionsFormArray(): FormArray {
    return this.questionsForm.get('questions') as FormArray;
  };

  onSubmit(): void {
    // when submitted an equal validator is added to show the correct responses
    function equal(s: string) {
      return function equalValidator(control: FormControl): { [s: string]: boolean} {
        if (control.value && (control.value.toLowerCase().trim() !== s.toLowerCase().trim())) {
          return { 'answer': true };
        }
        return null;
      };
    }
    this.submitted = true;

    let total = 0;
    for (let i = 0; i < this.questionsFormArray.controls.length; i++) {
      const c = this.questionsFormArray.controls[i];
      total += c.get('userResponse').value.toLowerCase().trim() === this.questions[i].response.toLowerCase().trim() ? +1 : +0;
      c.get('userResponse').setValidators(Validators.compose([Validators.required, equal(this.questions[i].response)]));
      c.get('userResponse').updateValueAndValidity();
    }

    this.userService.addPoints(total);

    const url = '/' + this.userInfo.room + '/players';
    this.db.list(url).update(this.userInfo.userId, {
      name: this.userInfo.username,
      points: this.userService.getPoints()
    });
  }

  nextQuestionnaire(): void {
    const questionnaire = this.questionsService.nextQuestionnaire(this.questionnaireTitle);
    this.db.object('/' + this.userInfo.room).update({questionnaire});
    this.submitted = false;
  }

  onSubmitChat(): void {
    if (this.chatEntry) {
      this.db.list('/' + this.userInfo.room + '/chat').push(this.userInfo.username + ': ' + this.chatEntry)
        .then(_ => {
          this.chatEntry = '';
      });
    }
  }
}
