import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Villain } from "../../features/villain/villain.model";
import { environment } from "../../../environments/environment";

@Injectable()
export class VillainService {
  path = environment.apiUrlBase + "villains";

  constructor(private http: HttpClient) {}

  getVillains(): Observable<Villain[]> {
    return this.http.get<Villain[]>(this.path);
  }

  deleteVillainById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.path}/${id}`);
  }

  postVillain(createdVillain: Villain): Observable<Villain> {
    return this.http.post<Villain>(this.path, createdVillain);
  }

  putVillain(updatedVillain: Villain): Observable<void> {
    return this.http.put<void>(
      `${this.path}/${updatedVillain.id}`,
      updatedVillain
    );
  }

  getVillainById(id: string): Observable<Villain> {
    return this.http.get<Villain>(`${this.path}/${id}`);
  }
}
