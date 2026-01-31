/**
 * Validadores de formularios
 * Schemas de validación con Zod
 */

import { z } from 'zod';
import { PASSWORD_POLICY } from '../config/constants';

/**
 * Validación de email
 */
export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('Ingresa un email válido')
  .toLowerCase()
  .trim();

/**
 * Validación de contraseña con política de seguridad
 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_POLICY.MIN_LENGTH, `Mínimo ${PASSWORD_POLICY.MIN_LENGTH} caracteres`)
  .max(PASSWORD_POLICY.MAX_LENGTH, `Máximo ${PASSWORD_POLICY.MAX_LENGTH} caracteres`)
  .refine(
    (password) => !PASSWORD_POLICY.REQUIRE_UPPERCASE || /[A-Z]/.test(password),
    'Debe contener al menos una letra mayúscula'
  )
  .refine(
    (password) => !PASSWORD_POLICY.REQUIRE_LOWERCASE || /[a-z]/.test(password),
    'Debe contener al menos una letra minúscula'
  )
  .refine(
    (password) => !PASSWORD_POLICY.REQUIRE_NUMBERS || /[0-9]/.test(password),
    'Debe contener al menos un número'
  )
  .refine(
    (password) => !PASSWORD_POLICY.REQUIRE_SPECIAL_CHARS || /[!@#$%^&*(),.?":{}|<>_+=`~-]/.test(password),
    'Debe contener al menos un carácter especial (!@#$%^&*)'
  );

/**
 * Validación de nombre
 */
export const nameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede exceder 100 caracteres')
  .trim();

/**
 * Schema de Login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * Schema de Registro
 */
export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

/**
 * Schema de Cambio de Contraseña
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'La nueva contraseña debe ser diferente a la actual',
  path: ['newPassword'],
});

/**
 * Schema de Recuperación de Contraseña
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Schema de Reset de Contraseña
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

/**
 * Calcular fortaleza de contraseña
 * @param {string} password 
 * @returns {'weak' | 'medium' | 'strong' | 'very-strong'}
 */
export const getPasswordStrength = (password) => {
  if (!password) return 'weak';
  
  let score = 0;
  
  // Longitud
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  
  // Complejidad
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  // Variedad de caracteres especiales
  if (/[!@#$%^&*]/.test(password) && /[(),.?":{}|<>]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  if (score <= 6) return 'strong';
  return 'very-strong';
};

/**
 * Obtener color según fortaleza
 * @param {'weak' | 'medium' | 'strong' | 'very-strong'} strength 
 * @returns {string}
 */
export const getStrengthColor = (strength) => {
  const colors = {
    'weak': 'bg-red-500',
    'medium': 'bg-yellow-500',
    'strong': 'bg-green-500',
    'very-strong': 'bg-emerald-500',
  };
  return colors[strength] || colors.weak;
};

/**
 * Obtener texto según fortaleza
 * @param {'weak' | 'medium' | 'strong' | 'very-strong'} strength 
 * @returns {string}
 */
export const getStrengthText = (strength) => {
  const texts = {
    'weak': 'Débil',
    'medium': 'Media',
    'strong': 'Fuerte',
    'very-strong': 'Muy fuerte',
  };
  return texts[strength] || texts.weak;
};

export default {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  getPasswordStrength,
  getStrengthColor,
  getStrengthText,
};
