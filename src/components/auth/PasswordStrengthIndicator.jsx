/**
 * PasswordStrengthIndicator Component
 * Indicador visual de fortaleza de contraseña
 */

import React, { useMemo } from 'react';
import { getPasswordStrength, getStrengthColor, getStrengthText } from '../../utils/validators';
import { cn } from '../../lib/utils';

/**
 * @param {Object} props
 * @param {string} props.password - Contraseña a evaluar
 * @param {boolean} [props.showRequirements=true] - Mostrar requisitos
 */
function PasswordStrengthIndicator({ password, showRequirements = true }) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthColor = getStrengthColor(strength);
  const strengthText = getStrengthText(strength);

  // Requisitos de la contraseña
  const requirements = useMemo(() => [
    {
      label: 'Mínimo 8 caracteres',
      met: password?.length >= 8,
    },
    {
      label: 'Una letra mayúscula',
      met: /[A-Z]/.test(password || ''),
    },
    {
      label: 'Una letra minúscula',
      met: /[a-z]/.test(password || ''),
    },
    {
      label: 'Un número',
      met: /[0-9]/.test(password || ''),
    },
    {
      label: 'Un carácter especial',
      met: /[!@#$%^&*(),.?":{}|<>_+=`~-]/.test(password || ''),
    },
  ], [password]);

  // No mostrar si no hay contraseña
  if (!password) return null;

  // Calcular porcentaje para la barra
  const strengthPercentage = {
    'weak': 25,
    'medium': 50,
    'strong': 75,
    'very-strong': 100,
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Barra de fortaleza */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-secondary">Fortaleza:</span>
          <span className={cn(
            'text-xs font-medium',
            strength === 'weak' && 'text-red-500',
            strength === 'medium' && 'text-yellow-500',
            strength === 'strong' && 'text-green-500',
            strength === 'very-strong' && 'text-emerald-500',
          )}>
            {strengthText}
          </span>
        </div>
        <div className="h-1.5 bg-tertiary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              strengthColor
            )}
            style={{ width: `${strengthPercentage[strength]}%` }}
          />
        </div>
      </div>

      {/* Lista de requisitos */}
      {showRequirements && (
        <div className="grid grid-cols-2 gap-1">
          {requirements.map((req, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-1.5 text-xs transition-colors',
                req.met ? 'text-green-500' : 'text-secondary'
              )}
            >
              {req.met ? (
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PasswordStrengthIndicator;
