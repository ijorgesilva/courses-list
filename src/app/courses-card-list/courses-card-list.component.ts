import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../model/course';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent implements OnInit {

  @Input() courses: Course;
  @Output() coursesChanged = new EventEmitter();

  constructor(public dialog: MatDialog){}

  ngOnInit(): void {}

  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);

    dialogRef.afterClosed()
    .pipe(
      filter(val=>!!val),
      tap(()=>{ this.coursesChanged.emit()}),
    )
    .subscribe()

  }

}
