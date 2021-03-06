import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Hero } from "../../features/hero/hero.model";
import { HeroService } from "../services/hero.service";
import {
  AddHero,
  DeleteHero,
  GetHeroById,
  GetHeroes,
  UpdateHero
} from "../actions/hero.action";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";

export class HeroStateModel {
  heroes: Hero[];
  hero: Hero;
  isLoading: boolean;
  error: string;
}

@Injectable()
@State<HeroStateModel>({
  name: "heroes",
  defaults: {
    heroes: [],
    hero: null,
    isLoading: false,
    error: ""
  }
})
export class HeroState {
  constructor(private heroService: HeroService) {}

  @Selector()
  static getHeroList(state: HeroStateModel) {
    return state.heroes;
  }

  @Selector()
  static getSelectedHero(state: HeroStateModel) {
    return state.hero;
  }

  @Selector()
  static getIsLoading(state: HeroStateModel) {
    return state.isLoading;
  }

  @Selector()
  static getError(state: HeroStateModel) {
    return state.error;
  }

  @Action(GetHeroes)
  fetchHeroes({
    getState,
    setState,
    patchState
  }: StateContext<HeroStateModel>) {
    patchState({ isLoading: true });
    return this.heroService.getHeroes().pipe(
      tap(response => {
        patchState({
          heroes: response,
          isLoading: false
        });
      }),
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          isLoading: false,
          error: err.statusText
        });
        return throwError(err.message);
      })
    );
  }

  @Action(DeleteHero)
  removeHero(
    { getState, setState, patchState }: StateContext<HeroStateModel>,
    { id }: DeleteHero
  ) {
    // Optimistic update
    const previousState = getState();
    const filteredArray = getState().heroes.filter(h => h.id !== id);
    patchState({
      heroes: filteredArray
    });
    return this.heroService.deleteHeroById(id).pipe(
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          heroes: previousState.heroes,
          error: err.statusText
        });
        return throwError(err.message);
      })
    );
  }

  @Action(AddHero)
  addHero(
    { getState, patchState }: StateContext<HeroStateModel>,
    { payload }: AddHero
  ) {
    patchState({ isLoading: true });
    return this.heroService.postHero(payload).pipe(
      tap(response => {
        patchState({
          heroes: [...getState().heroes, response],
          isLoading: false
        });
      }),
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          isLoading: false,
          error: err.statusText
        });
        return throwError(err.message);
      })
    );
  }

  @Action(UpdateHero)
  updateHero(
    { getState, setState, patchState }: StateContext<HeroStateModel>,
    { payload }: UpdateHero
  ) {
    // Optimistic update
    const previousState = getState();
    const heroes = [...getState().heroes];
    const index = heroes.findIndex(item => item.id === payload.id);
    heroes[index] = payload;
    patchState({ heroes });
    return this.heroService.putHero(payload).pipe(
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          heroes: previousState.heroes,
          error: err.statusText
        });
        return throwError(err.message);
      })
    );
  }

  @Action(GetHeroById)
  fetchHeroById(
    { getState, setState, patchState }: StateContext<HeroStateModel>,
    { id }: GetHeroById
  ) {
    patchState({ isLoading: true });
    return this.heroService.getHeroById(id).pipe(
      tap(response => {
        patchState({
          hero: response
        });
      }),
      catchError((err: HttpErrorResponse) => {
        alert("Something happened. Please try again.");
        patchState({
          isLoading: false,
          error: err.statusText
        });
        return throwError(err.message);
      })
    );
  }
}
