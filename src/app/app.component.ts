import { Component, OnInit } from "@angular/core";
import { AuthStore } from "./services/auth.store";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {

  constructor(
    public auth: AuthStore,
    private router: Router,
  ) {}

  ngOnInit() {}

  logout() {
    this.auth.logOut();
    this.router.navigateByUrl('/login');
  }
}
