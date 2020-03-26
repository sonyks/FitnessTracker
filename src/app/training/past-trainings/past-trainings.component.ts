import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.scss']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['date','name','duration','calories','state'];
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  finishedExerciseSub: Subscription;

  constructor(private trainingService: TrainingService) { }
  
  ngOnDestroy(): void {
    if (this.finishedExerciseSub) {
      this.finishedExerciseSub.unsubscribe();
    }
  }
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.trainingService.fetchCompletedOrCancelledExercises();
    this.finishedExerciseSub = this.trainingService.finishExercisesChanged.subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
    })
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
