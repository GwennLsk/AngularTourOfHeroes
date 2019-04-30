import {Injectable} from '@angular/core';
import {Hero} from './hero';
import {HEROES} from './mock-heroes';
import {Observable, of} from 'rxjs';
import {MessagesService} from './messages.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'content-type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private herosUrl = 'api/heroes';

  constructor(private http: HttpClient, private messageService: MessagesService) {
  }

  getHeroes(): Observable<Hero[]> {
    this.log('HeroService: fetched heroes ');
    return this.http.get<Hero[]>(this.herosUrl).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.herosUrl}/${id}`;
    this.log(`fetched hero id=${id}`);
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }


  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.herosUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id} `)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.herosUrl, hero, httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id= ${newHero.id} `)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.herosUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id= ${id}`)),
      catchError(this.handleError<Hero>('delete hero'))
    );
  }
}
