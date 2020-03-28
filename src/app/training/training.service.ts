import { Exercise } from './exercise.model';
import { Subject, Timestamp, Subscription } from 'rxjs';
import 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer'
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;

    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishExercisesChanged = new Subject<Exercise[]>();
    private fbSubs: Subscription[] = [];

    constructor(private angularFirestore: AngularFirestore, 
        private uiService: UIService,
        private store: Store<fromRoot.State>) {}

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading());
        return this.fbSubs.push(this.angularFirestore
            .collection('availableExercises')
            .snapshotChanges()
            .map(docData => {
                return docData.map(doc => {
                    return {
                    id: doc.payload.doc.id,
                    ...doc.payload.doc.data() as Exercise
                    }
                })
            })
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new UI.StopLoading());
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises]);              
            }, error => {
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
            }));
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({...this.runningExercise});
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise, 
            date: new Date(), 
            state: "completed"
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null); 
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise, 
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(), 
            state: "cancelled"
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return {...this.runningExercise};
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.angularFirestore.collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: any[]) => {
                const newExercises = exercises.map(exercise => {
                    return {
                        ...exercise,
                        date: exercise.date.toDate()
                    }
                })
                this.finishExercisesChanged.next(newExercises);
            }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.angularFirestore.collection('finishedExercises')
            .add(exercise);
    }
}