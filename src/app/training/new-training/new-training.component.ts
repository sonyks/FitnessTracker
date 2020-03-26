import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription, Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  exercises: Observable<Exercise[]>;
  constructor(private trainingService: TrainingService,
    private angularFirestore: AngularFirestore) { }
  
  ngOnInit(): void {
    this.exercises = this.angularFirestore
    .collection('availableExercises')
    .snapshotChanges()
    .map(docData => {
      return docData.map(doc => {
        return {
          id: doc.payload.doc.id,
          ...doc.payload.doc.data() as Exercise
        }
      })
    });
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
