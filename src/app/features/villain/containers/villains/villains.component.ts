import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import {
  AddVillain,
  DeleteVillain,
  GetVillains,
  UpdateVillain,
} from "../../../../ngxs/actions/villain.action";
import { VillainState } from "../../../../ngxs/states/villain.state";

@Component({
  selector: "app-villains",
  templateUrl: "./villains.component.html",
  styleUrls: ["./villains.component.css"],
})
export class VillainsComponent implements OnInit, OnDestroy {
  trackerReset = "0";
  itemForm: FormGroup;
  editedForm: FormGroup;
  villains: any;
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
    this.fetchVillains();
    this.observableConverters();
  }

  // this is needed in untilDestroyed
  ngOnDestroy(): void {}

  fetchVillains() {
    this.store.dispatch(new GetVillains());
  }

  removeVillain(id: string) {
    this.store.dispatch(new DeleteVillain(id));
  }

  onSave() {
    // stop here if form is invalid
    if (this.itemForm.invalid) {
      return;
    }
    this.store.dispatch(new AddVillain(this.itemForm.value));
    this.itemForm.reset();
  }

  onUpdate() {
    // stop here if form is invalid
    if (this.editedForm.invalid) {
      return;
    }

    this.store.dispatch(new UpdateVillain(this.editedForm.value));
    this.editingTracker = this.trackerReset;
  }

  goToVillainDetail(id: string) {
    this.router.navigateByUrl("/villains/villain-detail/" + id);
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
      .select(VillainState.getVillainList)
      .subscribe((data) => (this.villains = data));
    this.store
      .select(VillainState.getIsLoading)
      .subscribe((data) => (this.isLoading = data));
  }
}
