/**
 * AuthContext
 * Definición del contexto de autenticación
 */

import { createContext } from 'react';

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string|null} avatarUrl
 * @property {boolean} isEmailVerified
 * @property {string} authProvider
 * @property {string|null} googleId
 * @property {string|null} facebookId
 * @property {string} createdAt
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {User|null} user
 * @property {boolean} isLoading
 * @property {boolean} isAuthenticated
 * @property {string|null} error
 * @property {Function} login
 * @property {Function} register
 * @property {Function} logout
 * @property {Function} loginWithGoogle
 * @property {Function} loginWithFacebook
 * @property {Function} updateUser
 * @property {Function} clearError
 */

export const AuthContext = createContext(null);

export default AuthContext;
