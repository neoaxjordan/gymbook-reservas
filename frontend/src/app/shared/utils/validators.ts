import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ── Auth ──────────────────────────────────────────────────────────────
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (!value) return null;

    const hasMinLength  = value.length >= 8;
    const hasUppercase  = /[A-Z]/.test(value);
    const hasNumber     = /[0-9]/.test(value);

    return hasMinLength && hasUppercase && hasNumber
      ? null
      : { passwordStrength: 'Mínimo 8 caracteres, una mayúscula y un número.' };
  };
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password        = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: 'Las contraseñas no coinciden.' };
}

// ── Reservations ──────────────────────────────────────────────────────
export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today    = new Date();
    today.setHours(0, 0, 0, 0);

    return selected >= today
      ? null
      : { pastDate: 'La fecha debe ser hoy o en el futuro.' };
  };
}

// ── Helpers reutilizables ─────────────────────────────────────────────
export function getErrorMessage(control: AbstractControl | null): string {
  if (!control || !control.errors || !control.touched) return '';

  const errors = control.errors;

  if (errors['required'])        return 'Este campo es obligatorio.';
  if (errors['email'])           return 'Ingresa un email válido.';
  if (errors['minlength'])       return `Mínimo ${errors['minlength'].requiredLength} caracteres.`;
  if (errors['maxlength'])       return `Máximo ${errors['maxlength'].requiredLength} caracteres.`;
  if (errors['passwordStrength'])return errors['passwordStrength'];
  if (errors['passwordMismatch'])return errors['passwordMismatch'];
  if (errors['pastDate'])        return errors['pastDate'];

  return 'Campo inválido.';
}