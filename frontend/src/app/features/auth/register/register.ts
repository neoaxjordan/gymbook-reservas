import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { getErrorMessage, passwordStrengthValidator, passwordMatchValidator } from '../../../shared/utils/validators';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, CardModule, MessageModule, RadioButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error   = '';

  // Opciones para el SelectButton
  roleOptions = [
    { label: 'Cliente',        value: 1 },
    { label: 'Administrador',  value: 0 },
  ];

  form = this.fb.group({
    name:            ['', [Validators.required, Validators.minLength(3)]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, passwordStrengthValidator()]],
    confirmPassword: ['', Validators.required],
    rol:             [2, Validators.required],
  }, { validators: passwordMatchValidator });

  getError = getErrorMessage;

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading = true;
    this.error   = '';

    const { name, email, password, rol } = this.form.getRawValue();

    this.auth.register({ name: name!, email: email!, password: password!, rol: rol! }).subscribe({
      next: (res) => {
        this.auth.saveSession(res);
        this.router.navigate(['/classes']);
      },
      error: (err) => {
        this.error   = err.error?.message ?? 'Error al registrarse.';
        this.loading = false;
      }
    });
  }
}