import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Palette } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    username: '',
    first_name: '',
    last_name: '',
    user_type: 'buyer'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.password_confirm) {
          throw new Error("Passwords don't match");
        }
        
        const registrationData = {
          username: formData.username,
          email: formData.email,
          password: formData.password
        };
        await register(registrationData);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      password_confirm: '',
      username: '',
      first_name: '',
      last_name: '',
      user_type: 'buyer'
    });
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.authCard}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <Palette size={32} color="#4574a1" />
            <h1 style={styles.logo}>Artify</h1>
          </div>
          <h2 style={styles.title}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={styles.subtitle}>
            {isLogin 
              ? 'Sign in to explore amazing artworks' 
              : 'Join our community of art lovers and creators'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <div style={styles.inputRow}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>First Name</label>
                  <div style={styles.inputContainer}>
                    <User size={18} style={styles.inputIcon} />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="John"
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Last Name</label>
                  <div style={styles.inputContainer}>
                    <User size={18} style={styles.inputIcon} />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      style={styles.input}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputContainer}>
                  <User size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe123"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Account Type</label>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="buyer">Art Collector/Buyer</option>
                  <option value="artist">Artist/Creator</option>
                </select>
              </div>
            </>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputContainer}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputContainer}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                style={styles.input}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputContainer}>
                <Lock size={18} style={styles.inputIcon} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {isLogin && (
            <div style={styles.forgotPassword}>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot your password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <div style={styles.loadingSpinner} />
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <div style={styles.toggleContainer}>
          <span style={styles.toggleText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            type="button"
            onClick={toggleAuthMode}
            style={styles.toggleButton}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fefa',
    padding: '20px',
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#0c151d',
    margin: 0,
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0c151d',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputRow: {
    display: 'flex',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#6b7280',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.2s ease',
    outline: 'none',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: '-8px',
  },
  forgotLink: {
    color: '#4574a1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4574a1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '48px',
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid transparent',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  toggleContainer: {
    textAlign: 'center',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
  },
  toggleText: {
    color: '#6b7280',
    fontSize: '14px',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    color: '#4574a1',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'underline',
    marginLeft: '4px',
  },
};

// Add CSS for spinner animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus, select:focus {
    border-color: #4574a1 !important;
    box-shadow: 0 0 0 3px rgba(69, 116, 161, 0.1);
  }
  
  button:hover .submitButton {
    background-color: #3a5d84 !important;
  }
`;
document.head.appendChild(styleSheet);

export default AuthPage;