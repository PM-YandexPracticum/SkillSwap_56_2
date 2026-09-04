import { useState } from 'react' // 1. Импортируем useState
import { Input } from '../../shared/ui/Input/input'
import styles from '../../shared/ui/Input/Input.module.css'

export default function RegisterStep3() {
  // 2. Создаем стейт для хранения значения
  const [email, setEmail] = useState('')

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.form}>
          {/* 3. Передаем value и onChange в компонент */}
          <Input
            label="Email"
            placeholder="Введите ваш email"
            value={email}
            onChange={(value) => setEmail(value)}
            className={styles.fullInputRegister}
            error="Пожалуйста, введите действительный email"
          />

          {/* Можно вывести для проверки прямо на странице */}
          <p>Введенный email: {email}</p>
        </div>
      </div>
    </div>
  )
}
