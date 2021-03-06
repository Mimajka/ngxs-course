import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import {
  AddHero,
  DeleteHero,
  GetHeroes,
  UpdateHero,
} from "../../../../ngxs/actions/hero.action";
import { HeroState } from "../../../../ngxs/states/hero.state";

@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"],
})
export class HeroesComponent implements OnInit, OnDestroy {
  trackerReset = "0";
  itemForm: FormGroup;
  editedForm: FormGroup;
  heroes: any;
  error = "";
  isLoading = false;
  editingTracker = this.trackerReset;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.formBuilderInit();
    this.fetchHeroes();
    this.observableConverters();
  }

  // this is needed in untilDestroyed
  ngOnDestroy(): void {}

  fetchHeroes() {
    this.store.dispatch(new GetHeroes());
  }

  removeHero(id: string) {
    this.store.dispatch(new DeleteHero(id));
  }

  onSave() {
    // stop here if form is invalid
    if (this.itemForm.invalid) {
      return;
    }
    this.store.dispatch(new AddHero(this.itemForm.value));
    this.itemForm.reset();
  }

  onUpdate() {
    // stop here if form is invalid
    if (this.editedForm.invalid) {
      return;
    }

    this.store.dispatch(new UpdateHero(this.editedForm.value));
    this.editingTracker = this.trackerReset;
  }

  goToHeroDetail(id: string) {
    this.router.navigateByUrl("/heroes/hero-detail/" + id);
  }

  private formBuilderInit(): void {
    this.itemForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      house: [""],
      knownAs: [""],
    });

    this.editedForm = this.fb.group({
      id: [""],
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      house: [""],
      knownAs: [""],
    });
  }

  private observableConverters(): void {
    this.store
      .select(HeroState.getHeroList)
      .subscribe((data) => (this.heroes = data));
    this.store
      .select(HeroState.getIsLoading)
      .subscribe((data) => (this.isLoading = data));
  }
}
