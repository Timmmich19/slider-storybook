import {faker} from '@faker-js/faker'

faker.seed(1919)

export type EventsData = {titleYear: number; desc: string}
export type AgesInterval = {from: number; to: number; events: EventsData[]}

export interface MockDataOptions {
  periodCount?: number // количество периодов
  eventsPerPeriod?: number // событий на период
  startYear?: number // год начала отсчета деления на периоды
  yearsPerPeriod?: number // лет в периоде
}

export const generateAges = (options: MockDataOptions = {}): AgesInterval[] => {
  const {periodCount = 8, eventsPerPeriod = {min: 4, max: 6}, startYear = 1990, yearsPerPeriod = 5} = options

  const periods: AgesInterval[] = []

  for (let i = 0; i < periodCount; i++) {
    const from = startYear + i * yearsPerPeriod
    const to = from + yearsPerPeriod - 1

    // Количество событий в периоде
    const eventCount =
      typeof eventsPerPeriod === 'number'
        ? eventsPerPeriod
        : faker.number.int({
            min: eventsPerPeriod.min,
            max: eventsPerPeriod.max
          })

    const events: EventsData[] = []

    for (let j = 0; j < eventCount; j++) {
      const eventDate = faker.date.between({
        from: new Date(`${from}-01-01`),
        to: new Date(`${to}-12-31`)
      })

      const year = eventDate.getFullYear()

      const monthNames = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря'
      ]

      const day = eventDate.getDate()
      const month = monthNames[eventDate.getMonth()]

      // Более длинные и реалистичные описания событий
      const eventTemplates = [
        `${day} ${month} — ${faker.company.name()} официально представила революционную технологию ${faker.commerce.productName()}, которая изменила индустрию`,
        `${day} ${month} — Впервые в истории человечества ученые ${faker.location.city()} обнаружили уникальное природное явление ${faker.lorem.words(
          4
        )}`,
        `${day} ${month} — Запуск новаторского проекта ${faker.commerce.productName()} от компании ${faker.company.name()}, который установил мировой рекорд`,
        `${day} ${month} — ${faker.person.fullName()} получил престижную международную премию за выдающиеся достижения в области ${faker.lorem.words(
          3
        )}`,
        `${day} ${month} — В ${faker.location.country()} открыли крупнейший в мире объект ${faker.lorem.words(
          2
        )}, который привлек внимание ученых со всего мира`,
        `${day} ${month} — Произошло редкое астрономическое событие — ${faker.lorem.words(
          5
        )}, видимое в нескольких континентах`,
        `${day} ${month} — ${faker.company.name()} объявила о прорыве в ${faker.hacker.noun()} с использованием искусственного интеллекта`
      ]

      const desc = faker.helpers.arrayElement(eventTemplates)
      events.push({titleYear: year, desc})
    }

    periods.push({from, to, events})
  }

  return periods
}
