
import { Input } from '../../shared/ui/Input/input'
import styles from '../../shared/ui/Input/Input.module.css'

export default function RegisterStep3() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.form}>
          <Input
            placeholder="Искать навык"
            className={styles.headerInput}
            leftElement={<span>🔍</span>}
          />

          <Input
            label="Название навыка"
            placeholder="Введите название вашего навыка"
            className={styles.fullInputRegister}
          />

          <div className={styles.row}>
            <Input
              label="Дата рождения"
              placeholder="дд.мм.гггг"
              rightElement={<span>📅</span>}
              className={styles.shortInputRegister}
            />

            <Input
              label="Пол"
              placeholder="Выберите пол"
              rightElement={<span>▼</span>}
              className={styles.shortInputRegister}
            />
          </div>
          <Input
            label="Категория навыка"
            placeholder="Выберите категорию навыка"
            className={styles.fullInputRegister}
          />

          <Input
            label="Подкатегория навыка"
            placeholder="Выберите подкатегорию навыка"
            className={styles.fullInputRegister}
          />

          <Input
            label="Описание"
            multiline={true}
            placeholder="Коротко опишите, чему можете научить"
            className={styles.fullInputRegister}
            heightTextarea={styles.textareaHeightRegister}
          />

          <Input
            label="Email"
            placeholder="Введите ваш email"
            className={styles.fullInputRegister}
            error="Пожалуйста, введите действительный email"
          />
          <Input
            label="Пароль"
            placeholder="Введите ваш пароль"
            type="password"
            className={styles.fullInputRegister}
            helperText="Пароль должен содержать не менее 8 символов"
          />
        </div>
      </div>
    </div>
  )
}
