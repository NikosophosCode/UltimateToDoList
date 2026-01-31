/**
 * RegisterPage
 * Página de registro de usuario
 */

import React from 'react';
import AuthLayout from '../../components/auth/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';
import SocialAuthButtons from '../../components/auth/SocialAuthButtons';

function RegisterPage() {
  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Regístrate para empezar a organizar tus tareas"
    >
      {/* Social Auth */}
      <SocialAuthButtons mode="register" />

      {/* Register Form */}
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
