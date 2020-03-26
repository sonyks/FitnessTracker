import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  exercisesChangedSub: Subscription;

  constructor(private trainingService: TrainingService) { }
  ngOnDestroy(): void {
    if (this.exercisesChangedSub) {
      this.exercisesChangedSub.unsubscribe();
    }
  }
  
  ngOnInit(): void {
    this.exercisesChangedSub = this.trainingService.exercisesChanged.subscribe(result => {
      this.exercises =  result;
    });
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
