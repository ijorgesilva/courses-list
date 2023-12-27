import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, Subscription, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.services';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;
  intermediateCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService,
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses(){
    // this.loadingService.loadingOn();
    const courses$ = this.coursesService.loadAllCourses()
      .pipe(
        map( course => course.sort(sortCoursesBySeqNo)),
        catchError( err => {
          const message = 'Could not load courses';
          this.messagesService.showErrors(message);
          console.log(message, err);
          return throwError(err);
        })
      );

    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    this.beginnerCourses$ = courses$.pipe(
      map( course => course.filter( c => c.category === 'BEGINNER')),
    );

    this.intermediateCourses$ = courses$.pipe(
      map( course => course.filter( c => c.category === 'INTERMEDIATE')),
    );

    this.advancedCourses$ = courses$.pipe(
      map( course => course.filter( c => c.category === 'ADVANCED')),
    );

  }

}




