import { Component, OnInit } from '@angular/core';
import { QuestionsService } from './services/questions.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { TagQuestion } from './model/tag-question';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QuestionsService]
})
export class AppComponent implements OnInit {
  questionsForm: FormGroup;
  submitted: Boolean = false;

  constructor(private questionsService: QuestionsService, private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    // initialize with a empty array
    this.questionsForm = this.fb.group({
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
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

