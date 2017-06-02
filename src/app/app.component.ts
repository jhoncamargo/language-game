import { Component, OnInit } from '@angular/core';
import { QuestionsService } from './services/questions.service';
import { TagQuestion } from './model/tag-question';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QuestionsService]
})
export class AppComponent implements OnInit {
  questions: TagQuestion[];
  hasError: Boolean;

  constructor(private questionsService: QuestionsService) { }

  ngOnInit(): void {
    this.getTagQuestions();
  }

  getTagQuestions(): void {
    this.questionsService.getTagQuestions().then(qs => this.questions = qs);
  }

  submit(q: TagQuestion): void {
    console.log(q);
    this.hasError = true;
  }
}
