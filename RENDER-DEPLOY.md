# 🚀 Деплой на Render — Пошаговая инструкция

## Шаг 1: Загрузи код на GitHub

1. Зайди на [github.com](https://github.com) и войди в аккаунт
2. Создай новый репозиторий (New repository)
3. Назови его, например, `birthday-wishlist`
4. Загрузи файлы:

```bash
cd D:\birthday-wishlist
git init
git add .
git commit -m "Birthday wishlist app"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/birthday-wishlist.git
git push -u origin main
```

## Шаг 2: Создай аккаунт на Render

1. Зайди на [render.com](https://render.com)
2. Нажми **Sign Up** → выбери **GitHub** (чтобы подключить репозиторий)
3. Авторизуйся через GitHub

## Шаг 3: Создай Web Service

1. На главной странице нажми **New +** → **Web Service**
2. Подключи свой GitHub репозиторий `birthday-wishlist`
3. Настрой параметры:

| Поле | Значение |
|------|----------|
| **Name** | `birthday-wishlist` |
| **Region** | Frankfurt (или ближайший) |
| **Branch** | `main` |
| **Root Directory** | (оставь пустым) |
| **Runtime** | `Node` |
| **Build Command** | `cd backend && npm install && npm run build` |
| **Start Command** | `cd backend && npm start` |
| **Health Check Path** | `/api/health` |

4. Нажми **Create Web Service**

## Шаг 4: Жди деплой

Render автоматически:
- Установит зависимости
- Соберёт frontend и admin
- Запустит backend
- Выдаст ссылку

⏱️ Обычно занимает 3-5 минут

## Шаг 5: Готово!

После деплоя получишь ссылку типа:
```
https://birthday-wishlist.onrender.com
```

| Приложение | URL |
|------------|-----|
| Гости | `https://birthday-wishlist.onrender.com` |
| Именинница | `https://birthday-wishlist.onrender.com/admin` |

## ⚠️ Важно

- Сайт «засыпает» через 15 минут без активности
- При первом заходе после сна нужно подождать ~30 секунд
- SQLite сбрасывается при перезапуске, но данные автоматически заполняются заново

## 🔧 Если что-то пошло не так

1. Проверь логи на странице сервиса в Render
2. Убедись, что `render.yaml` корректно настроен
3. Проверь, что все файлы загружены на GitHub

## 📱 Поделись ссылкой с гостями

Просто отправь ссылку `https://birthday-wishlist.onrender.com` всем гостям — они смогут выбирать подарки! 🎉
