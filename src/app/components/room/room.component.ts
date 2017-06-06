import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../../services/questions.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TagQuestion } from '../../model/tag-question';
import {MdDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {FirebaseListObservable} from "angularfire2/database/firebase_list_observable";
import {AngularFireDatabase} from "angularfire2/database/database";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
  providers: [QuestionsService, MdDialog]
})
export class RoomComponent implements OnInit {
  questionsForm: FormGroup;
  submitted: Boolean = false;
  player = '';
  room = '';
  players: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase, private questionsService: QuestionsService, private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.createForm();
  }

  createForm() {
    // initialize with a empty array
    this.questionsForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.forEach((params) => {
      this.player = params['playerName'];
      this.room = params['roomId'];
    });
    this.players = this.db.list('/' + this.room + '/players');
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
        if ( control.value.toLowerCase() !== s.toLowerCase() ) {
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
  }
}
