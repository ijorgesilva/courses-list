import { Component, OnInit } from "@angular/core";
import { Lesson } from "../model/lesson";
import { Observable } from "rxjs";
import { CoursesService } from "../services/courses.services";

@Component({
  selector: "course",
  templateUrl: "./search-lessons.component.html",
  styleUrls: ["./search-lessons.component.css"],
})
export class SearchLessonsComponent implements OnInit {

  searchResults$:Observable<Lesson[]>;

  constructor(
    private coursesService: CoursesService,
  ) {}

  ngOnInit() {}

  onSearch(search: string){
    this.searchResults$ = this.coursesService.searchLessons(search);
  }

}
