import { Injectable } from '@angular/core';
import { TagQuestion } from "../model/tag-question";
import { TAG_QUESTIONS } from "./mock-tag-questions";

@Injectable()
export class QuestionsService {

  constructor() { }

  getTagQuestions(): Promise<TagQuestion[]> {
    return new Promise(resolve => {
      // Simulate server latency with half second delay
      setTimeout(() => resolve(TAG_QUESTIONS), 500);
    });
  }
}
