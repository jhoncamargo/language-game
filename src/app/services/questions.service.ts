import { Injectable } from '@angular/core';
import { Question } from '../model/question';
import { TAG_QUESTIONS } from './questions/q-tag-questions';
import {ADJECTIVES_ED_ING} from './questions/q-adjectives-ed-ing';

@Injectable()
export class QuestionsService {

  constructor() { }

  getQuestions(questionType: string): Question[] {
    let questions = [];

    switch (questionType) {
      case 'Tag Questions':
        questions = TAG_QUESTIONS;
        break;
      case 'Adjectives ending with ed/ing':
        questions = ADJECTIVES_ED_ING;
        break;
      default:
        questions = TAG_QUESTIONS;
    }
      return questions;
  }

  nextQuestionnaire(questionnaireType: string): string {
    let questionnaire = '';
    switch (questionnaireType) {
      case 'Tag Questions':
        questionnaire = 'Adjectives ending with ed/ing';
        break;
      default:
        questionnaire = 'Tag Questions';
    }
    return questionnaire;
  }
}
