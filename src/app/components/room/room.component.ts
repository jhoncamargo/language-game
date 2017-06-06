import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TagQuestion } from '../../model/tag-question';
import { ActivatedRoute } from '@angular/router';
import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';
import { AngularFireDatabase } from 'angularfire2/database/database';
import {UserService} from '../../services/user.service';
import {UserInfo} from '../../model/user-info';

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

  constructor(private db: AngularFireDatabase, private questionsService: QuestionsService, private fb: FormBuilder,
              private route: ActivatedRoute, private userService: UserService) {
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
    this.getTagQuestions();
  }

  getTagQuestions(): void {
    this.questionsService.getTagQuestions().then( (qs) => {
      this.setQuestions(qs);
    });
  }

  setQuestions(questions: TagQuestion[]) {
    // each question initially has only a required validator
    const questionsListGroup = questions.map(q => this.fb.group({
      question: q.question,
      response: q.response,
      userResponse: ['', Validators.required]
    }));
    const questionsGroupList = this.fb.array(questionsListGroup);
    this.questionsForm.setControl('questions', questionsGroupList);
  }

  get questions(): FormArray {
    return this.questionsForm.get('questions') as FormArray;
  };

  onSubmit(): void {
    // when submitted an equal validator is added to show the correct responses
    function equal(s: string) {
      return function equalValidator(control: FormControl): { [s: string]: boolean} {
        if ( control.value.toLowerCase().trim() !== s.toLowerCase().trim() ) {
          return { 'answer': true };
        }
        return null;
      };
    }
    this.submitted = true;

    this.questions.controls.forEach(c => {
      c.get('userResponse').setValidators(Validators.compose([Validators.required, equal(c.get('response').value)]));
      c.get('userResponse').updateValueAndValidity();
    });

    const subTotals = this.questions.controls.map(((x) => {
      return x.get('userResponse').value.toLowerCase().trim() === x.get('response').value.toLowerCase().trim() ? +1 : +0;
    }));
    const total = subTotals.reduce((x, y) => x + y);
    this.userService.addPoints(total);

    const url = '/' + this.userInfo.room + '/players';
    this.db.list(url).update(this.userInfo.userId, {
      name: this.userInfo.username,
      points: this.userService.getPoints()
    });
  }
}
