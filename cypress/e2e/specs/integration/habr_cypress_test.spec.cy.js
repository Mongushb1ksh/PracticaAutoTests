describe('Тестирование платформы ProfTeam', () => {
  // Позитивные тесты

  describe('Создание новой потребности как работодатель', () => {
    beforeEach(() => {
      cy.visit('https://dev.profteam.su/login');
      cy.get('input[autocomplete="username"]', { timeout: 10000 }).type('testerEmployer');
      cy.get('input[autocomplete="current-password"]').type('Password1');
      cy.contains('Войти').click();
    });

    it('должно создавать успешную потребность', () => {
      cy.contains('p.menu-item__item-name', 'Потребности').click();
      cy.wait(2000);
      cy.contains('button.button__background-color-green', 'Создать потребность').click();
      cy.wait(2000);
      cy.get('input[placeholder="Кладовщик"]').eq(0).type('Тестовая потребность');
      cy.get('textarea[placeholder="Обязанности сотрудника"]').eq(0).type('Тестовое описание обязанности');
      cy.get('textarea[placeholder="Ваши требования"]').eq(0).type('Тестовое описание требования');
      cy.contains('[data-v-dacc824f]', 'Создать потребность').click({ force: true });
      cy.contains('Опубликовать').eq(0).click({ force: true });
      cy.url().should('include', '/needs');
      cy.contains('Выйти').click();
    });
  });

  describe('Просмотр потребности студентом, фильтрация и поиск, отклик на потребность', () => {
    before(() => {
      cy.visit('https://dev.profteam.su/login');
      cy.get('input[autocomplete="username"]', { timeout: 10000 }).type('testerStudent');
      cy.get('input[autocomplete="current-password"]').type('Password1');
      cy.contains('Войти').click();
    });

    it('должно отображать потребности и позволять фильтрацию, а также откликнуться', () => {
      cy.wait(3000);
      cy.contains('a', 'Потребности').click();
      cy.get('input[placeholder="Название..."]').eq(0).type('Тестовая потребность');
      cy.get('button.search-input__button').click();
      cy.get('div[class="form-select__selected"]').click();
      cy.contains('div', 'Очный').click();
      cy.contains('Откликнуться').eq(0).click({ force: true });
    });
  });

  describe('Подтверждение отклика как работодатель', () => {
    beforeEach(() => {
      cy.visit('https://dev.profteam.su/login');
      cy.get('input[autocomplete="username"]', { timeout: 10000 }).type('testerEmployer');
      cy.get('input[autocomplete="current-password"]').type('Password1');
      cy.contains('Войти').click();
    });

    it('должно успешно подтвердить отклик студента', () => {
      cy.contains('p.menu-item__item-name', 'Отклики').click();
      cy.wait(2000);
      cy.get('svg[viewBox="0 0 18 18"]').eq(0).click({ force: true });
      cy.wait(2000);
      cy.contains('Одобрены').click();
    });

    it('должно позволять взаимодействие внутри рабочего пространства', () => {
      cy.contains('p.menu-item__item-name', 'Отклики').click();
      cy.contains('Рабочее пространство').eq(0).click();
      cy.get('textarea[placeholder="Напишите комментарий..."]').eq(0).type('Здарова братиш');
      cy.get('.send-message-icon[data-v-7f5aea66]').click({ force: true });
      cy.contains('Выйти').click();
    });
  });

  describe('Смена статуса рабочего пространства', () => {
    beforeEach(() => {
      cy.visit('https://dev.profteam.su/login');
      cy.get('input[autocomplete="username"]', { timeout: 10000 }).type('testerEmployer');
      cy.get('input[autocomplete="current-password"]').type('Password1');
      cy.contains('Войти').click();
    });

    it('должно успешно изменить статус рабочего пространства', () => {
      cy.contains('p.menu-item__item-name', 'Отклики').click();
      cy.contains('Рабочее пространство').eq(0).click();
      cy.contains('Потребность выполнена').click();
    });
  });

  // Негативные тесты

  describe('Негативные тесты авторизации', () => {
    it('должно показывать ошибку при неверном логине', () => {
      cy.visit('https://dev.profteam.su/login');
      cy.get('input[autocomplete="username"]').type('wrongLogin');
      cy.get('input[autocomplete="current-password"]').type('Password1');
      cy.contains('Войти').click();
      cy.contains('Неверный логин или пароль, попробуйте заново.').should('be.visible');
    });

    it('должно показывать ошибку при неверном пароле', () => {
      cy.visit('https://dev.profteam.su/login');
      cy.get('input[autocomplete="username"]').type('testerEmployer');
      cy.get('input[autocomplete="current-password"]').type('wrongPassword');
      cy.contains('Войти').click();
      cy.contains('Неверный логин или пароль, попробуйте заново.').should('be.visible');
    });
  });

  describe('Негативные тесты создания потребности', () => {
    beforeEach(() => {
      cy.visit('https://dev.profteam.su/login');
      cy.get('input[autocomplete="username"]').type('testerEmployer');
      cy.get('input[autocomplete="current-password"]').type('Password1');
      cy.contains('Войти').click();
    });

    it('должно блокировать создание без названия', () => {
        cy.contains('p.menu-item__item-name', 'Потребности').click();
        cy.wait(2000);
        cy.contains('button.button__background-color-green', 'Создать потребность').click();
        cy.wait(2000);
        cy.get('textarea[placeholder="Обязанности сотрудника"]').eq(0).type('Тестовое описание обязанности');
        cy.get('textarea[placeholder="Ваши требования"]').eq(0).type('Тестовое описание требования');
        cy.contains('[data-v-dacc824f]', 'Создать потребность').click({ force: true });
      });
    });
  });

  describe('Негативные тесты поиска и фильтрации', () => {
    beforeEach(() => {
      cy.visit('https://dev.profteam.su/login');
      cy.get('input[autocomplete="username"]').type('testerStudent');
      cy.get('input[autocomplete="current-password"]').type('Password1');
      cy.contains('Войти').click();
    });

    it('должно показывать сообщение об отсутствии результатов', () => {
      cy.wait(3000);
      cy.contains('a', 'Потребности').click();
      cy.get('input[placeholder="Название..."]').eq(0).type('QWEasd123');
      cy.get('button.search-input__button').click();
      cy.get('div[class="form-select__selected"]').click();
      cy.contains('div', 'Очный').click();
      cy.wait(3000)
      cy.contains('Потребности не найдены').should('be.visible')
    });

  });