import { Component, OnInit } from '@angular/core';
import {QuestionsService} from "./services/questions.service";
import {TagQuestion} from "./model/tag-question";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [QuestionsService]
})
export class AppComponent implements OnInit {
  tagQuestions: TagQuestion[];

  constructor(private questionsService: QuestionsService) { }

  getTagQuestions(): void {
    this.questionsService.getTagQuestions().then(qs => this.tagQuestions = qs);
  }

  ngOnInit(): void {
    this.getTagQuestions();
  }
}
