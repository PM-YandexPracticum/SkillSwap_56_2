import { useEffect, useState } from 'react'

import { ArrowButton } from '@/shared/ui/ArrowButton'
import { Checkbox } from '@/shared/ui/Checkbox'

import styles from './ListCitiesFilter.module.css'

interface City {
  id: string
  title: string
}

const INITIAL_CITIES_COUNT = 5

export const ListCitiesFilter = () => {
  const [cities, setCities] = useState<City[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetch('/db/cities.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось загрузить города')
        }

        return response.json()
      })
      .then((data: City[]) => {
        setCities(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const initialCities = cities.slice(0, INITIAL_CITIES_COUNT)
  const extraCities = cities.slice(INITIAL_CITIES_COUNT)

  const handleCityChange = (cityId: string) => {
    setSelectedCities((prevSelectedCities) =>
      prevSelectedCities.includes(cityId)
        ? prevSelectedCities.filter((id) => id !== cityId)
        : [...prevSelectedCities, cityId],
    )
  }

  const handleToggleCities = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Город</h3>

      <div className={styles.list}>
        {initialCities.map((city) => (
          <Checkbox
            key={city.id}
            label={city.title}
            checked={selectedCities.includes(city.id)}
            onChange={() => handleCityChange(city.id)}
          />
        ))}
      </div>

      <div
        className={`${styles.extraCities} ${isOpen ? styles.extraCitiesOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <div className={styles.extraCitiesInner}>
          <div className={styles.extraList}>
            {extraCities.map((city) => (
              <Checkbox
                key={city.id}
                label={city.title}
                checked={selectedCities.includes(city.id)}
                onChange={() => handleCityChange(city.id)}
                tabIndex={isOpen ? 0 : -1}
              />
            ))}
          </div>
        </div>
      </div>

      <ArrowButton
        isOpen={isOpen}
        onClick={handleToggleCities}
        variant="tertiary"
        className={styles.showAllButton}
      >
        <span className={styles.showAllText}>Все города</span>
      </ArrowButton>
    </div>
  )
}
