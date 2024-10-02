import React, { useState } from 'react';
import formStyles from '../form.module.css';
import { Button, Input } from '@ya.praktikum/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://norma.nomoreparties.space/api/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Ошибка восстановления пароля');
      }

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('forgotPasswordInitiated', 'true');
        navigate('/reset-password');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={formStyles.wrapper}>
      <form className={formStyles.form} onSubmit={handleSubmit}>
        <h1 className={`${formStyles.heading} text text_type_main-medium`}>Восстановление пароля</h1>
        <Input
          type="email"
          placeholder="E-mail"
          name="email"
          value={email}
          extraClass={formStyles.input}
          onChange={handleEmailChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        />
        {error && <p className="text text_type_main-small text_color_error">{error}</p>}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Восстановить'}
        </Button>
        <p className={`text text_type_main-small text_color_inactive ${formStyles.loginText}`}>
          Вспомнили пароль? <a href="/login" className={formStyles.loginLink}>Войти</a>
        </p>
      </form>
    </div>
  );
}

export { ForgotPassword };
