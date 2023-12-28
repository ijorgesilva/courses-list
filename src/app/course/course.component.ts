import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { Observable, combineLatest } from "rxjs";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/courses.store";
import { map, startWith } from "rxjs/operators";

interface CourseData {
  course: Course,
  lessons: Lesson[],
}
@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
  providers: [ LoadingService, MessagesService ]
})
export class CourseComponent implements OnInit {

  data$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private coursesStore: CoursesStore,
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));
    const course$ = this.coursesStore.loadCourseById(courseId)
      .pipe(
        startWith()
      );
    const lessons$ = this.coursesStore.loadAllCourseLessons(courseId)
      .pipe(
        startWith([])
      );

    this.data$ = combineLatest([course$, lessons$])
    .pipe(
      map( ([course, lessons]) => {return {course, lessons}} ),
    );
  }
}
