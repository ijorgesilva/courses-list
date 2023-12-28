import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Lesson } from "../model/lesson";

@Injectable({
  providedIn: 'root',
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$ : Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private message: MessagesService,
  ){
    this.loadAllCourses();
  }

  loadCourseById(courseId: number): Observable<Course>{
    return this.http.get<Course>(`/api/courses/${courseId}`)
      .pipe(
        shareReplay(),
      )
  }

  loadAllCourseLessons(courseId: number): Observable<Lesson[]>{
    const loadLessons$ = this.http.get<Lesson[]>(`/api/lessons`, {
      params: {
        courseId: courseId.toString(),
        pageSize: '1000',
      }
    })
      .pipe(
        map( res => res['payload']),
        shareReplay(),
      )
    this.loading.showLoaderUntilCompleted(loadLessons$).subscribe();
    return loadLessons$;
  }

  private loadAllCourses(){
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(response => response['payload']),
        catchError(
          err => {
            const message = 'Error loading courses';
            this.message.showErrors(message);
            console.log(message, err);
            return throwError(message);
          }
        ),
        tap( courses => this.subject.next(courses) ),
      )
    this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  filterByCategory(category: string): Observable<Course[]>{
    return this.courses$
      .pipe(
        map(
          courses => courses.filter(course => course.category === category)
            .sort(sortCoursesBySeqNo)
        )
      )
  }

  saveCourse(courseId: string, changes:Partial<Course>): Observable<any>{
    const courses = this.subject.getValue();
    const index = courses.findIndex(course => courseId == course.id);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };

    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;

    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError( err => {
          const message = 'Could not save course';
          console.log(message, err);
          this.message.showErrors(message);
          return throwError(err);
        }),
        shareReplay(),
      );
  }

}