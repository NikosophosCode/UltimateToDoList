/**
 * ResetPasswordPage
 * Página de restablecimiento de contraseña
 */

import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Ingresa tu nueva contraseña"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}

export default ResetPasswordPage;
