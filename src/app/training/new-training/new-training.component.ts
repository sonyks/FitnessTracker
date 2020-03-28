import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from "../../app.reducer";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  exercisesChangedSub: Subscription;
  isLoading$: Observable<boolean>;

  constructor(private trainingService: TrainingService,
    private store: Store<fromRoot.State>) { }

  ngOnDestroy(): void {
    if (this.exercisesChangedSub) {
      this.exercisesChangedSub.unsubscribe();
    }
  }
  
  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }
  
  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.exercisesChangedSub = this.trainingService.exercisesChanged.subscribe(result => {
      this.exercises =  result;
    });
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
