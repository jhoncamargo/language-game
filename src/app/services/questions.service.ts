import { Injectable } from '@angular/core';
import { Question } from '../model/question';
import { TAG_QUESTIONS } from './questions/q-tag-questions';
import {ADJECTIVES_ED_ING} from './questions/q-adjectives-ed-ing';
import {PAST_PERFECT_SIMPLE_CONTINUOUS} from './questions/q-past-perfect-simple-continuous';
import {INFINITIVES_AND_GERUNDS} from './questions/q-infinitives-and-gerunds';
import {PHRASAL_VERBS} from './questions/q-phrasal-verbs';

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
      case 'Past perfect simple and continuous':
        questions = PAST_PERFECT_SIMPLE_CONTINUOUS;
        break;
      case 'Infinitives and Gerunds':
        questions = INFINITIVES_AND_GERUNDS;
        break;
      case 'Phrasal Verbs':
        questions = PHRASAL_VERBS;
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
      case 'Adjectives ending with ed/ing':
        questionnaire = 'Past perfect simple and continuous';
        break;
      case 'Past perfect simple and continuous':
        questionnaire = 'Infinitives and Gerunds';
        break;
      case 'Infinitives and Gerunds':
        questionnaire = 'Phrasal Verbs';
        break;
      default:
        questionnaire = 'Tag Questions';
    }
    return questionnaire;
  }
}
