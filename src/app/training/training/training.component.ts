import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit , OnDestroy{

  ongoingTraining = false;
  exerciseSub: Subscription;
  constructor(private trainingService: TrainingService) { }

  ngOnDestroy(): void {
    if (this.exerciseSub) {
      this.exerciseSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.exerciseSub = this.trainingService.exerciseChanged.subscribe(exercise => {
      if (exercise) {
        this.ongoingTraining = true;
      } else {
        this.ongoingTraining = false;
      }
      
    });
  }

}
