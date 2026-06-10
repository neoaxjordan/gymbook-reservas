import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly TOKEN_KEY = 'gymbook_token';
    private readonly USER_KEY = 'gymbook_user';

    currentUser = signal<AuthResponse['user'] | null>(this.loadUser());

    constructor(private http: HttpClient, private router: Router) { }

    login(body: LoginRequest) {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, body).pipe(
            tap(res => this.saveSession(res))
        );
    }

    register(body: RegisterRequest) {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, body).pipe(
            tap(res => this.saveSession(res))
        );
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    saveSession(res: AuthResponse) {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
        this.currentUser.set(res.user);
    }

    loadUser(): AuthResponse['user'] | null {
        const raw = localStorage.getItem(this.USER_KEY);
        return raw ? JSON.parse(raw) : null;
    }

    getUserId(): string | null {
        return this.currentUser()?.id ?? null;
    }
}