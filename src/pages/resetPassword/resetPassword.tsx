import React, { useState } from 'react';
import formStyles from '../form.module.css';
import { Button, Input, PasswordInput } from '@ya.praktikum/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://norma.nomoreparties.space/api/password-reset/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token: code }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сброса пароля');
      }

      const data = await response.json();

      if (data.success) {
        navigate('/login');
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
        <PasswordInput
          name="password"
          value={password}
          placeholder={'Введите новый пароль'}
          extraClass={formStyles.input}
          onChange={handlePasswordChange}
        />
        <Input
          name="code"
          placeholder={'Введите код из письма'}
          value={code}
          extraClass={formStyles.input}
          onChange={handleCodeChange} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        />
        {error && <p className="text text_type_main-small text_color_error">{error}</p>}
        <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
          {isLoading ? 'Загрузка...' : 'Сохранить'}
        </Button>
        <p className={`text text_type_main-small text_color_inactive ${formStyles.loginText}`}>
          Вспомнили пароль? <a href="/login" className={formStyles.loginLink}>Войти</a>
        </p>
      </form>
    </div>
  );
}

export { ResetPassword };
